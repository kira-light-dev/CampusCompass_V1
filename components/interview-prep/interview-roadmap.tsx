"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Map, Loader2, ChevronDown, ChevronUp, Briefcase, Target, BookOpen, AlertCircle, Bookmark, BookmarkCheck, Trash2 } from "lucide-react"

interface Round {
  name: string
  description: string
  topics: string[]
  tip: string
}

interface RoadmapData {
  _id?: string
  company: string
  role: string
  overview: string
  difficulty: string
  rounds: Round[]
  keyTopics: string[]
  focusAreas: string[]
}

const popularCompanies = [
  "Google", "Amazon", "Microsoft", "Meta", "Apple",
  "Flipkart", "Infosys", "TCS", "Wipro", "Accenture",
  "Goldman Sachs", "Morgan Stanley", "Uber", "Netflix", "Adobe", "Zoho"
]

const popularRoles = [
  "Software Engineer (SDE-1)",
  "Software Engineer (SDE-2)",
  "Frontend Developer",
  "Backend Developer",
  "Full Stack Developer",
  "Data Engineer",
  "ML Engineer",
  "DevOps Engineer",
  "System Design Engineer",
]

const difficultyColor: Record<string, string> = {
  Easy: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
  Medium: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
  Hard: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300",
  "Very Hard": "bg-red-200 text-red-800 dark:bg-red-900/60 dark:text-red-200",
}

function RoadmapView({ roadmap, expandedRound, setExpandedRound }: {
  roadmap: RoadmapData
  expandedRound: number | null
  setExpandedRound: (i: number | null) => void
}) {
  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-border bg-muted/30 p-4 space-y-2">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <Briefcase className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-semibold text-foreground">{roadmap.company} — {roadmap.role}</span>
          </div>
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${difficultyColor[roadmap.difficulty] ?? "bg-muted text-muted-foreground"}`}>
            {roadmap.difficulty}
          </span>
        </div>
        <p className="text-sm text-muted-foreground">{roadmap.overview}</p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-lg border border-border p-3 space-y-2">
          <div className="flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-blue-500" />
            <span className="text-xs font-semibold text-foreground uppercase tracking-wide">Key Topics</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {roadmap.keyTopics.map(t => (
              <span key={t} className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 font-medium">{t}</span>
            ))}
          </div>
        </div>

        <div className="rounded-lg border border-border p-3 space-y-2">
          <div className="flex items-center gap-2">
            <Target className="h-4 w-4 text-amber-500" />
            <span className="text-xs font-semibold text-foreground uppercase tracking-wide">Focus Areas</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {roadmap.focusAreas.map(f => (
              <span key={f} className="text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300 font-medium">{f}</span>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <span className="text-xs font-semibold text-foreground uppercase tracking-wide">Interview Rounds</span>
        {roadmap.rounds.map((round, i) => (
          <div key={i} className="rounded-lg border border-border overflow-hidden">
            <button
              onClick={() => setExpandedRound(expandedRound === i ? null : i)}
              className="w-full flex items-center justify-between px-4 py-3 bg-muted/30 hover:bg-muted/60 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-primary bg-primary/10 rounded-full w-6 h-6 flex items-center justify-center shrink-0">{i + 1}</span>
                <span className="text-sm font-medium text-foreground">{round.name}</span>
              </div>
              {expandedRound === i ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
            </button>
            {expandedRound === i && (
              <div className="px-4 py-3 space-y-3 border-t border-border">
                <p className="text-sm text-muted-foreground">{round.description}</p>
                <div className="flex flex-wrap gap-1.5">
                  {round.topics.map(t => (
                    <span key={t} className="text-xs px-2 py-0.5 rounded-full bg-muted text-foreground font-medium">{t}</span>
                  ))}
                </div>
                <div className="flex items-start gap-2 bg-primary/5 rounded-lg px-3 py-2">
                  <span className="text-xs font-semibold text-primary shrink-0 mt-0.5">💡 Tip:</span>
                  <span className="text-xs text-muted-foreground">{round.tip}</span>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export function InterviewRoadmap() {
  const [company, setCompany] = useState("")
  const [role, setRole] = useState("")
  const [loading, setLoading] = useState(false)
  const [roadmap, setRoadmap] = useState<RoadmapData | null>(null)
  const [error, setError] = useState("")
  const [expandedRound, setExpandedRound] = useState<number | null>(0)
  const [showCompanySuggestions, setShowCompanySuggestions] = useState(false)
  const [showRoleSuggestions, setShowRoleSuggestions] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [savedRoadmaps, setSavedRoadmaps] = useState<RoadmapData[]>([])
  const [showSaved, setShowSaved] = useState(false)
  const [savedExpandedRound, setSavedExpandedRound] = useState<number | null>(0)
  const [selectedSaved, setSelectedSaved] = useState<RoadmapData | null>(null)

  useEffect(() => {
    fetch("/api/saved-roadmaps")
      .then(r => r.json())
      .then(data => setSavedRoadmaps(Array.isArray(data) ? data : []))
      .catch(() => setSavedRoadmaps([]))
  }, [])

  const companySuggestions = popularCompanies.filter(c =>
    company.length > 0 && c.toLowerCase().includes(company.toLowerCase())
  )
  const roleSuggestions = popularRoles.filter(r =>
    role.length > 0 && r.toLowerCase().includes(role.toLowerCase())
  )

  const generate = async () => {
    if (!company.trim() || !role.trim()) return
    setLoading(true)
    setError("")
    setRoadmap(null)
    setSaved(false)

    try {
      const res = await fetch("/api/interview-roadmap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ company: company.trim(), role: role.trim() })
      })
      if (!res.ok) throw new Error()
      const data = await res.json()
      setRoadmap(data)
      setExpandedRound(0)
    } catch {
      setError("Failed to generate roadmap. Please check your GROQ_API_KEY in .env.local and try again.")
    } finally {
      setLoading(false)
    }
  }

  const saveRoadmap = async () => {
    if (!roadmap) return
    setSaving(true)
    try {
      const res = await fetch("/api/saved-roadmaps", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(roadmap)
      })
      if (res.ok) {
        const saved = await res.json()
        setSavedRoadmaps(prev => [saved, ...prev])
        setSaved(true)
      }
    } finally {
      setSaving(false)
    }
  }

  const deleteRoadmap = async (_id: string) => {
    await fetch(`/api/saved-roadmaps/${_id}`, { method: "DELETE" })
    setSavedRoadmaps(prev => prev.filter(r => r._id !== _id))
    if (selectedSaved?._id === _id) setSelectedSaved(null)
  }

  return (
    <div className="space-y-4">
      {/* Generate card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="rounded-lg bg-blue-500/10 p-2">
                <Map className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <CardTitle>Interview Roadmap</CardTitle>
                <p className="text-xs text-muted-foreground mt-0.5">Get a company + role specific interview breakdown</p>
              </div>
            </div>
            {savedRoadmaps.length > 0 && (
              <button
                onClick={() => { setShowSaved(!showSaved); setSelectedSaved(null) }}
                className="flex items-center gap-1.5 text-xs font-medium text-primary hover:opacity-80 transition-opacity cursor-pointer"
              >
                <Bookmark className="h-4 w-4" />
                Saved ({savedRoadmaps.length})
              </button>
            )}
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="flex gap-3 flex-col sm:flex-row">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Company (e.g. Google)"
                value={company}
                onChange={e => { setCompany(e.target.value); setShowCompanySuggestions(true) }}
                onFocus={() => setShowCompanySuggestions(true)}
                onBlur={() => setTimeout(() => setShowCompanySuggestions(false), 150)}
                className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
              {showCompanySuggestions && companySuggestions.length > 0 && (
                <div className="absolute z-10 top-full mt-1 w-full bg-background border border-border rounded-lg shadow-md overflow-hidden">
                  {companySuggestions.map(c => (
                    <button key={c} onMouseDown={() => { setCompany(c); setShowCompanySuggestions(false) }}
                      className="w-full text-left px-3 py-2 text-sm hover:bg-muted cursor-pointer">{c}</button>
                  ))}
                </div>
              )}
            </div>

            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Role (e.g. SDE-1)"
                value={role}
                onChange={e => { setRole(e.target.value); setShowRoleSuggestions(true) }}
                onFocus={() => setShowRoleSuggestions(true)}
                onBlur={() => setTimeout(() => setShowRoleSuggestions(false), 150)}
                className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
              {showRoleSuggestions && roleSuggestions.length > 0 && (
                <div className="absolute z-10 top-full mt-1 w-full bg-background border border-border rounded-lg shadow-md overflow-hidden">
                  {roleSuggestions.map(r => (
                    <button key={r} onMouseDown={() => { setRole(r); setShowRoleSuggestions(false) }}
                      className="w-full text-left px-3 py-2 text-sm hover:bg-muted cursor-pointer">{r}</button>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={generate}
              disabled={loading || !company.trim() || !role.trim()}
              className="px-5 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium cursor-pointer hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity whitespace-nowrap flex items-center gap-2"
            >
              {loading ? <><Loader2 className="h-4 w-4 animate-spin" /> Generating...</> : "Generate"}
            </button>
          </div>

          {error && (
            <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 rounded-lg px-3 py-2">
              <AlertCircle className="h-4 w-4 shrink-0" />
              {error}
            </div>
          )}

          {loading && (
            <div className="space-y-3 animate-pulse">
              <div className="h-16 bg-muted rounded-lg" />
              <div className="grid grid-cols-2 gap-3">
                <div className="h-24 bg-muted rounded-lg" />
                <div className="h-24 bg-muted rounded-lg" />
              </div>
              <div className="h-32 bg-muted rounded-lg" />
            </div>
          )}

          {roadmap && !loading && (
            <div className="space-y-4">
              {/* Save button */}
              <div className="flex justify-end">
                <button
                  onClick={saveRoadmap}
                  disabled={saving || saved}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border text-sm font-medium cursor-pointer hover:bg-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saved
                    ? <><BookmarkCheck className="h-4 w-4 text-primary" /> Saved</>
                    : saving
                      ? <><Loader2 className="h-4 w-4 animate-spin" /> Saving...</>
                      : <><Bookmark className="h-4 w-4" /> Save Roadmap</>
                  }
                </button>
              </div>

              <RoadmapView roadmap={roadmap} expandedRound={expandedRound} setExpandedRound={setExpandedRound} />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Saved roadmaps */}
      {showSaved && savedRoadmaps.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Saved Roadmaps</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {/* List */}
            {!selectedSaved && (
              <div className="space-y-2">
                {savedRoadmaps.map(r => (
                  <div key={r._id} className="flex items-center justify-between rounded-lg border border-border px-4 py-3">
                    <button
                      onClick={() => { setSelectedSaved(r); setSavedExpandedRound(0) }}
                      className="flex items-center gap-3 flex-1 text-left cursor-pointer hover:opacity-80 transition-opacity"
                    >
                      <Briefcase className="h-4 w-4 text-muted-foreground shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-foreground">{r.company} — {r.role}</p>
                        <p className="text-xs text-muted-foreground">{r.difficulty}</p>
                      </div>
                    </button>
                    <button
                      onClick={() => deleteRoadmap(r._id!)}
                      className="cursor-pointer text-muted-foreground hover:text-destructive transition-colors ml-2"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Selected saved roadmap detail */}
            {selectedSaved && (
              <div className="space-y-3">
                <button
                  onClick={() => setSelectedSaved(null)}
                  className="text-xs text-primary hover:underline cursor-pointer"
                >
                  ← Back to saved list
                </button>
                <RoadmapView roadmap={selectedSaved} expandedRound={savedExpandedRound} setExpandedRound={setSavedExpandedRound} />
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
