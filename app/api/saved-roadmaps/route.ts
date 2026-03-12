import { NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import Roadmap from "@/databases/roadmap.model"

export async function GET() {
  try {
    await connectDB()
    const roadmaps = await Roadmap.find().sort({ createdAt: -1 })
    return NextResponse.json(JSON.parse(JSON.stringify(roadmaps)))
  } catch {
    return NextResponse.json([], { status: 200 })
  }
}

export async function POST(req: Request) {
  try {
    await connectDB()
    const body = await req.json()
    const roadmap = await Roadmap.create(body)
    return NextResponse.json(JSON.parse(JSON.stringify(roadmap)), { status: 201 })
  } catch {
    return NextResponse.json({ message: "Failed to save roadmap" }, { status: 500 })
  }
}
