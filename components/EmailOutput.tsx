"use client";

import { useState } from "react";

export interface AnalysisData {
  candidate_analysis: {
    name: string;
    skills: string[];
    projects: string[];
    strengths: string[];
    weaknesses: string[];
  };
  job_analysis: {
    required_skills: string[];
    preferred_skills: string[];
    responsibilities: string[];
  };
  match_analysis: {
    match_percentage: number;
    matched_skills: string[];
    missing_skills: string[];
    suggestions: string[];
  };
  cold_email: {
    subject: string;
    email_body: string;
  };
  follow_up_email: {
    subject: string;
    email_body: string;
  };
}

interface EmailOutputProps {
  analysis: AnalysisData;
}

export default function EmailOutput({ analysis }: EmailOutputProps) {
  const [activeTab, setActiveTab] = useState<"cold" | "followup" | "match">("cold");
  const [copiedCold, setCopiedCold] = useState(false);
  const [copiedFollowup, setCopiedFollowup] = useState(false);

  const {
    candidate_analysis,
    match_analysis,
    cold_email,
    follow_up_email,
  } = analysis;

  const handleCopy = async (text: string, type: "cold" | "followup") => {
    try {
      await navigator.clipboard.writeText(text);
      if (type === "cold") {
        setCopiedCold(true);
        setTimeout(() => setCopiedCold(false), 2000);
      } else {
        setCopiedFollowup(true);
        setTimeout(() => setCopiedFollowup(false), 2000);
      }
    } catch {
      // Fallback for older browsers
      const textarea = document.createElement("textarea");
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      if (type === "cold") {
        setCopiedCold(true);
        setTimeout(() => setCopiedCold(false), 2000);
      } else {
        setCopiedFollowup(true);
        setTimeout(() => setCopiedFollowup(false), 2000);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Navigation Tabs */}
      <div className="flex p-1 bg-gray-950 border border-white/10 rounded-xl">
        <button
          onClick={() => setActiveTab("cold")}
          className={`flex-1 text-center py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
            activeTab === "cold"
              ? "bg-violet-600 text-white shadow-md shadow-violet-600/10"
              : "text-gray-400 hover:text-white"
          }`}
        >
          Cold Email
        </button>
        <button
          onClick={() => setActiveTab("followup")}
          className={`flex-1 text-center py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
            activeTab === "followup"
              ? "bg-violet-600 text-white shadow-md shadow-violet-600/10"
              : "text-gray-400 hover:text-white"
          }`}
        >
          Follow-up Email
        </button>
        <button
          onClick={() => setActiveTab("match")}
          className={`flex-1 text-center py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
            activeTab === "match"
              ? "bg-violet-600 text-white shadow-md shadow-violet-600/10"
              : "text-gray-400 hover:text-white"
          }`}
        >
          Match Analysis
        </button>
      </div>

      {/* Tab content 1: Cold Email */}
      {activeTab === "cold" && (
        <div className="space-y-4 animate-fadeIn">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-violet-400">
              Personalized Outreach Email
            </span>
            <button
              onClick={() => handleCopy(`Subject: ${cold_email.subject}\n\n${cold_email.email_body}`, "cold")}
              className={`flex items-center gap-2 text-xs px-3.5 py-1.5 rounded-lg transition-all duration-200 ${
                copiedCold
                  ? "bg-green-500/20 text-green-400 border border-green-500/30"
                  : "bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10 hover:text-white"
              }`}
            >
              {copiedCold ? "Copied!" : "Copy Full Email"}
            </button>
          </div>

          <div className="bg-gray-950 border border-white/10 rounded-2xl p-6 space-y-4">
            <div>
              <span className="text-xs font-semibold text-gray-500 block mb-1">SUBJECT:</span>
              <p className="text-white font-medium text-sm border-b border-white/5 pb-3">
                {cold_email.subject}
              </p>
            </div>
            <div>
              <span className="text-xs font-semibold text-gray-500 block mb-2">EMAIL BODY:</span>
              <pre className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap font-sans">
                {cold_email.email_body}
              </pre>
            </div>
          </div>
        </div>
      )}

      {/* Tab content 2: Follow-up Email */}
      {activeTab === "followup" && (
        <div className="space-y-4 animate-fadeIn">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-violet-400">
              5-7 Day Follow-Up Template
            </span>
            <button
              onClick={() => handleCopy(`Subject: ${follow_up_email.subject}\n\n${follow_up_email.email_body}`, "followup")}
              className={`flex items-center gap-2 text-xs px-3.5 py-1.5 rounded-lg transition-all duration-200 ${
                copiedFollowup
                  ? "bg-green-500/20 text-green-400 border border-green-500/30"
                  : "bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10 hover:text-white"
              }`}
            >
              {copiedFollowup ? "Copied!" : "Copy Full Email"}
            </button>
          </div>

          <div className="bg-gray-950 border border-white/10 rounded-2xl p-6 space-y-4">
            <div>
              <span className="text-xs font-semibold text-gray-500 block mb-1">SUBJECT:</span>
              <p className="text-white font-medium text-sm border-b border-white/5 pb-3">
                {follow_up_email.subject}
              </p>
            </div>
            <div>
              <span className="text-xs font-semibold text-gray-500 block mb-2">EMAIL BODY:</span>
              <pre className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap font-sans">
                {follow_up_email.email_body}
              </pre>
            </div>
          </div>
        </div>
      )}

      {/* Tab content 3: Match Analysis */}
      {activeTab === "match" && (
        <div className="space-y-6 animate-fadeIn">
          {/* Match Score circular-style layout */}
          <div className="flex items-center gap-5 p-5 bg-white/3 border border-white/5 rounded-2xl">
            <div className="flex items-center justify-center w-20 h-20 rounded-full border-4 border-violet-500 bg-violet-500/10 shadow-lg shadow-violet-500/15">
              <span className="text-2xl font-bold text-white">
                {match_analysis.match_percentage}%
              </span>
            </div>
            <div>
              <h3 className="text-white font-semibold text-base">ATS Compatibility Rating</h3>
              <p className="text-gray-500 text-xs mt-1">
                Calculated by matching candidate technical skills, education, and projects against JD requirements.
              </p>
            </div>
          </div>

          {/* Matched vs Missing Skills comparison */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Matched Skills */}
            <div className="p-4 bg-green-500/5 border border-green-500/10 rounded-xl">
              <span className="text-xs font-bold text-green-400 uppercase tracking-wider block mb-3">
                Matched Skills ({match_analysis.matched_skills.length})
              </span>
              <div className="flex flex-wrap gap-2">
                {match_analysis.matched_skills.map((skill, i) => (
                  <span
                    key={i}
                    className="bg-green-500/10 border border-green-500/20 text-green-300 text-xs px-2.5 py-1 rounded-md"
                  >
                    {skill}
                  </span>
                ))}
                {match_analysis.matched_skills.length === 0 && (
                  <span className="text-gray-500 text-xs">No overlapping skills found.</span>
                )}
              </div>
            </div>

            {/* Missing Skills */}
            <div className="p-4 bg-red-500/5 border border-red-500/10 rounded-xl">
              <span className="text-xs font-bold text-red-400 uppercase tracking-wider block mb-3">
                Missing / Gaps ({match_analysis.missing_skills.length})
              </span>
              <div className="flex flex-wrap gap-2">
                {match_analysis.missing_skills.map((skill, i) => (
                  <span
                    key={i}
                    className="bg-red-500/10 border border-red-500/20 text-red-300 text-xs px-2.5 py-1 rounded-md"
                  >
                    {skill}
                  </span>
                ))}
                {match_analysis.missing_skills.length === 0 && (
                  <span className="text-gray-500 text-xs">No missing key skills.</span>
                )}
              </div>
            </div>
          </div>

          {/* Strengths & Weaknesses lists */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Strengths */}
            <div className="p-4 bg-white/3 border border-white/5 rounded-xl space-y-2">
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-1">
                Candidate Strengths
              </span>
              <ul className="list-disc pl-4 space-y-1.5 text-xs text-gray-300">
                {candidate_analysis.strengths.map((str, i) => (
                  <li key={i}>{str}</li>
                ))}
              </ul>
            </div>

            {/* Weaknesses */}
            <div className="p-4 bg-white/3 border border-white/5 rounded-xl space-y-2">
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-1">
                Resume Weaknesses
              </span>
              <ul className="list-disc pl-4 space-y-1.5 text-xs text-gray-300">
                {candidate_analysis.weaknesses.map((weak, i) => (
                  <li key={i}>{weak}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Suggestions for Improvement */}
          <div className="p-5 bg-violet-600/5 border border-violet-500/15 rounded-2xl space-y-3">
            <span className="text-xs font-semibold text-violet-400 uppercase tracking-wider block">
              Suggestions & Next Steps
            </span>
            <ul className="space-y-2.5">
              {match_analysis.suggestions.map((sug, i) => (
                <li key={i} className="flex gap-2 text-xs text-gray-300 leading-relaxed">
                  <span className="text-violet-400 font-bold">•</span>
                  <span>{sug}</span>
                </li>
              ))}
              {match_analysis.suggestions.length === 0 && (
                <li className="text-gray-500 text-xs">No suggestions for improvement.</li>
              )}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
