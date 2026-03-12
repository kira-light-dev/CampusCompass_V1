import { NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import Subject from "@/databases/subjects.model"

export async function GET() {
  await connectDB()

  const subjects = await Subject.find()

  return NextResponse.json(subjects)
}

export async function POST(req: Request) {
  try {
    await connectDB()

    const body = await req.json()

    const subject = await Subject.create({
      name: body.name,
      topics: []
    })

    return NextResponse.json(subject, { status: 201 })

  } catch (error) {
    return NextResponse.json(
      { message: "Failed to create subject" },
      { status: 500 }
    )
  }
}