import { NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import Checklist from "@/databases/checklist.model"

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ taskId: string }> }
) {
  await connectDB()
  const { taskId } = await params
  const { completed } = await req.json()
  const task = await Checklist.findByIdAndUpdate(taskId, { completed }, { new: true })
  return NextResponse.json(task)
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ taskId: string }> }
) {
  await connectDB()
  const { taskId } = await params
  await Checklist.findByIdAndDelete(taskId)
  return NextResponse.json({ message: "Deleted" })
}