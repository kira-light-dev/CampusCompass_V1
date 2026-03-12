import { NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import Paper from "@/databases/paper.model"

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ paperId: string }> }
) {
  await connectDB()
  const { paperId } = await params
  const { downloaded } = await req.json()
  const paper = await Paper.findByIdAndUpdate(paperId, { downloaded }, { new: true })
  return NextResponse.json(paper)
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ paperId: string }> }
) {
  await connectDB()
  const { paperId } = await params
  await Paper.findByIdAndDelete(paperId)
  return NextResponse.json({ message: "Deleted" })
}