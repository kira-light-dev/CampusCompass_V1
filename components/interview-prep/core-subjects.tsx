"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Trash2, Plus, X } from "lucide-react"
import { interviewPrepData } from "@/lib/mock-data"

interface CoreSubject {
  _id: string
  name: string
}

export function CoreSubjects() {
  const [subjects, setSubjects] = useState<CoreSubject[] | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [name, setName] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetch("/api/core-subjects")
      .then(r => r.json())
      .then(data => setSubjects(Array.isArray(data) ? data : []))
      .catch(() => setSubjects([]))
  }, [])

  const add = async () => {
    if (!name.trim()) return
    setLoading(true)
    const res = await fetch("/api/core-subjects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: name.trim() })
    })
    if (res.ok) {
      const created = await res.json()
      setSubjects(prev => [...(prev ?? []), created])
      setName("")
      setShowForm(false)
    }
    setLoading(false)
  }

  const remove = async (_id: string) => {
    await fetch(`/api/core-subjects/${_id}`, { method: "DELETE" })
    setSubjects(prev => (prev ?? []).filter(s => s._id !== _id))
  }

  const isLoading = subjects === null
  const hasReal = subjects && subjects.length > 0
  const displayItems = hasReal
    ? subjects
    : interviewPrepData.coreSubjects.map(s => ({ _id: String(s.id), name: s.subject }))

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle>Core CS Subjects</CardTitle>
        <Button size="sm" variant="outline" onClick={() => setShowForm(!showForm)} className="cursor-pointer h-8 w-8 p-0">
          {showForm ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
        </Button>
      </CardHeader>
      <CardContent className="space-y-2">
        {showForm && (
          <div className="flex gap-2 mb-3">
            <input
              autoFocus
              type="text"
              placeholder="e.g. Operating Systems"
              value={name}
              onChange={e => setName(e.target.value)}
              onKeyDown={e => e.key === "Enter" && add()}
              className="flex-1 border border-border rounded-lg px-3 py-2 text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
            <Button size="sm" onClick={add} disabled={loading || !name.trim()} className="cursor-pointer">
              {loading ? "..." : "Add"}
            </Button>
          </div>
        )}

        {isLoading ? (
          [1, 2, 3, 4].map(i => (
            <div key={i} className="h-9 bg-muted rounded-lg animate-pulse" />
          ))
        ) : (
          displayItems.map(item => (
            <div
              key={item._id}
              className="flex items-center justify-between rounded-lg border border-border px-3 py-2"
            >
              <span className="text-sm font-medium text-foreground">{item.name}</span>
              {hasReal && (
                <button
                  onClick={() => remove(item._id)}
                  className="cursor-pointer text-muted-foreground hover:text-destructive transition-colors ml-2"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </div>
          ))
        )}

        {!isLoading && displayItems.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-4">No subjects added yet.</p>
        )}
      </CardContent>
    </Card>
  )
}