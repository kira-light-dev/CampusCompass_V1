"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Trash2, Plus, X, FileText } from "lucide-react"

interface InterviewNote {
  _id: string
  topic: string
  confidence: number
  note: string
}

const confidenceLabel = (n: number) => {
  if (n <= 3) return { text: "Low", color: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300" }
  if (n <= 6) return { text: "Mid", color: "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300" }
  return { text: "High", color: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300" }
}

const suggestions = [
  "DSA - Arrays & Strings", "DSA - Trees & Graphs", "DSA - Dynamic Programming",
  "System Design", "Operating Systems", "DBMS & SQL",
  "Computer Networks", "OOP Concepts", "HR Round", "Behavioural Questions",
]

export function MockInterviews() {
  const [notes, setNotes] = useState<InterviewNote[]>([])
  const [showForm, setShowForm] = useState(false)
  const [topic, setTopic] = useState("")
  const [confidence, setConfidence] = useState(5)
  const [note, setNote] = useState("")
  const [loading, setLoading] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(false)

  useEffect(() => {
    fetch("/api/interview-notes")
      .then(r => r.json())
      .then(data => setNotes(Array.isArray(data) ? data : []))
      .catch(() => setNotes([]))
  }, [])

  const add = async () => {
    if (!topic.trim()) return
    setLoading(true)
    const res = await fetch("/api/interview-notes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ topic: topic.trim(), confidence, note: note.trim() })
    })
    if (res.ok) {
      const created = await res.json()
      setNotes(prev => [created, ...prev])
      setTopic("")
      setConfidence(5)
      setNote("")
      setShowForm(false)
    }
    setLoading(false)
  }

  const remove = async (_id: string) => {
    await fetch(`/api/interview-notes/${_id}`, { method: "DELETE" })
    setNotes(prev => prev.filter(n => n._id !== _id))
  }

  const filteredSuggestions = suggestions.filter(s =>
    topic.length > 0 && s.toLowerCase().includes(topic.toLowerCase())
  )

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle>Interview Notes</CardTitle>
        <Button size="sm" variant="outline" onClick={() => setShowForm(!showForm)} className="cursor-pointer h-8 w-8 p-0">
          {showForm ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
        </Button>
      </CardHeader>
      <CardContent className="space-y-3">
        {showForm && (
          <div className="border border-border rounded-lg p-3 space-y-3 bg-muted/30">
            <div className="relative">
              <input
                autoFocus
                type="text"
                placeholder="Topic (e.g. System Design)"
                value={topic}
                onChange={e => { setTopic(e.target.value); setShowSuggestions(true) }}
                onFocus={() => setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
                className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
              {showSuggestions && filteredSuggestions.length > 0 && (
                <div className="absolute z-10 top-full mt-1 w-full bg-background border border-border rounded-lg shadow-md overflow-hidden">
                  {filteredSuggestions.map(s => (
                    <button key={s} onMouseDown={() => { setTopic(s); setShowSuggestions(false) }}
                      className="w-full text-left px-3 py-2 text-sm hover:bg-muted cursor-pointer">
                      {s}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-xs text-muted-foreground">Confidence</label>
                <span className="text-xs font-semibold text-foreground">{confidence}/10</span>
              </div>
              <input type="range" min={1} max={10} value={confidence}
                onChange={e => setConfidence(Number(e.target.value))}
                className="w-full accent-primary cursor-pointer" />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Not confident</span>
                <span>Very confident</span>
              </div>
            </div>

            <textarea
              placeholder="Notes (optional) — what went well, what to improve..."
              value={note}
              onChange={e => setNote(e.target.value)}
              rows={2}
              className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
            />

            <Button onClick={add} disabled={loading || !topic.trim()} className="w-full cursor-pointer">
              {loading ? "Saving..." : "Save Note"}
            </Button>
          </div>
        )}

        {notes.length === 0 && !showForm ? (
          <p className="text-sm text-muted-foreground text-center py-6">No notes yet. Click + to add one.</p>
        ) : (
          notes.map(n => {
            const conf = confidenceLabel(n.confidence)
            return (
              <div key={n._id} className="rounded-lg border border-border p-3 space-y-1">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0 flex-wrap">
                    <p className="text-sm font-medium text-foreground">{n.topic}</p>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium shrink-0 ${conf.color}`}>
                      {n.confidence}/10 · {conf.text}
                    </span>
                  </div>
                  <button onClick={() => remove(n._id)} className="cursor-pointer text-muted-foreground hover:text-destructive transition-colors shrink-0">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                {n.note && (
                  <p className="text-xs text-muted-foreground flex items-start gap-1">
                    <FileText className="h-3 w-3 mt-0.5 shrink-0" />
                    {n.note}
                  </p>
                )}
              </div>
            )
          })
        )}
      </CardContent>
    </Card>
  )
}