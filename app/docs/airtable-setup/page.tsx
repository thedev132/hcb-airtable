import type { Metadata } from "next";
import AirtableSetupClientPage from "./AirtableSetupClientPage";

export const metadata: Metadata = {
  title: "Airtable Setup Guide | Documentation",
  description:
    "Learn how to find all the required Airtable information for your project setup",
};

export default function AirtableSetupPage() {
  return <AirtableSetupClientPage />;
}
