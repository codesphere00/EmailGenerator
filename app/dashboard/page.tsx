import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifyToken } from "@/lib/jwt";
import { prisma } from "@/lib/prisma";
import Navbar from "@/components/Navbar";
import DashboardClient from "./DashboardClient";

// This is a Server Component — it runs on the server and checks auth
// before sending anything to the browser
export default async function DashboardPage() {
  // Read the JWT token from cookies (server-side)
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  // If no token, redirect to login
  if (!token) {
    redirect("/login");
  }

  // Verify the token
  const user = await verifyToken(token);
  if (!user) {
    redirect("/login");
  }

  // Get the user's name from the database
  const dbUser = await prisma.user.findUnique({
    where: { id: user.userId },
    select: { name: true, email: true },
  });

  if (!dbUser) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-gray-950">
      <Navbar />
      <main className="max-w-5xl mx-auto px-6 py-10">
        {/* Welcome header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white">
            Welcome back,{" "}
            <span className="bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
              {dbUser.name}
            </span>{" "}
            👋
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            Fill out the form below to generate your cold email
          </p>
        </div>

        {/* Dashboard client component handles the interactive form + output */}
        <DashboardClient />
      </main>
    </div>
  );
}
