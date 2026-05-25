"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { AnalysisData } from "./EmailOutput";

// Form validation schema supporting the Career Matcher fields
const formSchema = z.object({
  recipientName: z.string().min(1, "Recipient name is required"),
  companyName: z.string().min(1, "Company name is required"),
  userRole: z.string().min(1, "Target role is required"),
  tone: z.enum(["professional", "friendly", "formal", "enthusiastic"]),
  resumeText: z.string().min(10, "Resume must be at least 10 characters"),
  jobDescription: z.string().min(10, "Job description must be at least 10 characters"),
  candidateName: z.string().optional(),
  portfolioUrl: z.string().optional(),
  gitHubUrl: z.string().optional(),
  linkedInUrl: z.string().optional(),
});

// TypeScript type inferred from the schema
type FormData = z.infer<typeof formSchema>;

interface EmailFormProps {
  onAnalysisGenerated: (analysis: AnalysisData) => void;
}

export default function EmailForm({ onAnalysisGenerated }: EmailFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [showOptionalFields, setShowOptionalFields] = useState(false);

  // React Hook Form setup with Zod validation
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: { tone: "professional" },
  });

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    setApiError(null);

    try {
      const res = await fetch("/api/email/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (!res.ok) {
        setApiError(result.error || "Failed to generate compatibility analysis");
        return;
      }

      // Pass generated analysis JSON back to dashboard
      onAnalysisGenerated(result.analysis);
    } catch {
      setApiError("Network error. Please check your connection and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {/* Error Banner */}
      {apiError && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
          <p className="text-red-400 text-sm">{apiError}</p>
        </div>
      )}

      {/* Two-column grid for Recipient & Company */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Recipient Name */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1.5">
            Recipient Name
          </label>
          <input
            {...register("recipientName")}
            type="text"
            placeholder="e.g. Sarah Johnson"
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-violet-500/60 focus:ring-1 focus:ring-violet-500/30 transition-all"
          />
          {errors.recipientName && (
            <p className="text-red-400 text-xs mt-1">
              {errors.recipientName.message}
            </p>
          )}
        </div>

        {/* Company Name */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1.5">
            Company Name
          </label>
          <input
            {...register("companyName")}
            type="text"
            placeholder="e.g. Google"
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-violet-500/60 focus:ring-1 focus:ring-violet-500/30 transition-all"
          />
          {errors.companyName && (
            <p className="text-red-400 text-xs mt-1">
              {errors.companyName.message}
            </p>
          )}
        </div>
      </div>

      {/* Two-column grid for Target Role & Tone */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Target Role */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1.5">
            Target Role
          </label>
          <input
            {...register("userRole")}
            type="text"
            placeholder="e.g. Frontend Developer"
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-violet-500/60 focus:ring-1 focus:ring-violet-500/30 transition-all"
          />
          {errors.userRole && (
            <p className="text-red-400 text-xs mt-1">
              {errors.userRole.message}
            </p>
          )}
        </div>

        {/* Tone */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1.5">
            Tone
          </label>
          <select
            {...register("tone")}
            className="w-full bg-gray-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-violet-500/60 focus:ring-1 focus:ring-violet-500/30 transition-all cursor-pointer"
          >
            <option value="professional">Professional</option>
            <option value="friendly">Friendly</option>
            <option value="formal">Formal</option>
            <option value="enthusiastic">Enthusiastic</option>
          </select>
        </div>
      </div>

      {/* Resume Text Area */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1.5">
          Resume Text
        </label>
        <textarea
          {...register("resumeText")}
          rows={4}
          placeholder="Paste your resume content (skills, projects, education, experience)..."
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-violet-500/60 focus:ring-1 focus:ring-violet-500/30 transition-all resize-none"
        />
        {errors.resumeText && (
          <p className="text-red-400 text-xs mt-1">{errors.resumeText.message}</p>
        )}
      </div>

      {/* Job Description Area */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1.5">
          Job Description Text
        </label>
        <textarea
          {...register("jobDescription")}
          rows={4}
          placeholder="Paste the job description (responsibilities, required skills, stack)..."
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-violet-500/60 focus:ring-1 focus:ring-violet-500/30 transition-all resize-none"
        />
        {errors.jobDescription && (
          <p className="text-red-400 text-xs mt-1">{errors.jobDescription.message}</p>
        )}
      </div>

      {/* Toggle Optional Fields */}
      <div>
        <button
          type="button"
          onClick={() => setShowOptionalFields(!showOptionalFields)}
          className="flex items-center gap-2 text-xs font-semibold text-violet-400 hover:text-violet-300 transition-colors focus:outline-none"
        >
          <svg
            className={`w-3.5 h-3.5 transition-transform duration-200 ${showOptionalFields ? 'rotate-90' : ''}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
          </svg>
          {showOptionalFields ? "Hide Profile Details" : "Add Profile Details (Name, Links - Optional)"}
        </button>

        {showOptionalFields && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3 p-4 bg-white/3 border border-white/5 rounded-xl">
            {/* Candidate Name */}
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1">
                Candidate Name
              </label>
              <input
                {...register("candidateName")}
                type="text"
                placeholder="e.g. Nilesh Kumawat"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-violet-500/60 transition-all"
              />
            </div>
            
            {/* Portfolio Link */}
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1">
                Portfolio URL
              </label>
              <input
                {...register("portfolioUrl")}
                type="text"
                placeholder="e.g. https://myportfolio.dev"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-violet-500/60 transition-all"
              />
            </div>

            {/* GitHub URL */}
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1">
                GitHub URL
              </label>
              <input
                {...register("gitHubUrl")}
                type="text"
                placeholder="e.g. https://github.com/myusername"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-violet-500/60 transition-all"
              />
            </div>

            {/* LinkedIn URL */}
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1">
                LinkedIn URL
              </label>
              <input
                {...register("linkedInUrl")}
                type="text"
                placeholder="e.g. https://linkedin.com/in/myusername"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-violet-500/60 transition-all"
              />
            </div>
          </div>
        )}
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3.5 rounded-xl transition-all duration-200 shadow-lg shadow-violet-500/20"
      >
        {isLoading ? (
          <>
            <svg
              className="animate-spin w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
            Analyzing & Generating...
          </>
        ) : (
          <>
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
            Analyze & Generate Outreach
          </>
        )}
      </button>
    </form>
  );
}
