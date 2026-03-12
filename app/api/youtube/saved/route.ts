import { NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import Video from "@/databases/video.model"

export async function GET() {
  try {
    await connectDB()
    const videos = await Video.find().sort({ createdAt: -1 })
    return NextResponse.json(JSON.parse(JSON.stringify(videos)))
  } catch (error) {
    return NextResponse.json({ message: "Failed to fetch" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    await connectDB()
    const body = await req.json()

    // Fix: only check for duplicate if the ID actually exists
    const uniqueId = body.playlistId || body.videoId
    if (!uniqueId) {
      return NextResponse.json({ message: "Missing video or playlist ID" }, { status: 400 })
    }

    const existing = await Video.findOne({
      $or: [
        ...(body.playlistId ? [{ playlistId: body.playlistId }] : []),
        ...(body.videoId ? [{ videoId: body.videoId }] : []),
      ]
    })

    if (existing) return NextResponse.json({ message: "Already saved" }, { status: 409 })

    const video = await Video.create(body)
    return NextResponse.json(JSON.parse(JSON.stringify(video)), { status: 201 })
  } catch (error) {
    console.error("Save error:", error)
    return NextResponse.json({ message: "Failed to save" }, { status: 500 })
  }
}