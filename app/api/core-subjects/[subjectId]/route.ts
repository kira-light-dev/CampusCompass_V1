import { NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import CoreSubject from "@/databases/core-subject.model"

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ subjectId: string }> }
) {
  try {
    await connectDB()
    const { subjectId } = await params
    await CoreSubject.findByIdAndDelete(subjectId)
    return NextResponse.json({ message: "Deleted" })
  } catch {
    return NextResponse.json({ message: "Failed to delete" }, { status: 500 })
  }
}