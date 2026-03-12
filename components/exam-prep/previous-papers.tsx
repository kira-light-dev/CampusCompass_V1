"use client"

import { useState, useEffect } from "react"
import { Download, Check, FileText, Trash2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface Paper {
  _id: string
  name: string
  url: string
  subjectName: string
  downloaded: boolean
}

export function PreviousPapers() {
  const [papers, setPapers] = useState<Paper[]>([])
  const [uploading, setUploading] = useState(false)
  const [paperName, setPaperName] = useState("")
  const [subjectName, setSubjectName] = useState("")
  const [file, setFile] = useState<File | null>(null)
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    fetch("/api/papers").then(r => r.json()).then(data => setPapers(Array.isArray(data) ? data : [])).catch(() => setPapers([]))
  }, [])

  const uploadPaper = async () => {
    if (!file || !paperName.trim()) return
    setUploading(true)
    const formData = new FormData()
    formData.append("file", file)
    formData.append("name", paperName)
    formData.append("subjectName", subjectName)

    const res = await fetch("/api/papers", { method: "POST", body: formData })
    const created = await res.json()
    setPapers(prev => [created, ...prev])
    setPaperName("")
    setSubjectName("")
    setFile(null)
    setShowForm(false)
    setUploading(false)
  }

  const markDownloaded = async (_id: string) => {
    await fetch(`/api/papers/${_id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ downloaded: true })
    })
    setPapers(prev => prev.map(p => p._id === _id ? { ...p, downloaded: true } : p))
  }

  const deletePaper = async (_id: string) => {
    await fetch(`/api/papers/${_id}`, { method: "DELETE" })
    setPapers(prev => prev.filter(p => p._id !== _id))
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Previous Year Papers</CardTitle>
        <Button size="sm" onClick={() => setShowForm(!showForm)}>
          {showForm ? "Cancel" : "+ Add Paper"}
        </Button>
      </CardHeader>
      <CardContent className="space-y-3">
        {showForm && (
          <div style={{ border: "1px solid #ddd", borderRadius: "8px", padding: "12px", display: "flex", flexDirection: "column", gap: "8px" }}>
            <input
              type="text"
              placeholder="Paper name (e.g. DSA Mid-Sem 2024)"
              value={paperName}
              onChange={e => setPaperName(e.target.value)}
              style={{ border: "1px solid #ddd", borderRadius: "6px", padding: "6px 10px", fontSize: "14px" }}
            />
            <input
              type="text"
              placeholder="Subject name"
              value={subjectName}
              onChange={e => setSubjectName(e.target.value)}
              style={{ border: "1px solid #ddd", borderRadius: "6px", padding: "6px 10px", fontSize: "14px" }}
            />
            <input
              type="file"
              accept=".pdf"
              onChange={e => setFile(e.target.files?.[0] || null)}
              style={{ fontSize: "14px" }}
            />
            <button
              onClick={uploadPaper}
              disabled={uploading || !file || !paperName.trim()}
              style={{ padding: "8px", backgroundColor: "#3b82f6", color: "white", border: "none", borderRadius: "6px", cursor: "pointer", fontSize: "14px", opacity: uploading ? 0.6 : 1 }}
            >
              {uploading ? "Uploading..." : "Upload Paper"}
            </button>
          </div>
        )}

        {papers.map((paper) => (
          <div key={paper._id} className="flex items-center justify-between rounded-lg border border-border p-3">
            <div className="flex items-center gap-3">
              <FileText className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-foreground">{paper.name}</p>
                {paper.subjectName && <p className="text-xs text-muted-foreground">{paper.subjectName}</p>}
              </div>
            </div>
            <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
              <Button
                variant={paper.downloaded ? "secondary" : "outline"}
                size="sm"
                onClick={() => {
                  window.open(paper.url, "_blank")
                  markDownloaded(paper._id)
                }}
              >
                {paper.downloaded ? <><Check className="mr-1 h-4 w-4" /> Done</> : <><Download className="mr-1 h-4 w-4" /> Download</>}
              </Button>
              <button
                onClick={() => deletePaper(paper._id)}
                style={{ border: "none", background: "none", cursor: "pointer", color: "#ef4444" }}
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}

        {papers.length === 0 && !showForm && (
          <p className="text-sm text-muted-foreground text-center py-4">No papers yet. Add one above!</p>
        )}
      </CardContent>
    </Card>
  )
}