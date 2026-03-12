"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Code, RefreshCw, Trophy } from "lucide-react"

interface LeetCodeData {
  username: string
  ranking: number
  totalSolved: number
  totalQuestions: number
  easySolved: number
  totalEasy: number
  mediumSolved: number
  totalMedium: number
  hardSolved: number
  totalHard: number
}

export function LeetCodeStats() {
  const [username, setUsername] = useState("")
  const [savedUsername, setSavedUsername] = useState("")
  const [data, setData] = useState<LeetCodeData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [editing, setEditing] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem("lc_username")
    if (stored) {
      setSavedUsername(stored)
      fetchStats(stored)
    }
  }, [])

  const fetchStats = async (uname: string) => {
    if (!uname.trim()) return
    setLoading(true)
    setError("")
    try {
      const res = await fetch(`/api/leetcode?username=${encodeURIComponent(uname)}`)
      const json = await res.json()
      if (!res.ok) {
        setError(json.message || "User not found")
        setData(null)
      } else {
        setData(json)
        setSavedUsername(uname)
        localStorage.setItem("lc_username", uname)
        setEditing(false)
        setUsername("")
      }
    } catch {
      setError("Failed to fetch stats")
    }
    setLoading(false)
  }

  const difficulties = [
    { label: "Easy", solved: data?.easySolved ?? 0, total: data?.totalEasy ?? 0, color: "text-emerald-500", bg: "bg-emerald-500", trackBg: "bg-emerald-100 dark:bg-emerald-950" },
    { label: "Medium", solved: data?.mediumSolved ?? 0, total: data?.totalMedium ?? 0, color: "text-amber-500", bg: "bg-amber-500", trackBg: "bg-amber-100 dark:bg-amber-950" },
    { label: "Hard", solved: data?.hardSolved ?? 0, total: data?.totalHard ?? 0, color: "text-red-500", bg: "bg-red-500", trackBg: "bg-red-100 dark:bg-red-950" },
  ]

  const showForm = !savedUsername || editing

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="flex items-center gap-2">
          <Code className="h-5 w-5 text-amber-500" />
          LeetCode Stats
        </CardTitle>
        {data && !editing && (
          <button onClick={() => fetchStats(savedUsername)} className="cursor-pointer text-muted-foreground hover:text-foreground" title="Refresh">
            <RefreshCw className="h-4 w-4" />
          </button>
        )}
      </CardHeader>

      <CardContent className="space-y-4">
        {showForm ? (
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Enter LeetCode username"
              value={username}
              onChange={e => setUsername(e.target.value)}
              onKeyDown={e => e.key === "Enter" && fetchStats(username)}
              className="flex-1 border border-border rounded-lg px-3 py-2 text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring cursor-text"
            />
            <Button size="sm" onClick={() => fetchStats(username)} disabled={loading || !username.trim()} className="cursor-pointer">
              {loading ? "Loading..." : "Fetch"}
            </Button>
            {editing && (
              <Button size="sm" variant="outline" onClick={() => setEditing(false)} className="cursor-pointer">
                Cancel
              </Button>
            )}
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Trophy className="h-4 w-4 text-amber-500" />
              <span className="text-sm font-medium text-foreground">{savedUsername}</span>
              {data && <span className="text-xs text-muted-foreground">Rank #{data.ranking.toLocaleString()}</span>}
            </div>
            <button onClick={() => { setEditing(true); setUsername(savedUsername) }} className="text-xs text-primary hover:underline cursor-pointer">
              Change
            </button>
          </div>
        )}

        {error && <p className="text-sm text-destructive">{error}</p>}

        {loading && (
          <div className="space-y-3 animate-pulse">
            <div className="h-16 bg-muted rounded-lg" />
            {[1, 2, 3].map(i => (
              <div key={i} className="space-y-1">
                <div className="flex justify-between">
                  <div className="h-3 bg-muted rounded w-12" />
                  <div className="h-3 bg-muted rounded w-16" />
                </div>
                <div className="h-2 bg-muted rounded" />
              </div>
            ))}
          </div>
        )}

        {data && !loading && (
          <>
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
              <div>
                <p className="text-2xl font-bold text-foreground">{data.totalSolved}</p>
                <p className="text-xs text-muted-foreground">of {data.totalQuestions} solved</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-foreground">{((data.totalSolved / data.totalQuestions) * 100).toFixed(1)}%</p>
                <p className="text-xs text-muted-foreground">completion</p>
              </div>
            </div>
            <div className="space-y-3">
              {difficulties.map(d => {
                const pct = d.total === 0 ? 0 : Math.round((d.solved / d.total) * 100)
                return (
                  <div key={d.label}>
                    <div className="flex items-center justify-between mb-1">
                      <span className={`text-sm font-medium ${d.color}`}>{d.label}</span>
                      <span className="text-xs text-muted-foreground">{d.solved} / {d.total}</span>
                    </div>
                    <div className={`h-2 rounded-full ${d.trackBg} overflow-hidden`}>
                      <div className={`h-full rounded-full ${d.bg} transition-all duration-500`} style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                )
              })}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}