"use client";

import { Button } from "@/components/ui/button";
import { Activity, Code2 } from "lucide-react";
import handleAutomationRun from "@/lib/automation";
import handleRunAutomation from "@/lib/automation";
import { useToast } from "@/hooks/use-toast";

export default function RunAutomationButton({
  projectId,
  type,
}: {
  projectId: string;
  type?: string;
}) {
  const { toast } = useToast();
  return (
    <>
      {type === "home" ? (
        <Button
          onClick={() => handleRunAutomation(projectId, toast)}
          variant="outline"
          className="flex-1"
        >
          <Activity className="mr-2 h-4 w-4" />
          Run Automation
        </Button>
      ) : (
        <Button onClick={() => handleAutomationRun(projectId, toast)}>
          <Code2 className="mr-2 h-4 w-4" />
          Run Automation
        </Button>
      )}
    </>
  );
}
