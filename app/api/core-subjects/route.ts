import { NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import CoreSubject from "@/databases/core-subject.model"

export async function GET() {
  try {
    await connectDB()
    const subjects = await CoreSubject.find().sort({ createdAt: 1 })
    return NextResponse.json(JSON.parse(JSON.stringify(subjects)))
  } catch {
    return NextResponse.json({ message: "Failed to fetch" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    await connectDB()
    const { name } = await req.json()
    if (!name?.trim()) return NextResponse.json({ message: "Name required" }, { status: 400 })
    const created = await CoreSubject.create({ name })
    return NextResponse.json(JSON.parse(JSON.stringify(created)), { status: 201 })
  } catch {
    return NextResponse.json({ message: "Failed to create" }, { status: 500 })
  }
}