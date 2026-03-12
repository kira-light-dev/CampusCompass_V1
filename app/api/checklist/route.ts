import { NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import Checklist from "@/databases/checklist.model"

export async function GET() {
  await connectDB()
  const tasks = await Checklist.find().sort({ createdAt: -1 })
  return NextResponse.json(JSON.parse(JSON.stringify(tasks)))
}

export async function POST(req: Request) {
  try {
    await connectDB()
    const { task } = await req.json()
    const newTask = await Checklist.create({ task, completed: false })
    return NextResponse.json(newTask, { status: 201 })
  } catch (error) {
    return NextResponse.json({ message: "Failed to create task" }, { status: 500 })
  }
}