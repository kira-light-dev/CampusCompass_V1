import { NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import Note from "@/databases/note.model"

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ noteId: string }> }
) {
  try {
    await connectDB()
    const { noteId } = await params
    await Note.findByIdAndDelete(noteId)
    return NextResponse.json({ message: "Deleted" })
  } catch (error) {
    return NextResponse.json({ message: "Failed to delete" }, { status: 500 })
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ noteId: string }> }
) {
  try {
    await connectDB()
    const { noteId } = await params
    const { name } = await req.json()
    if (!name?.trim()) return NextResponse.json({ message: "Name required" }, { status: 400 })
    const updated = await Note.findByIdAndUpdate(noteId, { name }, { new: true })
    return NextResponse.json(JSON.parse(JSON.stringify(updated)))
  } catch (error) {
    return NextResponse.json({ message: "Failed to update" }, { status: 500 })
  }
}