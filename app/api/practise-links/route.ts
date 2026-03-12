import { NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import PracticeLink from "@/databases/practice-link.model"

export async function GET() {
  await connectDB()
  const links = await PracticeLink.find().sort({ createdAt: -1 })
  return NextResponse.json(JSON.parse(JSON.stringify(links)))
}

export async function POST(req: Request) {
  try {
    await connectDB()
    const { name, url, description } = await req.json()
    const link = await PracticeLink.create({ name, url, description })
    return NextResponse.json(link, { status: 201 })
  } catch (error) {
    return NextResponse.json({ message: "Failed to create" }, { status: 500 })
  }
}