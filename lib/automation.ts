"use client";

const handleRunAutomation = async (projectId: string, toast) => {
  console.log("Running automation for project", projectId);
  const response = await fetch("/api/automation/run", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ projectId: projectId }),
  });

  if (response.ok) {
    toast({title: "Success!", description: "Automation ran successfully!"});
  } else {
    toast({variant:"destructive", title: "Error!", description: "Failed to run automation!"});
  }
};
export default handleRunAutomation;
