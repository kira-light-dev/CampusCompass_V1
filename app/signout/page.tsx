"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function SignOutPage() {
    const router = useRouter()

    useEffect(() => {
        async function logout() {
            await fetch("/api/auth/logout", {
                method: "POST",
            })

            router.push("/register")
            router.refresh()
        }

        logout()
    }, [router])

    return (
        <div className="flex min-h-screen items-center justify-center">
            <p className="text-muted-foreground">Signing you out...</p>
        </div>
    )
}
