"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"

interface Task { _id: string; task: string; completed: boolean }

export function RevisionChecklist() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [newTask, setNewTask] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetch("/api/checklist")
      .then(r => r.json())
      .then(data => setTasks(Array.isArray(data) ? data : []))
  }, [])

  const addTask = async () => {
    if (!newTask.trim()) return
    setLoading(true)
    const res = await fetch("/api/checklist", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ task: newTask })
    })
    if (res.ok) {
      const created = await res.json()
      setTasks(prev => [...prev, created])
      setNewTask("")
    }
    setLoading(false)
  }

  const toggleTask = async (_id: string, completed: boolean) => {
    await fetch(`/api/checklist/${_id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ completed: !completed })
    })
    setTasks(prev => prev.map(t => t._id === _id ? { ...t, completed: !completed } : t))
  }

  const deleteTask = async (_id: string) => {
    await fetch(`/api/checklist/${_id}`, { method: "DELETE" })
    setTasks(prev => prev.filter(t => t._id !== _id))
  }

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle>Revision Checklist</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col flex-1 gap-3">
        {/* Task list */}
        <div className="flex-1 space-y-2">
          {tasks.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-4">No tasks yet. Add one below!</p>
          )}
          {tasks.map(task => (
            <div key={task._id} className="flex items-center gap-3">
              <Checkbox
                id={`task-${task._id}`}
                checked={task.completed}
                onCheckedChange={() => toggleTask(task._id, task.completed)}
                className="cursor-pointer"
              />
              <label
                htmlFor={`task-${task._id}`}
                className={`text-sm flex-1 cursor-pointer ${task.completed ? "text-muted-foreground line-through" : "text-foreground"}`}
              >
                {task.task}
              </label>
              <button
                onClick={() => deleteTask(task._id)}
                className="cursor-pointer border-none bg-transparent text-destructive hover:opacity-70 text-base"
              >
                ✕
              </button>
            </div>
          ))}
        </div>

        {/* Add task — always at bottom */}
        <div className="flex gap-2 pt-2 border-t border-border">
          <input
            type="text"
            placeholder="Add a task..."
            value={newTask}
            onChange={e => setNewTask(e.target.value)}
            onKeyDown={e => e.key === "Enter" && addTask()}
            className="flex-1 border border-border rounded-lg px-3 py-2 text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring cursor-text"
          />
          <button
            onClick={addTask}
            disabled={loading || !newTask.trim()}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium cursor-pointer hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
          >
            Add
          </button>
        </div>
      </CardContent>
    </Card>
  )
}