import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getUserFromRequest } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Zod validation schema for the updated email generation form
const generateSchema = z.object({
  recipientName: z.string().min(1, "Recipient name is required"),
  companyName: z.string().min(1, "Company name is required"),
  userRole: z.string().min(1, "Target role is required"),
  tone: z.enum(["professional", "friendly", "formal", "enthusiastic"]),
  resumeText: z.string().min(10, "Resume must be at least 10 characters"),
  jobDescription: z.string().min(10, "Job description must be at least 10 characters"),
  candidateName: z.string().optional().nullable(),
  portfolioUrl: z.string().optional().nullable(),
  gitHubUrl: z.string().optional().nullable(),
  linkedInUrl: z.string().optional().nullable(),
});

export async function POST(req: NextRequest) {
  try {
    // 1. Check if user is authenticated
    const user = await getUserFromRequest(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Validate form input
    const body = await req.json();
    const result = generateSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: result.error.errors[0].message },
        { status: 400 }
      );
    }

    const {
      recipientName,
      companyName,
      userRole,
      tone,
      resumeText,
      jobDescription,
      candidateName,
      portfolioUrl,
      gitHubUrl,
      linkedInUrl,
    } = result.data;

    // 3. Build the prompt for the AI Career Assistant
    const prompt = `You are an expert AI career assistant integrated into an AI-powered cold email generator platform.
Your task is to analyze the candidate's resume and the job description, identify skill gaps, evaluate compatibility, and generate a highly personalized cold email & follow-up email for internship/job outreach.

========================
CANDIDATE DETAILS
========================
Name: ${candidateName || "Candidate"}
Target Role: ${userRole}
Tone Preference: ${tone}
Portfolio Links: ${portfolioUrl || "Not provided"}
GitHub: ${gitHubUrl || "Not provided"}
LinkedIn: ${linkedInUrl || "Not provided"}

========================
RESUME TEXT
========================
${resumeText}

========================
JOB DESCRIPTION
========================
${jobDescription}

========================
OUTREACH TARGET
========================
Recipient Name: ${recipientName}
Company Name: ${companyName}

========================
YOUR RESPONSIBILITIES
========================
1. ANALYZE RESUME: Extract candidate name, technical skills, projects, experience, education, strengths, weaknesses, and standout projects.
2. ANALYZE JOB DESCRIPTION: Extract required skills, preferred skills, responsibilities, tech stack, and keywords.
3. MATCH ANALYSIS: Calculate a realistic resume match percentage (0-100), matched/missing/partially matched skills, suggested improvements, and ATS keywords. Suitability reasoning.
4. GENERATE COLD EMAIL: Generate a concise, human-sounding cold email. Emphasize matching projects, skills, and the company. Sound enthusiastic, include a CTA, and tone: ${tone}.
5. GENERATE FOLLOW-UP EMAIL: Generate a short follow-up outreach email to send after 5-7 days if no response.

Rules:
* Never hallucinate fake experience or invent projects.
* Emphasize projects, github/portfolio (if provided), and learning attitude if experience is low.
* Avoid robotic AI sounding fluff. Keep it realistic.

Return the response in JSON format matching this schema exactly:
{
  "candidate_analysis": {
    "name": "${candidateName || "Candidate"}",
    "skills": ["extracted technical skills"],
    "projects": ["extracted project names/details"],
    "strengths": ["strengths"],
    "weaknesses": ["weaknesses/areas to improve"]
  },
  "job_analysis": {
    "required_skills": ["required skills"],
    "preferred_skills": ["preferred/desired skills"],
    "responsibilities": ["core responsibilities"]
  },
  "match_analysis": {
    "match_percentage": 85,
    "matched_skills": ["skills in both"],
    "missing_skills": ["JD skills missing from resume"],
    "suggestions": ["actionable improvement tips"]
  },
  "cold_email": {
    "subject": "Subject line",
    "email_body": "Cold email body"
  },
  "follow_up_email": {
    "subject": "Follow-up subject line",
    "email_body": "Follow-up email body"
  }
}`;

    // 4. Call the Google Gemini API
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
    if (!GEMINI_API_KEY) {
      return NextResponse.json(
        { error: "AI API key not configured. Please add GEMINI_API_KEY to .env.local" },
        { status: 500 }
      );
    }

    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    
    // We try multiple Gemini models in order of preference to automatically handle 
    // deprecations, region limitations, or rate limits on specific tiers.
    const modelsToTry = [
      "gemini-3.5-flash",
      "gemini-3-flash",
      "gemini-2.5-flash",
      "gemini-1.5-flash"
    ];

    let generatedText = "";
    let lastError: Error | null = null;

    for (const modelName of modelsToTry) {
      try {
        console.log(`Attempting Career Matcher with model: ${modelName}`);
        const model = genAI.getGenerativeModel({ model: modelName });
        const aiResult = await model.generateContent({
          contents: [{ role: "user", parts: [{ text: prompt }] }],
          generationConfig: {
            responseMimeType: "application/json",
          }
        });
        
        generatedText = aiResult.response.text();
        if (generatedText) {
          console.log(`Successfully generated analysis using: ${modelName}`);
          break;
        }
      } catch (err: unknown) {
        const error = err as Error;
        console.warn(`Model ${modelName} failed:`, error.message || error);
        lastError = error;
      }
    }

    if (!generatedText) {
      const errorMessage = lastError?.message || String(lastError || "Unknown error");
      return NextResponse.json(
        { error: `AI generation failed: ${errorMessage}. Please check your API key, region permissions, and quota limits.` },
        { status: 500 }
      );
    }

    // Verify it is parseable JSON
    let parsedData;
    try {
      // Remove potential markdown code blocks if any
      const cleanedText = generatedText.replace(/^```json\s*/i, "").replace(/```$/, "").trim();
      parsedData = JSON.parse(cleanedText);
    } catch {
      console.error("Failed to parse Gemini JSON output:", generatedText);
      return NextResponse.json(
        { error: "AI model returned invalid JSON structure. Please try again." },
        { status: 500 }
      );
    }

    // 5. Save the generated email to the database
    // We store the full JSON string in generatedContent to preserve match analysis
    const savedEmail = await prisma.generatedEmail.create({
      data: {
        userId: user.userId,
        recipientName,
        companyName,
        userRole,
        purpose: `Resume Matcher - ${resumeText.substring(0, 100)}...`,
        tone,
        generatedContent: JSON.stringify(parsedData),
      },
    });

    // 6. Return the parsed analysis to the frontend
    return NextResponse.json({
      analysis: parsedData,
      id: savedEmail.id,
    });
  } catch (error) {
    console.error("Generate email error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
