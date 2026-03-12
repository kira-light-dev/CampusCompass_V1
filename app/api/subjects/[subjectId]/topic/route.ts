import { NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import Subject from "@/databases/subjects.model"

export async function POST(
  req: Request,
  { params }: { params: Promise<{ subjectId: string }> }
) {
  try {
    await connectDB()
    const { subjectId } = await params
    const body = await req.json()

    const subject = await Subject.findByIdAndUpdate(
      subjectId,
      { $push: { topics: { name: body.name, completed: false } } },
      { new: true }
    )

    if (!subject) {
      return NextResponse.json({ message: "Subject not found" }, { status: 404 })
    }

    return NextResponse.json(JSON.parse(JSON.stringify(subject)), { status: 200 })
  } catch (error) {
    return NextResponse.json({ message: "Failed to add topic" }, { status: 500 })
  }
}