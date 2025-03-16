"use client"
import { useToast } from "@/hooks/use-toast"

const handleRunAutomation = async (projectId) => {
    const toast = useToast();

const response = await fetch("/api/automation/run", {
    method: "POST",
    headers: {
    "Content-Type": "application/json",
    },
    body: JSON.stringify({ projectId: projectId }),
});

if (response.ok) {
    alert("Automation run successfully!");
} else {
    alert("Failed to run automation");
}

}    
export default handleRunAutomation;

