"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import Link from "next/link"
import { Youtube, FileText, BookOpen, Code, ChevronRight } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useEffect, useState } from "react"
import { resources } from "@/lib/mock-data"

const categoryConfig = [
  { key: "YouTube", icon: Youtube, href: "/resources/youtube", color: "text-red-500", description: "Saved videos & search" },
  { key: "Notes", icon: FileText, href: "/resources/notes", color: "text-blue-500", description: "Your uploaded notes" },
  { key: "Books", icon: BookOpen, href: "/resources/books", color: "text-amber-500", description: "Textbooks & references" },
  { key: "Practice", icon: Code, href: "/resources/practise", color: "text-emerald-500", description: "Coding practice platforms" },
]

interface PreviewItem {
  id?: string | number
  _id?: string
  name?: string
  title?: string
  url: string
  description?: string
  channel?: string
}

type LoadState = PreviewItem[] | null

const emptyMessages: Record<string, string> = {
  YouTube: "No saved videos yet.",
  Notes: "No notes uploaded yet.",
  Books: "No books uploaded yet.",
}

export default function ResourcesPage() {
  const [youtubeItems, setYoutubeItems] = useState<LoadState>(null)
  const [notesItems, setNotesItems] = useState<LoadState>(null)
  const [booksItems, setBooksItems] = useState<LoadState>(null)

  useEffect(() => {
    fetch("/api/youtube/saved")
      .then(r => r.json())
      .then(data => setYoutubeItems(Array.isArray(data) ? data : []))
      .catch(() => setYoutubeItems([]))

    fetch("/api/notes")
      .then(r => r.json())
      .then(data => setNotesItems(Array.isArray(data) ? data : []))
      .catch(() => setNotesItems([]))

    fetch("/api/books")
      .then(r => r.json())
      .then(data => setBooksItems(Array.isArray(data) ? data : []))
      .catch(() => setBooksItems([]))
  }, [])

  const getState = (key: string): LoadState => {
    if (key === "YouTube") return youtubeItems
    if (key === "Notes") return notesItems
    if (key === "Books") return booksItems
    if (key === "Practice") {
      const practice = resources.find(r => r.category === "Practice")
      return practice?.items.map(i => ({ ...i })) ?? []
    }
    return []
  }

  const getItemName = (item: PreviewItem) => item.name || item.title || ""
  const getItemDesc = (item: PreviewItem) => item.description || item.channel || ""
  const getItemId = (item: PreviewItem) => item._id || String(item.id) || item.url

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-semibold text-foreground">Resources</h2>
          <p className="mt-1 text-muted-foreground">Your learning materials all in one place.</p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          {categoryConfig.map(({ key, icon: Icon, href, color, description }) => {
            const state = getState(key)
            const isLoading = state === null
            const items = state?.slice(0, 3) ?? []

            return (
              <Card key={key} className="flex flex-col">
                <CardHeader className="flex flex-row items-center pb-2">
                  <CardTitle className="flex items-center gap-2">
                    <Icon className={`h-5 w-5 ${color}`} />
                    {key}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 flex-1">
                  <p className="text-xs text-muted-foreground mb-3">{description}</p>
                  <div className="max-h-48 overflow-y-auto space-y-2 pr-1">
                    {isLoading ? (
                      [1, 2, 3].map(i => (
                        <div key={i} className="rounded-lg border border-border p-2 animate-pulse">
                          <div className="h-3 bg-muted rounded w-3/4 mb-1.5" />
                          <div className="h-2.5 bg-muted rounded w-1/2" />
                        </div>
                      ))
                    ) : items.length === 0 ? (
                      <p className="text-sm text-muted-foreground text-center py-4">
                        {emptyMessages[key] || "Nothing here yet."}
                      </p>
                    ) : (
                      items.map((item) => {
                        const isBase64 = item.url?.startsWith("data:")
                        const name = getItemName(item)
                        const desc = getItemDesc(item)
                        const id = getItemId(item)
                        return isBase64 ? (
                          <div key={id} className="rounded-lg border border-border p-2">
                            <p className="text-sm font-medium text-foreground">{name}</p>
                            {desc && <p className="text-xs text-muted-foreground">{desc}</p>}
                          </div>
                        ) : (
                          <a
                            key={id}
                            href={item.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-between rounded-lg border border-border p-2 transition-colors hover:bg-muted cursor-pointer"
                          >
                            <div>
                              <p className="text-sm font-medium text-foreground">{name}</p>
                              {desc && <p className="text-xs text-muted-foreground">{desc}</p>}
                            </div>
                          </a>
                        )
                      })
                    )}
                  </div>
                  <Link
                    href={href}
                    className="mt-3 flex w-full items-center justify-center gap-1 rounded-lg border border-border p-2 text-sm text-muted-foreground transition-colors hover:bg-muted cursor-pointer"
                  >
                    Open {key} <ChevronRight className="h-4 w-4" />
                  </Link>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </DashboardLayout>
  )
}