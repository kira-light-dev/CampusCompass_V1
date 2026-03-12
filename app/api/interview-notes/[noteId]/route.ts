import { NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import InterviewNote from "@/databases/interview-note.model"

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ noteId: string }> }
) {
  try {
    await connectDB()
    const { noteId } = await params
    await InterviewNote.findByIdAndDelete(noteId)
    return NextResponse.json({ message: "Deleted" })
  } catch {
    return NextResponse.json({ message: "Failed to delete" }, { status: 500 })
  }
}