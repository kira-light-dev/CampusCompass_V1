"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, BookOpen, GraduationCap, Briefcase, FolderOpen, Compass, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

const navItems = [
  { name: "Home", href: "/", icon: Home },
  { name: "Subjects & Syllabus", href: "/subjects", icon: BookOpen },
  { name: "Exam Prep", href: "/exam-prep", icon: GraduationCap },
  { name: "Interview Prep", href: "/interview-prep", icon: Briefcase },
  { name: "Resources", href: "/resources", icon: FolderOpen },
]

interface MobileSidebarProps {
  open: boolean
  onClose: () => void
}

export function MobileSidebar({ open, onClose }: MobileSidebarProps) {
  const pathname = usePathname()

  if (!open) return null

  return (
    <>
      <div className="fixed inset-0 z-50 bg-foreground/20 lg:hidden" onClick={onClose} />
      <aside className="fixed left-0 top-0 z-50 h-screen w-64 border-r border-border bg-sidebar lg:hidden">
        <div className="flex h-full flex-col">
          <div className="flex h-16 items-center justify-between border-b border-border px-6">
            <div className="flex items-center gap-2">
              <Compass className="h-7 w-7 text-primary" />
              <span className="text-xl font-semibold text-foreground">CampusCompass</span>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>
          <nav className="flex-1 space-y-1 p-4">
            {navItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={onClose}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  {item.name}
                </Link>
              )
            })}
          </nav>
          <div className="border-t border-border p-4">
            <p className="text-xs text-muted-foreground">Your direction in college life.</p>
          </div>
        </div>
      </aside>
    </>
  )
}
