"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Sidebar } from "@/components/sidebar"
import { Topbar } from "@/components/topbar"
import { MobileSidebar } from "@/components/mobile-sidebar"

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [collapsed, setCollapsed] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem("sidebar-collapsed") === "true"
    setCollapsed(saved)
    setMounted(true)
  }, [])

  const handleToggle = () => {
    const next = !collapsed
    setCollapsed(next)
    localStorage.setItem("sidebar-collapsed", String(next))
  }

  if (!mounted) {
    return (
      <div className="min-h-screen bg-background">
        <div className="hidden lg:block">
          <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-border bg-sidebar" />
        </div>
        <div className="lg:pl-64">
          <Topbar onMenuClick={() => setSidebarOpen(true)} />
          <main className="p-6">{children}</main>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="hidden lg:block">
        <Sidebar collapsed={collapsed} onToggle={handleToggle} />
      </div>
      <MobileSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className={`transition-all duration-300 ${collapsed ? "lg:pl-16" : "lg:pl-64"}`}>
        <Topbar onMenuClick={() => setSidebarOpen(true)} />
        <main className="p-6">{children}</main>
      </div>
    </div>
  )
}
