import Link from "next/link";
import type { Metadata } from "next";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  BookOpen,
  FileText,
  Settings,
  ArrowRight,
  ExternalLink,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Documentation | Project Dashboard",
  description: "Documentation and guides for using the project dashboard",
};

export default function DocsHomePage() {
  return (
    <div className="container mx-auto py-8 max-w-5xl">
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Documentation</h1>
          <p className="text-xl text-muted-foreground mt-2">
            Guides and resources to help you get the most out of your project
            dashboard
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Getting Started
              </CardTitle>
              <CardDescription>
                Learn the basics and get up and running quickly
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  <Link
                    href="/docs/quickstart"
                    className="text-primary hover:underline"
                  >
                    Quick Start Guide
                  </Link>
                </li>
                <li className="flex items-center gap-2">
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  <Link
                    href="/docs/overview"
                    className="text-primary hover:underline"
                  >
                    System Overview
                  </Link>
                </li>
                <li className="flex items-center gap-2">
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  <Link
                    href="/docs/faq"
                    className="text-primary hover:underline"
                  >
                    Frequently Asked Questions
                  </Link>
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full" asChild>
                <Link href="/docs/quickstart">
                  Read Getting Started
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Setup Guides
              </CardTitle>
              <CardDescription>
                Configuration and integration instructions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  <Link
                    href="/docs/airtable-setup"
                    className="text-primary hover:underline"
                  >
                    Airtable Configuration
                  </Link>
                </li>
                <li className="flex items-center gap-2">
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  <Link
                    href="/docs/api-integration"
                    className="text-primary hover:underline"
                  >
                    API Integration
                  </Link>
                </li>
                <li className="flex items-center gap-2">
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  <Link
                    href="/docs/environment-setup"
                    className="text-primary hover:underline"
                  >
                    Environment Variables
                  </Link>
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full" asChild>
                <Link href="/docs/airtable-setup">
                  View Airtable Setup
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Feature Guides
              </CardTitle>
              <CardDescription>
                Learn how to use specific features
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  <Link
                    href="/docs/projects"
                    className="text-primary hover:underline"
                  >
                    Managing Projects
                  </Link>
                </li>
                <li className="flex items-center gap-2">
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  <Link
                    href="/docs/automations"
                    className="text-primary hover:underline"
                  >
                    Creating Automations
                  </Link>
                </li>
                <li className="flex items-center gap-2">
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  <Link
                    href="/docs/reports"
                    className="text-primary hover:underline"
                  >
                    Generating Reports
                  </Link>
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full" asChild>
                <Link href="/docs/features">
                  Explore Features
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </div>

        <div className="mt-6 p-6 bg-muted rounded-lg">
          <h2 className="text-2xl font-bold mb-4">Need Help?</h2>
          <p className="mb-4">
            If you can't find what you're looking for in the documentation, our
            support team is here to help.
          </p>
          <div className="flex flex-wrap gap-4">
            <Button asChild>
              <a href="mailto:support@example.com">Contact Support</a>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/docs/faq">View FAQ</Link>
            </Button>
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t">
          <Button asChild>
            <Link href="/dashboard">
              Back to Dashboard
              <ExternalLink className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
