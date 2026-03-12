"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, BookOpen, GraduationCap, Briefcase, FolderOpen, Compass, ChevronLeft } from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
  { name: "Home", href: "/dashboard", icon: Home },
  { name: "Subjects & Syllabus", href: "/subjects", icon: BookOpen },
  { name: "Exam Prep", href: "/exam-prep", icon: GraduationCap },
  { name: "Interview Prep", href: "/interview-prep", icon: Briefcase },
  { name: "Resources", href: "/resources", icon: FolderOpen },
]

interface SidebarProps {
  collapsed: boolean
  onToggle: () => void
}

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const pathname = usePathname()

  return (
    <aside className={cn(
      "fixed left-0 top-0 z-40 h-screen border-r border-border bg-sidebar transition-all duration-300",
      collapsed ? "w-16" : "w-64"
    )}>
      <div className="flex h-full flex-col">

        {/* Logo */}
        <div className="flex h-16 items-center border-b border-border px-3">
          {collapsed ? (
            <div className="flex w-full justify-center">
              <button
                onClick={onToggle}
                className="cursor-pointer text-primary hover:opacity-80 transition-opacity"
              >
                <Compass className="h-7 w-7" />
              </button>
            </div>
          ) : (
            <div className="flex w-full items-center justify-between">
              <div className="flex items-center gap-2">
                <Compass className="h-7 w-7 text-primary shrink-0" />
                <span className="text-xl font-semibold text-foreground whitespace-nowrap">CampusCompass</span>
              </div>
              <button
                onClick={onToggle}
                className="cursor-pointer text-muted-foreground hover:text-foreground transition-colors shrink-0 ml-2"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
            </div>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 space-y-1 p-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
            return (
              <Link
                key={item.name}
                href={item.href}
                title={collapsed ? item.name : undefined}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors cursor-pointer",
                  collapsed ? "justify-center" : "",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                )}
              >
                <item.icon className="h-5 w-5 shrink-0" />
                {!collapsed && item.name}
              </Link>
            )
          })}
        </nav>

        {!collapsed && (
          <div className="border-t border-border p-4">
            <p className="text-xs text-muted-foreground">Your direction in college life.</p>
          </div>
        )}

      </div>
    </aside>
  )
}
