import { NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import Book from "@/databases/book.model"

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ bookId: string }> }
) {
  try {
    await connectDB()
    const { bookId } = await params
    await Book.findByIdAndDelete(bookId)
    return NextResponse.json({ message: "Deleted" })
  } catch (error) {
    return NextResponse.json({ message: "Failed to delete" }, { status: 500 })
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ bookId: string }> }
) {
  try {
    await connectDB()
    const { bookId } = await params
    const { name } = await req.json()
    if (!name?.trim()) return NextResponse.json({ message: "Name required" }, { status: 400 })
    const updated = await Book.findByIdAndUpdate(bookId, { name }, { new: true })
    return NextResponse.json(JSON.parse(JSON.stringify(updated)))
  } catch (error) {
    return NextResponse.json({ message: "Failed to update" }, { status: 500 })
  }
}