"use client"

import { useEffect, useState } from "react"
import { User, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useRouter } from "next/navigation"
import { ThemeToggle } from "@/components/theme-toggle"

interface TopbarProps {
  onMenuClick?: () => void
}

export function Topbar({ onMenuClick }: TopbarProps) {
  const router = useRouter()
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    async function checkAuth() {
      const res = await fetch("/api/auth/me")
      if (res.ok) setIsLoggedIn(true)
      else setIsLoggedIn(false)
    }
    checkAuth()
  }, [])

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-card px-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="lg:hidden" onClick={onMenuClick}>
          <Menu className="h-5 w-5" />
        </Button>
        <div>
          <p className="text-sm text-muted-foreground">Welcome back!</p>
          <h1 className="text-lg font-semibold text-foreground">Student Dashboard</h1>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <ThemeToggle />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-10 w-10 rounded-full">
              <Avatar className="h-10 w-10">
                <AvatarFallback className="bg-primary text-primary-foreground">
                  <User className="h-5 w-5" />
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end">
            {!isLoggedIn ? (
              <>
                <DropdownMenuItem onClick={() => router.push("/login")}>
                  Login
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push("/register")}>
                  Register
                </DropdownMenuItem>
              </>
            ) : (
              <>
                <DropdownMenuItem onClick={() => router.push("/profile")}>
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push("/settings")}>
                  Settings
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={async () => {
                    await fetch("/api/auth/logout", { method: "POST" })
                    router.push("/login")
                  }}
                >
                  Sign out
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}