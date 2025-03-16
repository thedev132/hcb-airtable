"use client";

import Link from "next/link";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ExternalLink, Copy, Check, Info, AlertCircle } from "lucide-react";

export default function AirtableSetupClientPage() {
  return (
    <div className="container mx-auto py-8 max-w-5xl">
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/docs">Documentation</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/docs/setup">Setup Guides</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/docs/airtable-setup">
              Airtable Configuration
            </BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">
            Airtable Configuration Guide
          </h1>
          <p className="text-xl text-muted-foreground mt-2">
            Learn how to find all the required Airtable information for your
            project setup
          </p>
        </div>

        <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4 flex gap-3">
          <Info className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="font-medium text-blue-800 dark:text-blue-300">
              Before you begin
            </h3>
            <p className="text-sm text-blue-700 dark:text-blue-400">
              Make sure you have an Airtable account and have created a base
              with the necessary tables for your project. You'll need
              administrator access to view the API documentation.
            </p>
          </div>
        </div>

        <Tabs defaultValue="base-id" className="w-full">
          <TabsList className="grid grid-cols-4 mb-6">
            <TabsTrigger value="base-id">Base ID</TabsTrigger>
            <TabsTrigger value="tables-views">Tables & Views</TabsTrigger>
            <TabsTrigger value="field-ids">Field IDs</TabsTrigger>
            <TabsTrigger value="api-key">API Key</TabsTrigger>
            {/* <TabsTrigger value="troubleshooting">Troubleshooting</TabsTrigger> */}
          </TabsList>

          <TabsContent value="base-id" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Finding Your Airtable Base ID</CardTitle>
                <CardDescription>
                  The Base ID is a unique identifier for your Airtable base and
                  is required for API access
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">
                    Method 1: From the API Documentation
                  </h3>
                  <ol className="list-decimal list-inside space-y-4">
                    <li className="pl-2">
                      <p>Open your Airtable base in the browser</p>
                      <img
                        src="https://hc-cdn.hel1.your-objectstorage.com/s/v3/5332794623ad51c2d65428d1749d6037a5c6d521_screenshot_2025-03-14_at_5.36.38___pm.png"
                        alt="Airtable base in browser"
                        className="rounded-lg border mt-2 w-full"
                      />
                    </li>
                    <li className="pl-2">
                      <p>
                        Click on <strong>Help</strong> in the top-right corner
                        of the screen
                      </p>
                      <img
                        src="https://hc-cdn.hel1.your-objectstorage.com/s/v3/b6b939914f5313d8533e5daf3162aed76f388e7b_screenshot_2025-03-14_at_5.39.05___pm.png"
                        alt="Help menu location"
                        className="rounded-lg border mt-2 w-full"
                      />
                    </li>
                    <li className="pl-2">
                      <p>
                        Select <strong>API documentation</strong> from the
                        dropdown menu
                      </p>
                      <img
                        src="https://hc-cdn.hel1.your-objectstorage.com/s/v3/61bd93e2e48a9f79d72db8e794959e9817d127e2_screenshot_2025-03-14_at_5.40.38___pm.png"
                        alt="API documentation option"
                        className="rounded-lg border mt-2 w-full"
                      />
                    </li>
                    <li className="pl-2">
                      <p>
                        In the API documentation page, look for the{" "}
                        <strong>Base ID</strong> in the "Introduction" section
                      </p>
                      <div className="relative mt-2">
                        <img
                          src="https://hc-cdn.hel1.your-objectstorage.com/s/v3/241b5d2a098612efe789e6bcc66056e666614d15_screenshot_2025-03-14_at_5.42.28___pm.png"
                          alt="Base ID in API documentation"
                          className="rounded-lg border w-full"
                        />
                      </div>
                    </li>
                  </ol>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">
                    Method 2: From the URL
                  </h3>
                  <ol className="list-decimal list-inside space-y-4">
                    <li className="pl-2">
                      <p>Open your Airtable base in the browser</p>
                    </li>
                    <li className="pl-2">
                      <p>
                        Look at the URL in your browser's address bar. It will
                        look something like:
                      </p>
                      <div className="bg-muted p-3 rounded-md font-mono text-sm mt-2 relative overflow-hidden">
                        https://airtable.com/
                        <span className="bg-primary/20 px-1 py-0.5 rounded">
                          appXXXXXXXXXXXXXX
                        </span>
                        /tblYYYYYYYYYYYYYY/viwZZZZZZZZZZZZZZ
                        <Button
                          variant="ghost"
                          size="icon"
                          className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8"
                          onClick={() => {}}
                        >
                          <Copy className="h-4 w-4" />
                          <span className="sr-only">Copy URL</span>
                        </Button>
                      </div>
                    </li>
                    <li className="pl-2">
                      <p>
                        The Base ID is the part that starts with{" "}
                        <code>app</code> and is followed by a string of
                        characters
                      </p>
                    </li>
                  </ol>
                </div>

                <div className="bg-muted p-4 rounded-lg">
                  <h4 className="font-medium flex items-center">
                    <Check className="h-5 w-5 mr-2 text-green-500" />
                    Example Base ID
                  </h4>
                  <p className="mt-2 font-mono bg-background p-2 rounded border">
                    appABC123XYZ456DEF789
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Your Base ID will always start with "app" followed by a
                    string of letters and numbers.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tables-views" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Finding Table Names and Views</CardTitle>
                <CardDescription>
                  Table names and views are used to specify which data to access
                  in your Airtable base
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Finding Table Names</h3>
                  <ol className="list-decimal list-inside space-y-4">
                    <li className="pl-2">
                      <p>Open your Airtable base in the browser</p>
                    </li>
                    <li className="pl-2">
                      <p>
                        Look at the tabs near the top of the screen to see all
                        available tables
                      </p>
                      <img
                        src="https://hc-cdn.hel1.your-objectstorage.com/s/v3/eff9700517914d139afd7e6547b584ec0c5d967a_screenshot_2025-03-14_at_5.46.43___pm.png"
                        alt="Table names in Airtable"
                        className="rounded-lg border mt-2 w-full"
                      />
                    </li>
                    <li className="pl-2">
                      <p>
                        The name displayed for each table is what you'll use in
                        your project configuration
                      </p>
                      <div className="bg-muted p-3 rounded-md mt-2">
                        <p className="font-medium">Important Note:</p>
                        <p className="text-sm mt-1">
                          Table names are case-sensitive and should be entered
                          exactly as they appear in Airtable. For example, if
                          your table is named "Grant Applications", you must
                          enter it as "Grant Applications", not "grant
                          applications".
                        </p>
                      </div>
                    </li>
                  </ol>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Finding View Names</h3>
                  <ol className="list-decimal list-inside space-y-4">
                    <li className="pl-2">
                      <p>Select the table you want to work with</p>
                    </li>
                    <li className="pl-2">
                      <p>
                        Look at the left of the screen to see all your views
                        listed
                      </p>
                      <img
                        src="https://hc-cdn.hel1.your-objectstorage.com/s/v3/f586e52c5e0c05a0b4bd1c50be2dd97fcdb1651b_screenshot_2025-03-14_at_5.50.12___pm.png"
                        alt="View names in Airtable"
                        className="rounded-lg border mt-2 w-full"
                      />
                    </li>
                    <li className="pl-2">
                      <p>
                        The name displayed for each view is what you'll use in
                        your project configuration
                      </p>
                      <div className="bg-muted p-3 rounded-md mt-2">
                        <p className="font-medium">Important Note:</p>
                        <p className="text-sm mt-1">
                          View names are also case-sensitive. If your view is
                          named "Approved Grants", you must enter it exactly as
                          "Approved Grants".
                        </p>
                      </div>
                    </li>
                  </ol>
                </div>

                <div className="bg-muted p-4 rounded-lg">
                  <h4 className="font-medium flex items-center">
                    <Check className="h-5 w-5 mr-2 text-green-500" />
                    Example Configuration
                  </h4>
                  <div className="mt-2 font-mono bg-background p-2 rounded border space-y-2">
                    <p>Table Name: "Grant Applications"</p>
                    <p>View Name: "Approved Grants"</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="field-ids" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Finding Field Names</CardTitle>
                <CardDescription>
                  Field Names are required to reference specific columns in your
                  Airtable
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">
                    Method: Using Airtable
                  </h3>
                  <ol className="list-decimal list-inside space-y-4">
                    <li className="pl-2">
                      <p>Open your Airtable base in the browser</p>
                    </li>
                    <li className="pl-2">
                      <p>Find your table</p>
                    </li>
                    <li className="pl-2">
                      <p>Copy the column name</p>
                      <img
                        src="https://hc-cdn.hel1.your-objectstorage.com/s/v3/f586e52c5e0c05a0b4bd1c50be2dd97fcdb1651b_screenshot_2025-03-14_at_5.50.12___pm.png"
                        alt="Table selection in API docs"
                        className="rounded-lg border mt-2 w-full"
                      />
                    </li>
                    <li className="pl-2">
                      <p>Find the specific fields you need for your project:</p>
                      <ul className="list-disc list-inside ml-4 mt-2 space-y-2">
                        <li>
                          For <strong>Approval Field</strong>: Look for the
                          field that stores approval status
                        </li>
                        <li>
                          For <strong>Grant Field</strong>: Look for the field
                          that stores the grant identifier
                        </li>
                      </ul>
                    </li>
                  </ol>
                </div>

                <div className="bg-muted p-4 rounded-lg">
                  <h4 className="font-medium flex items-center">
                    <Check className="h-5 w-5 mr-2 text-green-500" />
                    Example Field IDs
                  </h4>
                  <div className="mt-2 font-mono bg-background p-2 rounded border space-y-2">
                    <p>Approval Field: "Approved"</p>
                    <p>Grant Field ID: "Grant Sent"</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="api-key" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Getting Your API Key</CardTitle>
                <CardDescription>
                  An API key is required to authenticate requests to the
                  Airtable API
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">
                    Steps to Generate an API Key
                  </h3>
                  <ol className="list-decimal list-inside space-y-4">
                    <li className="pl-2">
                      <p>
                        Go to your{" "}
                        <a
                          href="https://airtable.com/create/tokens"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary underline"
                        >
                          Airtable Builder Hub
                        </a>
                      </p>
                    </li>
                    <li className="pl-2">
                      <p>
                        Under the "Personal Access Tokens" section, click on
                        "Generate API key" if you don't already have one
                      </p>
                      <img
                        src="https://hc-cdn.hel1.your-objectstorage.com/s/v3/d97808eb11317b136722d66ee51dac0d5a79d115_screenshot_2025-03-14_at_5.59.13___pm.png"
                        alt="Generate API key button"
                        className="rounded-lg border mt-2 w-full"
                      />
                    </li>
                    <li className="pl-2">
                      <p>Copy your API key and store it securely</p>
                    </li>
                  </ol>
                </div>

                <div className="bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded-lg p-4 flex gap-3">
                  <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="font-medium text-amber-800 dark:text-amber-300">
                      Security Warning
                    </h3>
                    <p className="text-sm text-amber-700 dark:text-amber-400">
                      Your API key provides full access to your Airtable bases.
                      Never share it publicly or commit it to version control.
                      Always store it as an environment variable or in a secure
                      secrets manager.
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">
                    Adding Your API Key to the Project
                  </h3>
                  <p>
                    In your project, you'll need to add the Personal Access
                    Token{" "}
                    <Link className="underline" href="/dashboard/settings">
                      here
                    </Link>
                  </p>
                  <div className="bg-muted p-3 rounded-md font-mono text-sm">
                    patXXXXXXXXXXXXXXXX
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="troubleshooting" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Troubleshooting Common Issues</CardTitle>
                <CardDescription>
                  Solutions to common problems when setting up Airtable
                  integration
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Authentication Errors</h3>
                  <div className="bg-muted p-4 rounded-lg space-y-3">
                    <div>
                      <h4 className="font-medium">
                        Error: "Authentication required"
                      </h4>
                      <p className="text-sm mt-1">
                        This usually means your API key is invalid or not
                        properly configured.
                      </p>
                      <ul className="list-disc list-inside ml-4 mt-2 text-sm space-y-1">
                        <li>Double-check that your API key is correct</li>
                        <li>Ensure the environment variable is properly set</li>
                        <li>
                          Verify that your API key has access to the base you're
                          trying to access
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">
                    Base or Table Not Found
                  </h3>
                  <div className="bg-muted p-4 rounded-lg space-y-3">
                    <div>
                      <h4 className="font-medium">
                        Error: "Could not find base with id appXXXXXXXXXXXXXX"
                      </h4>
                      <p className="text-sm mt-1">
                        This means the Base ID you provided is incorrect or your
                        account doesn't have access to this base.
                      </p>
                      <ul className="list-disc list-inside ml-4 mt-2 text-sm space-y-1">
                        <li>Verify the Base ID is correct</li>
                        <li>Check that your account has access to this base</li>
                      </ul>
                    </div>
                    <div className="pt-2">
                      <h4 className="font-medium">Error: "Table not found"</h4>
                      <p className="text-sm mt-1">
                        This means the table name you provided doesn't exist in
                        the specified base.
                      </p>
                      <ul className="list-disc list-inside ml-4 mt-2 text-sm space-y-1">
                        <li>Check for typos in the table name</li>
                        <li>Remember that table names are case-sensitive</li>
                        <li>
                          Verify the table exists in the base you're accessing
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Field ID Issues</h3>
                  <div className="bg-muted p-4 rounded-lg space-y-3">
                    <div>
                      <h4 className="font-medium">Error: "Field not found"</h4>
                      <p className="text-sm mt-1">
                        This means one of the Field IDs you provided doesn't
                        exist in the specified table.
                      </p>
                      <ul className="list-disc list-inside ml-4 mt-2 text-sm space-y-1">
                        <li>Verify the Field IDs in the API documentation</li>
                        <li>
                          Make sure you're using the Field ID (starts with
                          "fld"), not the field name
                        </li>
                        <li>
                          Check if the field exists in the table you're
                          accessing
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="bg-muted p-4 rounded-lg">
                  <h4 className="font-medium">Still Having Issues?</h4>
                  <p className="text-sm mt-2">
                    If you're still experiencing problems after trying these
                    solutions, you can:
                  </p>
                  <ul className="list-disc list-inside ml-4 mt-2 text-sm space-y-2">
                    <li>
                      Check the{" "}
                      <a
                        href="https://airtable.com/developers/web/api/introduction"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary underline"
                      >
                        Airtable API documentation
                      </a>
                    </li>
                    <li>
                      Contact our support team at{" "}
                      <a
                        href="mailto:support@example.com"
                        className="text-primary underline"
                      >
                        support@example.com
                      </a>
                    </li>
                    <li>
                      Join our{" "}
                      <a href="#" className="text-primary underline">
                        community forum
                      </a>{" "}
                      to ask questions
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
