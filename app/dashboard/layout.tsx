import type React from "react";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { UserNav } from "@/components/user-nav";
import { ThemeToggle } from "@/components/theme-toggle";
import Link from "next/link";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  return (
    <div>
      <div className="flex w-full h-14 items-center border-b px-4 justify-between">
        <Link
          href="/dashboard"
          className="text-lg font-semibold flex-1 hover:underline"
        >
          Dashboard
        </Link>{" "}
        <div className="flex flex-row items-center gap-4">
          <ThemeToggle />
          <UserNav user={session.user} />
        </div>
      </div>
      <main className="px-16">{children}</main>
    </div>
  );
}
