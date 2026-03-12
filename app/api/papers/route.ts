import { NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import Paper from "@/databases/paper.model"
import { put } from "@vercel/blob"

export async function GET() {
  try {
    await connectDB()
    const papers = await Paper.find().sort({ createdAt: -1 })
    return NextResponse.json(JSON.parse(JSON.stringify(papers)))
  } catch (error) {
    return NextResponse.json([], { status: 200 })
  }
}

export async function POST(req: Request) {
  try {
    await connectDB()
    const formData = await req.formData()
    const file = formData.get("file") as File
    const name = formData.get("name") as string
    const subjectName = formData.get("subjectName") as string

    const blob = await put(file.name, file, { access: "public" })

    const paper = await Paper.create({
      name,
      url: blob.url,
      subjectName,
      downloaded: false
    })

    return NextResponse.json(paper, { status: 201 })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ message: "Failed to upload paper" }, { status: 500 })
  }
}
