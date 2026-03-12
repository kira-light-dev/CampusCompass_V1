import { NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import ImportantTopic from "@/databases/important-topic.model"

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ topicId: string }> }
) {
  await connectDB()
  const { topicId } = await params
  await ImportantTopic.findByIdAndDelete(topicId)
  return NextResponse.json({ message: "Deleted" })
}