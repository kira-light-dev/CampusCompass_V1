"use client"

import { useState, useEffect } from "react"
import AddTopic from "@/components/subjects/add-topic"
import { Progress } from "@/components/ui/progress"

interface Topic { _id: string; name: string; completed: boolean }
interface SubjectCardProps {
  subjectId: string
  name: string
  topics: Topic[]
  onProgressChange?: () => void
}

export default function SubjectCard({ subjectId, name, topics, onProgressChange }: SubjectCardProps) {
  const [expanded, setExpanded] = useState(false)
  const [topicStates, setTopicStates] = useState(topics)

  // Sync local state whenever the parent passes fresh topics (e.g. after re-fetch)
  useEffect(() => {
    setTopicStates(topics)
  }, [topics])

  const toggleTopic = async (_id: string) => {
    const topic = topicStates.find(t => t._id === _id)
    if (!topic) return
    const newCompleted = !topic.completed
    setTopicStates(prev => prev.map(t => t._id === _id ? { ...t, completed: newCompleted } : t))
    await fetch(`/api/subjects/${subjectId}/topic/${_id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ completed: newCompleted })
    })
    onProgressChange?.()
  }

  const deleteTopic = async (topicId: string) => {
    await fetch(`/api/subjects/${subjectId}/topic/${topicId}`, { method: "DELETE" })
    setTopicStates(prev => prev.filter(t => t._id !== topicId))
    onProgressChange?.()
  }

  const deleteSubject = async () => {
    if (!confirm("Delete this subject?")) return
    await fetch(`/api/subjects/${subjectId}`, { method: "DELETE" })
    window.location.reload()
  }

  const completedCount = topicStates.filter(t => t.completed).length
  const currentProgress = topicStates.length === 0 ? 0 : Math.round((completedCount / topicStates.length) * 100)

  return (
    <div className="rounded-lg border border-border bg-card p-4 overflow-hidden">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-foreground">{name}</h3>
        <div className="flex items-center gap-2">
          <button onClick={deleteSubject} className="cursor-pointer border-none bg-transparent text-destructive hover:opacity-70 text-sm">🗑</button>
          <button onClick={() => setExpanded(!expanded)} className="cursor-pointer border-none bg-transparent text-foreground hover:opacity-70 text-lg">{expanded ? "▲" : "▼"}</button>
        </div>
      </div>

      <div className="mt-3">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs text-muted-foreground">{completedCount}/{topicStates.length} topics</span>
          <span className="text-xs font-medium text-foreground">{currentProgress}%</span>
        </div>
        <Progress value={currentProgress} />
      </div>

      {expanded && (
        <div className="mt-3 space-y-2">
          {topicStates.map(topic => (
            <div key={topic._id} className="flex items-center gap-2">
              <input type="checkbox" checked={topic.completed} onChange={() => toggleTopic(topic._id)} className="cursor-pointer" />
              <span className={`flex-1 text-sm ${topic.completed ? "line-through text-muted-foreground" : "text-foreground"}`}>{topic.name}</span>
              <button onClick={() => deleteTopic(topic._id)} className="cursor-pointer border-none bg-transparent text-destructive hover:opacity-70 text-sm">✕</button>
            </div>
          ))}
          <AddTopic subjectId={subjectId} />
        </div>
      )}
    </div>
  )
}