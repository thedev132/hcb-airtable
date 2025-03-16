"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import updateToken from "@/lib/user/updateToken";
import { useState } from "react";

export default function Page() {
  const [airtablePAT, setAirtablePAT] = useState("");

  const handleUpdateAirtablePAT = async () => {
    updateToken(airtablePAT);
  };

  return (
    <div className="flex flex-col h-full w-full overflow-auto p-6 space-y-6">
      <Card className="flex flex-col p-3 shadow-lg rounded-2xl">
        <CardHeader className="flex flex-row items-center justify-between pb-4">
          <CardTitle className="text-3xl font-semibold">Settings</CardTitle>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            className="h-6 w-6 text-muted-foreground"
          >
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-xl font-semibold">Airtable PAT</div>
          <div className="flex flex-col space-y-4">
            <input
              value={airtablePAT}
              onChange={(e) => setAirtablePAT(e.target.value)}
              type="text"
              placeholder="Enter your Airtable PAT"
              className="border rounded-lg p-3 text-lg w-full"
            />
            <Button
              onClick={handleUpdateAirtablePAT}
              className="w-full py-3 text-lg"
            >
              Update
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
