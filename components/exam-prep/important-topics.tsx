"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"

interface ImportantTopic {
  _id: string
  topic: string
  subject: string
  priority: "high" | "medium" | "low"
}

const priorityColors = {
  high: "bg-red-100 text-red-700 border-red-200",
  medium: "bg-amber-100 text-amber-700 border-amber-200",
  low: "bg-emerald-100 text-emerald-700 border-emerald-200",
}

export function ImportantTopics() {
  const [topics, setTopics] = useState<ImportantTopic[]>([])
  const [showForm, setShowForm] = useState(false)
  const [topicName, setTopicName] = useState("")
  const [subject, setSubject] = useState("")
  const [priority, setPriority] = useState<"high" | "medium" | "low">("high")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetch("/api/important-topics").then(r => r.json()).then(data => setTopics(Array.isArray(data) ? data : [])).catch(() => setTopics([]))
  }, [])

  const addTopic = async () => {
    if (!topicName.trim() || !subject.trim()) return
    setLoading(true)
    const res = await fetch("/api/important-topics", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ topic: topicName, subject, priority })
    })
    const created = await res.json()
    setTopics(prev => [created, ...prev])
    setTopicName("")
    setSubject("")
    setPriority("high")
    setShowForm(false)
    setLoading(false)
  }

  const deleteTopic = async (_id: string) => {
    await fetch(`/api/important-topics/${_id}`, { method: "DELETE" })
    setTopics(prev => prev.filter(t => t._id !== _id))
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Important Topics</CardTitle>
        <Button size="sm" onClick={() => setShowForm(!showForm)}>
          {showForm ? "Cancel" : "+ Add Topic"}
        </Button>
      </CardHeader>
      <CardContent className="space-y-3">
        {showForm && (
          <div style={{ border: "1px solid #ddd", borderRadius: "8px", padding: "12px", display: "flex", flexDirection: "column", gap: "8px" }}>
            <input
              type="text"
              placeholder="Topic name"
              value={topicName}
              onChange={e => setTopicName(e.target.value)}
              style={{ border: "1px solid #ddd", borderRadius: "6px", padding: "6px 10px", fontSize: "14px" }}
            />
            <input
              type="text"
              placeholder="Subject (e.g. DSA, DBMS)"
              value={subject}
              onChange={e => setSubject(e.target.value)}
              style={{ border: "1px solid #ddd", borderRadius: "6px", padding: "6px 10px", fontSize: "14px" }}
            />
            <select
              value={priority}
              onChange={e => setPriority(e.target.value as "high" | "medium" | "low")}
              style={{ border: "1px solid #ddd", borderRadius: "6px", padding: "6px 10px", fontSize: "14px" }}
            >
              <option value="high">High Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="low">Low Priority</option>
            </select>
            <button
              onClick={addTopic}
              disabled={loading}
              style={{ padding: "8px", backgroundColor: "#3b82f6", color: "white", border: "none", borderRadius: "6px", cursor: "pointer", fontSize: "14px" }}
            >
              {loading ? "Adding..." : "Add Topic"}
            </button>
          </div>
        )}

        {topics.map((item) => (
          <div key={item._id} className="flex items-center justify-between rounded-lg border border-border p-3">
            <div>
              <p className="text-sm font-medium text-foreground">{item.topic}</p>
              <p className="text-xs text-muted-foreground">{item.subject}</p>
            </div>
            <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
              <Badge className={priorityColors[item.priority]} variant="outline">
                {item.priority}
              </Badge>
              <button
                onClick={() => deleteTopic(item._id)}
                style={{ border: "none", background: "none", cursor: "pointer", color: "#ef4444" }}
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}

        {topics.length === 0 && !showForm && (
          <p className="text-sm text-muted-foreground text-center py-4">No important topics yet. Add one above!</p>
        )}
      </CardContent>
    </Card>
  )
}