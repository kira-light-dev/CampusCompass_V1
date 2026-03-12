import { NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import InterviewNote from "@/databases/interview-note.model"

export async function GET() {
  try {
    await connectDB()
    const notes = await InterviewNote.find().sort({ createdAt: -1 })
    return NextResponse.json(JSON.parse(JSON.stringify(notes)))
  } catch {
    return NextResponse.json({ message: "Failed to fetch" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    await connectDB()
    const { topic, confidence, note } = await req.json()
    if (!topic?.trim()) return NextResponse.json({ message: "Topic required" }, { status: 400 })
    const created = await InterviewNote.create({
      topic,
      confidence: confidence ?? 5,
      note: note ?? ""
    })
    return NextResponse.json(JSON.parse(JSON.stringify(created)), { status: 201 })
  } catch {
    return NextResponse.json({ message: "Failed to create" }, { status: 500 })
  }
}