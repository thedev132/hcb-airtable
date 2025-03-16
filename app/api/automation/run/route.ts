import runAutomation from "@/lib/runAutomation";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { projectId } = await req.json();
    await runAutomation(projectId);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to run automation:", error);
    return NextResponse.json(
      { success: false, error: "Failed to run automation" },
      { status: 500 },
    );
  }
}
