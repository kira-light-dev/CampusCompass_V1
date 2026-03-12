import { NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import Book from "@/databases/book.model"

export async function GET() {
  try {
    await connectDB()
    const books = await Book.find().sort({ createdAt: -1 })
    return NextResponse.json(JSON.parse(JSON.stringify(books)))
  } catch (error) {
    return NextResponse.json({ message: "Failed to fetch" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    await connectDB()
    const formData = await req.formData()
    const file = formData.get("file") as File
    const name = formData.get("name") as string

    if (!file || !name?.trim()) {
      return NextResponse.json({ message: "File and name are required" }, { status: 400 })
    }

    // Convert file to base64 for storage in MongoDB
    const arrayBuffer = await file.arrayBuffer()
    const base64 = Buffer.from(arrayBuffer).toString("base64")
    const dataUrl = `data:${file.type};base64,${base64}`

    const book = await Book.create({
      name,
      url: dataUrl,
      fileType: file.type,
      size: file.size,
    })

    return NextResponse.json(JSON.parse(JSON.stringify(book)), { status: 201 })
  } catch (error) {
    console.error("Upload error:", error)
    return NextResponse.json({ message: "Failed to upload" }, { status: 500 })
  }
}
