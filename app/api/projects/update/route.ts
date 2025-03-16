import { NextResponse } from "next/server";
import { updateProject } from "@/lib/project/update";

export async function POST(req: Request) {
  try {
    const { projectId, formData } = await req.json();
    await updateProject(projectId, formData);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to update project:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update project" },
      { status: 500 },
    );
  }
}
