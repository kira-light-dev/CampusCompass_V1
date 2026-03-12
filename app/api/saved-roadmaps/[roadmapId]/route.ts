import { NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import Roadmap from "@/databases/roadmap.model"

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ roadmapId: string }> }
) {
  try {
    await connectDB()
    const { roadmapId } = await params
    await Roadmap.findByIdAndDelete(roadmapId)
    return NextResponse.json({ message: "Deleted" })
  } catch {
    return NextResponse.json({ message: "Failed to delete" }, { status: 500 })
  }
}
