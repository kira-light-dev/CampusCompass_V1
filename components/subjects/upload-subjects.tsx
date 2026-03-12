"use client"

import { useState, useRef } from "react"
import { Upload, FileText, Image, File, X, CheckCircle, AlertCircle } from "lucide-react"

type Status = "idle" | "loading" | "success" | "error"

const ACCEPTED = ".pdf,.png,.jpg,.jpeg,.webp,.xlsx,.csv,.doc,.docx"

function getFileIcon(file: File) {
  const t = file.type
  if (t.includes("image")) return <Image className="h-5 w-5 text-blue-500" />
  if (t.includes("pdf")) return <FileText className="h-5 w-5 text-red-500" />
  if (t.includes("sheet") || file.name.endsWith(".csv") || file.name.endsWith(".xlsx")) return <FileText className="h-5 w-5 text-green-500" />
  return <File className="h-5 w-5 text-muted-foreground" />
}

export default function UploadSubjects() {
  const [file, setFile] = useState<File | null>(null)
  const [status, setStatus] = useState<Status>("idle")
  const [error, setError] = useState("")
  const [dragging, setDragging] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFile = (f: File) => {
    setFile(f)
    setStatus("idle")
    setError("")
  }

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]
    if (f) handleFile(f)
  }

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragging(false)
    const f = e.dataTransfer.files?.[0]
    if (f) handleFile(f)
  }

  const upload = async () => {
    if (!file) return
    setStatus("loading")
    setError("")

    const formData = new FormData()
    formData.append("file", file)

    const res = await fetch("/api/subjects/upload", {
      method: "POST",
      body: formData
    })

    if (res.ok) {
      setStatus("success")
      setTimeout(() => window.location.reload(), 1000)
    } else {
      const data = await res.json().catch(() => ({}))
      setError(data.message || "Upload failed. Please try again.")
      setStatus("error")
    }
  }

  const clear = () => {
    setFile(null)
    setStatus("idle")
    setError("")
    if (inputRef.current) inputRef.current.value = ""
  }

  return (
    <div className="space-y-3">
      {/* Drop zone */}
      <div
        onDragOver={e => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        onClick={() => !file && inputRef.current?.click()}
        className={`
          relative border-2 border-dashed rounded-xl p-8 text-center transition-all
          ${dragging ? "border-primary bg-primary/5" : "border-border hover:border-primary/50 hover:bg-muted/30"}
          ${!file ? "cursor-pointer" : "cursor-default"}
        `}
      >
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPTED}
          className="hidden"
          onChange={onInputChange}
        />

        {!file ? (
          <div className="space-y-2">
            <div className="flex justify-center">
              <div className="rounded-full bg-primary/10 p-4">
                <Upload className="h-7 w-7 text-primary" />
              </div>
            </div>
            <p className="text-sm font-medium text-foreground">Drop your syllabus file here or click to browse</p>
            <p className="text-xs text-muted-foreground">Supports PDF, Images (JPG, PNG), Excel, CSV, Word</p>
            <p className="text-xs text-muted-foreground">AI will automatically extract subjects and topics</p>
          </div>
        ) : (
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              {getFileIcon(file)}
              <div className="min-w-0 text-left">
                <p className="text-sm font-medium text-foreground truncate">{file.name}</p>
                <p className="text-xs text-muted-foreground">{(file.size / 1024).toFixed(1)} KB</p>
              </div>
            </div>
            <button
              onClick={e => { e.stopPropagation(); clear() }}
              className="shrink-0 text-muted-foreground hover:text-destructive transition-colors cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>

      {/* Status messages */}
      {status === "error" && (
        <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 rounded-lg px-3 py-2">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {error}
        </div>
      )}

      {status === "success" && (
        <div className="flex items-center gap-2 text-sm text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg px-3 py-2">
          <CheckCircle className="h-4 w-4 shrink-0" />
          Subjects extracted and saved! Reloading...
        </div>
      )}

      {/* Upload button */}
      {file && status !== "success" && (
        <button
          onClick={upload}
          disabled={status === "loading"}
          className="w-full py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium cursor-pointer hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity flex items-center justify-center gap-2"
        >
          {status === "loading" ? (
            <>
              <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              AI is extracting subjects...
            </>
          ) : (
            <>
              <Upload className="h-4 w-4" />
              Extract & Upload Subjects
            </>
          )}
        </button>
      )}
    </div>
  )
}
