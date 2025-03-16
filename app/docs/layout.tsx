import type React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BookOpen, Home, FileText, Settings, ExternalLink } from "lucide-react";

export const metadata: Metadata = {
  title: "Documentation | Project Dashboard",
  description: "Documentation and guides for using the project dashboard",
};

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-background">
      <aside className="hidden md:flex w-64 flex-col border-r bg-muted/40 p-6">
        <div className="flex items-center gap-2 font-semibold mb-6">
          <BookOpen className="h-5 w-5" />
          <span>Documentation</span>
        </div>

        <nav className="space-y-6 flex-1">
          <div>
            <h4 className="text-sm font-medium mb-2 text-muted-foreground">
              Getting Started
            </h4>
            <ul className="space-y-1">
              <li>
                <Link
                  href="/docs"
                  className="text-sm flex items-center gap-2 py-1 px-2 rounded-md hover:bg-muted"
                >
                  <Home className="h-4 w-4" />
                  <span>Overview</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/docs/quickstart"
                  className="text-sm flex items-center gap-2 py-1 px-2 rounded-md hover:bg-muted"
                >
                  <FileText className="h-4 w-4" />
                  <span>Quick Start Guide</span>
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-medium mb-2 text-muted-foreground">
              Setup Guides
            </h4>
            <ul className="space-y-1">
              <li>
                <Link
                  href="/docs/airtable-setup"
                  className="text-sm flex items-center gap-2 py-1 px-2 rounded-md bg-primary/10 text-primary font-medium"
                >
                  <Settings className="h-4 w-4" />
                  <span>Airtable Configuration</span>
                </Link>
              </li>
              {/* <li>
                <Link
                  href="/docs/api-integration"
                  className="text-sm flex items-center gap-2 py-1 px-2 rounded-md hover:bg-muted"
                >
                  <Settings className="h-4 w-4" />
                  <span>API Integration</span>
                </Link>
              </li> */}
            </ul>
          </div>

          {/* <div>
            <h4 className="text-sm font-medium mb-2 text-muted-foreground">Features</h4>
            <ul className="space-y-1">
              <li>
                <Link
                  href="/docs/projects"
                  className="text-sm flex items-center gap-2 py-1 px-2 rounded-md hover:bg-muted"
                >
                  <FileText className="h-4 w-4" />
                  <span>Projects</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/docs/automations"
                  className="text-sm flex items-center gap-2 py-1 px-2 rounded-md hover:bg-muted"
                >
                  <FileText className="h-4 w-4" />
                  <span>Automations</span>
                </Link>
              </li>
            </ul>
          </div> */}
        </nav>

        <div className="pt-6 border-t">
          <Button variant="outline" className="w-full justify-start" asChild>
            <Link href="/dashboard">
              <ExternalLink className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Link>
          </Button>
        </div>
      </aside>

      <main className="flex-1 overflow-auto mx-5">{children}</main>
    </div>
  );
}
