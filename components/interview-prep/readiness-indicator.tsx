"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

export function ReadinessIndicator() {
  const [score, setScore] = useState<number>(0)
  const [mounted, setMounted] = useState(false)
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState<number>(0)

  useEffect(() => {
    const saved = localStorage.getItem("interview-readiness")
    const val = saved ? parseInt(saved) : 0
    setScore(val)
    setDraft(val)
    setMounted(true)
  }, [])

  const save = () => {
    setScore(draft)
    localStorage.setItem("interview-readiness", String(draft))
    setEditing(false)
  }

  let level: "low" | "medium" | "high" = "low"
  let levelColor = "bg-red-100 text-red-700"
  if (score >= 70) { level = "high"; levelColor = "bg-emerald-100 text-emerald-700" }
  else if (score >= 50) { level = "medium"; levelColor = "bg-amber-100 text-amber-700" }

  if (!mounted) return (
    <Card className="bg-accent/30">
      <CardContent className="pt-6">
        <div className="animate-pulse space-y-2">
          <div className="h-10 bg-muted rounded w-20" />
          <div className="h-2 bg-muted rounded" />
        </div>
      </CardContent>
    </Card>
  )

  return (
    <Card className="bg-accent/30">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium text-muted-foreground">Interview Readiness</CardTitle>
          <button
            onClick={() => { setEditing(!editing); setDraft(score) }}
            className="text-xs text-primary hover:underline cursor-pointer"
          >
            {editing ? "Cancel" : "Update"}
          </button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {editing ? (
          <div className="space-y-3">
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">How confident do you feel for interviews?</span>
                <span className="text-lg font-bold text-foreground">{draft}%</span>
              </div>
              <input
                type="range"
                min={0}
                max={100}
                value={draft}
                onChange={e => setDraft(Number(e.target.value))}
                className="w-full accent-primary cursor-pointer"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Not ready</span>
                <span>Fully ready</span>
              </div>
            </div>
            <button
              onClick={save}
              className="w-full py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium cursor-pointer hover:opacity-90 transition-opacity"
            >
              Save
            </button>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between">
              <div className="text-4xl font-bold text-foreground">{score}%</div>
              <Badge className={levelColor}>{level.toUpperCase()}</Badge>
            </div>
            <Progress value={score} className="mt-2" />
            <p className="mt-2 text-sm text-muted-foreground">
              {level === "high"
                ? "You're well prepared! Keep practicing to maintain momentum."
                : level === "medium"
                  ? "Good progress! Focus on weak areas to improve."
                  : score === 0
                    ? "Click Update to set your interview confidence level."
                    : "Keep practicing! Consistency is key to improvement."}
            </p>
          </>
        )}
      </CardContent>
    </Card>
  )
}
