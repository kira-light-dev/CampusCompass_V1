"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { User, Mail, GraduationCap, Calendar } from "lucide-react"

export default function ProfilePage() {
    const [user, setUser] = useState<any>(null)
    const [error, setError] = useState("")

    useEffect(() => {
        async function fetchProfile() {
            const res = await fetch("/api/profile")
            const data = await res.json()

            if (!res.ok) {
                setError(data.message || "Failed to load profile")
                return
            }

            setUser(data.user)
        }

        fetchProfile()
    }, [])

    if (error) return <p className="p-6 text-red-500">{error}</p>
    if (!user) return <p className="p-6">Loading...</p>

    return (
        <div className="flex justify-center p-6">
            <Card className="w-full max-w-2xl">
                <CardHeader className="flex flex-col items-center gap-3 text-center">
                    <Avatar className="h-20 w-20">
                        <AvatarFallback className="bg-primary text-primary-foreground text-xl">
                            {user.name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                    </Avatar>

                    <div>
                        <CardTitle className="text-2xl">{user.name}</CardTitle>
                        <p className="text-sm text-muted-foreground">{user.branch} • Year {user.year}</p>
                    </div>
                </CardHeader>

                <CardContent className="grid gap-4 sm:grid-cols-2">
                    <div className="flex items-center gap-3 rounded-md border p-3">
                        <Mail className="h-5 w-5 text-muted-foreground" />
                        <div>
                            <p className="text-xs text-muted-foreground">Email</p>
                            <p className="font-medium">{user.email}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 rounded-md border p-3">
                        <GraduationCap className="h-5 w-5 text-muted-foreground" />
                        <div>
                            <p className="text-xs text-muted-foreground">College ID</p>
                            <p className="font-medium">{user.collegeId || "—"}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 rounded-md border p-3">
                        <User className="h-5 w-5 text-muted-foreground" />
                        <div>
                            <p className="text-xs text-muted-foreground">Branch</p>
                            <p className="font-medium">{user.branch}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 rounded-md border p-3">
                        <Calendar className="h-5 w-5 text-muted-foreground" />
                        <div>
                            <p className="text-xs text-muted-foreground">Joined</p>
                            <p className="font-medium">
                                {new Date(user.createdAt).toDateString()}
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
