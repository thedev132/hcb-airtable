import { auth } from "@/auth";
import runAutomation from "@/lib/runAutomation";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const session = await auth();
  if (!session) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 },
    );
  }

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
