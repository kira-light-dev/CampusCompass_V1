import { put } from "@vercel/blob"
import { NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import Book from "@/databases/book.model"

export async function POST(req: Request) {
  try {
    await connectDB()
    const formData = await req.formData()
    const file = formData.get("file") as File
    const name = formData.get("name") as string

    if (!file || !name?.trim()) {
      return NextResponse.json({ message: "File and name are required" }, { status: 400 })
    }

    // Upload to Vercel Blob instead of base64 in MongoDB
    const blob = await put(file.name, file, { access: "public" })

    const book = await Book.create({
      name,
      url: blob.url,  // just store the URL now, not the whole file
      fileType: file.type,
      size: file.size,
    })

    return NextResponse.json(JSON.parse(JSON.stringify(book)), { status: 201 })
  } catch (error) {
    console.error("Upload error:", error)
    return NextResponse.json({ message: "Failed to upload" }, { status: 500 })
  }
}