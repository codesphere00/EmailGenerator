import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geist = Geist({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ColdMailAI — AI Cold Email Generator",
  description:
    "Generate professional cold emails in seconds using AI. Perfect for internship applications, job hunting, and outreach.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${geist.className} bg-gray-950 text-white antialiased`}>
        {children}
      </body>
    </html>
  );
}
