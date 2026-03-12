"use client"

import { useState, useEffect } from "react"
import { ExternalLink, Trash2, Plus } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { resources } from "@/lib/mock-data"

interface PracticeLink {
  _id: string
  name: string
  url: string
  description: string
}

const defaultLinks = resources.find(r => r.category === "Practice")?.items || []

export function PracticeLinks() {
  const [links, setLinks] = useState<PracticeLink[]>([])
  const [showForm, setShowForm] = useState(false)
  const [name, setName] = useState("")
  const [url, setUrl] = useState("")
  const [description, setDescription] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetch("/api/practice-links").then(r => r.json()).then(setLinks)
  }, [])

  const addLink = async () => {
    if (!name.trim() || !url.trim()) return
    setLoading(true)
    const res = await fetch("/api/practice-links", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, url, description })
    })
    const created = await res.json()
    setLinks(prev => [created, ...prev])
    setName(""); setUrl(""); setDescription("")
    setShowForm(false)
    setLoading(false)
  }

  const deleteLink = async (_id: string) => {
    await fetch(`/api/practice-links/${_id}`, { method: "DELETE" })
    setLinks(prev => prev.filter(l => l._id !== _id))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-foreground">Practice</h2>
          <p className="mt-1 text-muted-foreground">Coding practice platforms and resources.</p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/resources" className="text-sm text-primary hover:underline">← Back</Link>
          <Button size="sm" onClick={() => setShowForm(!showForm)}>
            <Plus className="h-4 w-4 mr-2" />
            {showForm ? "Cancel" : "Add Link"}
          </Button>
        </div>
      </div>

      {showForm && (
        <Card>
          <CardContent className="p-4 space-y-3">
            <input type="text" placeholder="Name" value={name} onChange={e => setName(e.target.value)}
              className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background text-foreground" />
            <input type="url" placeholder="URL (https://...)" value={url} onChange={e => setUrl(e.target.value)}
              className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background text-foreground" />
            <input type="text" placeholder="Description (optional)" value={description} onChange={e => setDescription(e.target.value)}
              className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background text-foreground" />
            <Button onClick={addLink} disabled={loading} className="w-full">
              {loading ? "Adding..." : "Add Link"}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Default curated links */}
      <div>
        <h3 className="text-sm font-medium text-muted-foreground mb-3">Curated</h3>
        <div className="space-y-2">
          {defaultLinks.map(link => (
            <a key={link.id} href={link.url} target="_blank" rel="noopener noreferrer"
              className="flex items-center justify-between rounded-lg border border-border p-3 transition-colors hover:bg-muted">
              <div>
                <p className="text-sm font-medium text-foreground">{link.name}</p>
                <p className="text-xs text-muted-foreground">{link.description}</p>
              </div>
              <ExternalLink className="h-4 w-4 text-muted-foreground" />
            </a>
          ))}
        </div>
      </div>

      {/* Custom links */}
      {links.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-muted-foreground mb-3">Your Links</h3>
          <div className="space-y-2">
            {links.map(link => (
              <div key={link._id} className="flex items-center justify-between rounded-lg border border-border p-3">
                <div>
                  <p className="text-sm font-medium text-foreground">{link.name}</p>
                  {link.description && <p className="text-xs text-muted-foreground">{link.description}</p>}
                </div>
                <div className="flex gap-2">
                  <a href={link.url} target="_blank" rel="noopener noreferrer">
                    <Button size="sm" variant="outline" className="h-8 w-8 p-0">
                      <ExternalLink className="h-3 w-3" />
                    </Button>
                  </a>
                  <Button size="sm" variant="destructive" className="h-8 w-8 p-0" onClick={() => deleteLink(link._id)}>
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}