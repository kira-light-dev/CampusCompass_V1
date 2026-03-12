import { NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import Subject from "@/databases/subjects.model"

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ subjectId: string }> }
) {
  try {
    await connectDB()
    const { subjectId } = await params

    const subject = await Subject.findByIdAndDelete(subjectId)

    if (!subject) {
      return NextResponse.json({ message: "Subject not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Subject deleted" }, { status: 200 })

  } catch (error) {
    console.error(error)
    return NextResponse.json({ message: "Failed to delete subject" }, { status: 500 })
  }
}