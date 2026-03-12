import { NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import PracticeLink from "@/databases/practice-link.model"

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ linkId: string }> }
) {
  await connectDB()
  const { linkId } = await params
  await PracticeLink.findByIdAndDelete(linkId)
  return NextResponse.json({ message: "Deleted" })
}