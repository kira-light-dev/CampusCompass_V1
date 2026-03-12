import { NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import { cookies } from "next/headers"
import connectDB from "@/lib/mongodb"
import User from "@/databases/user.model"

export async function GET() {
    try {
        await connectDB()

        const cookieStore = await cookies()
        const token = cookieStore.get("token")?.value

        if (!token) {
            return NextResponse.json(
                { message: "Not authenticated" },
                { status: 401 }
            )
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
            userId: string
        }

        const user = await User.findById(decoded.userId).select("-password")

        if (!user) {
            return NextResponse.json(
                { message: "User not found" },
                { status: 404 }
            )
        }

        return NextResponse.json({ user }, { status: 200 })
    } catch {
        return NextResponse.json(
            { message: "Invalid or expired token" },
            { status: 401 }
        )
    }
}
