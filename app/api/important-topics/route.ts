import { NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import ImportantTopic from "@/databases/important-topic.model"

export async function GET() {
  try {
    await connectDB()
    const topics = await ImportantTopic.find().sort({ createdAt: -1 })
    return NextResponse.json(JSON.parse(JSON.stringify(topics)))
  } catch (error) {
    return NextResponse.json([], { status: 200 })
  }
}

export async function POST(req: Request) {
  try {
    await connectDB()
    const { topic, subject, priority } = await req.json()
    const newTopic = await ImportantTopic.create({ topic, subject, priority })
    return NextResponse.json(newTopic, { status: 201 })
  } catch (error) {
    return NextResponse.json({ message: "Failed to create topic" }, { status: 500 })
  }
}
