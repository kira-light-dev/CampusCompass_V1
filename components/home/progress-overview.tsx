"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

interface Topic { _id: string; name: string; completed: boolean }
interface Subject { _id: string; name: string; topics: Topic[] }
interface OverviewData {
  subjects: Subject[]
  examTasks: { completed: boolean }[]
}

export function ProgressOverview() {
  const [data, setData] = useState<OverviewData | null>(null)
  const [interviewScore, setInterviewScore] = useState(0)
  const [mounted, setMounted] = useState(false)

  const fetchData = () => {
    Promise.all([
      fetch("/api/subjects").then(r => r.json()).catch(() => []),
      fetch("/api/checklist").then(r => r.json()).catch(() => []),
    ]).then(([subjects, examTasks]) => {
      setData({
        subjects: Array.isArray(subjects) ? subjects : [],
        examTasks: Array.isArray(examTasks) ? examTasks : [],
      })
    })
  }

  useEffect(() => {
    fetchData()
    // Read interview score from localStorage — same source as ReadinessIndicator
    const saved = localStorage.getItem("interview-readiness")
    setInterviewScore(saved ? parseInt(saved) : 0)
    setMounted(true)

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        fetchData()
        const updated = localStorage.getItem("interview-readiness")
        setInterviewScore(updated ? parseInt(updated) : 0)
      }
    }
    document.addEventListener("visibilitychange", handleVisibilityChange)
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange)
  }, [])

  const isLoading = data === null || !mounted

  const subjects = data?.subjects ?? []
  const totalTopics = subjects.reduce((acc, s) => acc + s.topics.length, 0)
  const completedTopics = subjects.reduce((acc, s) => acc + s.topics.filter(t => t.completed).length, 0)
  const syllabusProgress = totalTopics === 0 ? 0 : Math.round((completedTopics / totalTopics) * 100)

  const examTasks = data?.examTasks ?? []
  const examTasksCompleted = examTasks.filter(t => t.completed).length
  const examTasksTotal = examTasks.length
  const examProgress = examTasksTotal === 0 ? 0 : Math.round((examTasksCompleted / examTasksTotal) * 100)

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Syllabus Progress</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="animate-pulse space-y-2">
              <div className="h-8 bg-muted rounded w-16" />
              <div className="h-2 bg-muted rounded" />
              <div className="h-3 bg-muted rounded w-32" />
            </div>
          ) : (
            <>
              <div className="text-2xl font-bold text-foreground">{syllabusProgress}%</div>
              <Progress value={syllabusProgress} className="mt-2" />
              <p className="mt-2 text-xs text-muted-foreground">{completedTopics} of {totalTopics} topics completed</p>
            </>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Exam Prep</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="animate-pulse space-y-2">
              <div className="h-8 bg-muted rounded w-16" />
              <div className="h-2 bg-muted rounded" />
              <div className="h-3 bg-muted rounded w-32" />
            </div>
          ) : (
            <>
              <div className="text-2xl font-bold text-foreground">{examProgress}%</div>
              <Progress value={examProgress} className="mt-2" />
              <p className="mt-2 text-xs text-muted-foreground">{examTasksCompleted} of {examTasksTotal} tasks done</p>
            </>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Interview Readiness</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="animate-pulse space-y-2">
              <div className="h-8 bg-muted rounded w-16" />
              <div className="h-2 bg-muted rounded" />
              <div className="h-3 bg-muted rounded w-32" />
            </div>
          ) : (
            <>
              <div className="text-2xl font-bold text-foreground">{interviewScore}%</div>
              <Progress value={interviewScore} className="mt-2" />
              <p className="mt-2 text-xs text-muted-foreground">
                {interviewScore >= 70 ? "Good progress!" : interviewScore >= 50 ? "Keep practicing" : interviewScore === 0 ? "Set your confidence in Interview Prep" : "Needs more work"}
              </p>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
