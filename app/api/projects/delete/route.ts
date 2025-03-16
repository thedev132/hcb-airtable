import { NextResponse } from "next/server";
import { deleteProject } from "@/lib/project/delete";

export async function POST(req: Request) {
  try {
    const { projectId } = await req.json();
    await deleteProject(projectId);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete project:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete project" },
      { status: 500 },
    );
  }
}
