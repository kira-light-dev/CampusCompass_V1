import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

import connectDB from "@/lib/mongodb";
import User from "@/databases/user.model";

export async function POST(req: Request) {
    try {
        await connectDB();

        const {name, email, password, branch, year, collegeId} = await req.json();

        if (!name || !email || !password || !branch || !year) {
            return NextResponse.json({message: "Missing fields"}, {status: 400});
        }

        const existingUser = await User.findOne({email});
        if (existingUser) {
            return NextResponse.json({message: "User already exists"}, {status: 409});
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            branch,
            year,
            collegeId,
        });

        // create token
        const token = jwt.sign(
            {userId: user._id},
            process.env.JWT_SECRET!,
            {expiresIn: "7d"}
        );

        // store cookie
        const response = NextResponse.json(
            {message: "Registered successfully"},
            {status: 201}
        );

        response.cookies.set("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            path: "/",
        });

        return response;
    } catch (error: any) {
        console.log(error);
        // duplicate key error
        if (error.code === 11000) {
            const field = Object.keys(error.keyValue)[0];

            return NextResponse.json(
                {message: `${field} already exists. Please use a different ${field}.`},
                {status: 409}
            );
        }

        return NextResponse.json(
            {message: "Something went wrong. Please try again."},
            {status: 500}
        );
    }
}
