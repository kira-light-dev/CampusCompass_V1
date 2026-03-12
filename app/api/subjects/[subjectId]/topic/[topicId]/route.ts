import { NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import Subject from "@/databases/subjects.model"

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ subjectId: string; topicId: string }> }
) {
  try {
    await connectDB()
    const { subjectId, topicId } = await params

    const subject = await Subject.findByIdAndUpdate(
      subjectId,
      { $pull: { topics: { _id: topicId } } },
      { new: true }
    )

    if (!subject) {
      return NextResponse.json({ message: "Subject not found" }, { status: 404 })
    }

    return NextResponse.json(JSON.parse(JSON.stringify(subject)), { status: 200 })
  } catch (error) {
    return NextResponse.json({ message: "Failed to delete topic" }, { status: 500 })
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ subjectId: string; topicId: string }> }
) {
  try {
    await connectDB()
    const { subjectId, topicId } = await params
    const { completed } = await req.json()

    const subject = await Subject.findOneAndUpdate(
      { _id: subjectId, "topics._id": topicId },
      { $set: { "topics.$.completed": completed } },
      { new: true }
    )

    if (!subject) {
      return NextResponse.json({ message: "Topic not found" }, { status: 404 })
    }

    return NextResponse.json(JSON.parse(JSON.stringify(subject)), { status: 200 })
  } catch (error) {
    return NextResponse.json({ message: "Failed to update topic" }, { status: 500 })
  }
}