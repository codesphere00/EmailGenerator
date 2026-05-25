"use client";

// DashboardClient — handles the interactive form + structured analysis output display

import { useState } from "react";
import EmailForm from "@/components/EmailForm";
import EmailOutput, { AnalysisData } from "@/components/EmailOutput";

export default function DashboardClient() {
  // Store the structured JSON career analysis object
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Left: Email & Resume Input Form (takes 5/12 cols on large screens) */}
      <div className="lg:col-span-5 bg-gray-900/50 border border-white/10 rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-9 h-9 rounded-lg bg-violet-500/10 border border-violet-500/20 flex items-center justify-center">
            <svg
              className="w-5 h-5 text-violet-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <div>
            <h2 className="text-white font-semibold">Career Matcher & Form</h2>
            <p className="text-gray-500 text-xs">
              Provide outreach details & career data
            </p>
          </div>
        </div>

        <EmailForm onAnalysisGenerated={setAnalysisData} />
      </div>

      {/* Right: Detailed Career Analysis & Emails (takes 7/12 cols on large screens) */}
      <div className="lg:col-span-7 bg-gray-900/50 border border-white/10 rounded-2xl p-6 min-h-[500px]">
        {analysisData ? (
          <EmailOutput analysis={analysisData} />
        ) : (
          <div className="flex flex-col items-center justify-center h-[500px] text-center">
            <div className="w-16 h-16 rounded-2xl bg-white/3 border border-white/5 flex items-center justify-center mb-4">
              <svg
                className="w-7 h-7 text-gray-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
            </div>
            <p className="text-gray-400 text-base font-semibold">
              Outreach Assistant & Compatibility Analyzer
            </p>
            <p className="text-gray-500 text-sm mt-1 max-w-sm">
              Your personalized emails, matched skills matrix, and suggested resume improvements will appear here.
            </p>
            <p className="text-violet-400/80 text-xs mt-4 border border-violet-500/20 bg-violet-500/5 px-3 py-1.5 rounded-full">
              Paste your Resume & Job Description to begin
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
