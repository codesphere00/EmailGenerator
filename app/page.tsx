import Link from "next/link";

// Landing page — shown to all visitors at /
export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-950 flex flex-col">
      {/* Simple top bar */}
      <header className="border-b border-white/5 px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center">
              <svg
                className="w-4 h-4 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </div>
            <span className="text-white font-semibold text-lg">ColdMailAI</span>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="text-gray-400 hover:text-white text-sm transition-colors px-4 py-2"
            >
              Login
            </Link>
            <Link
              href="/register"
              className="bg-violet-600 hover:bg-violet-500 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex items-center justify-center px-6 py-20">
        <div className="max-w-3xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-violet-500/10 border border-violet-500/20 rounded-full px-4 py-1.5 mb-8">
            <div className="w-1.5 h-1.5 rounded-full bg-violet-400" />
            <span className="text-violet-300 text-sm font-medium">
              Powered by Google Gemini AI
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-5xl sm:text-6xl font-bold text-white leading-tight mb-6">
            Generate Cold Emails
            <br />
            <span className="bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
              That Get Replies
            </span>
          </h1>

          <p className="text-gray-400 text-xl leading-relaxed mb-10 max-w-xl mx-auto">
            Fill out a simple form, pick your tone, and get a personalized
            professional cold email in seconds.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/register"
              className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-semibold px-8 py-4 rounded-xl transition-all duration-200 shadow-lg shadow-violet-500/20"
            >
              Start Generating Free
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
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold px-8 py-4 rounded-xl transition-all duration-200"
            >
              Login to Dashboard
            </Link>
          </div>

          {/* Feature pills */}
          <div className="flex flex-wrap justify-center gap-3 mt-14">
            {[
              "✦ No credit card needed",
              "✦ Emails saved to history",
              "✦ Multiple tones",
              "✦ Copy with one click",
            ].map((f) => (
              <span
                key={f}
                className="text-gray-500 text-sm bg-white/3 border border-white/5 px-4 py-2 rounded-full"
              >
                {f}
              </span>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
