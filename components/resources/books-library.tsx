"use client"

import { useState, useEffect } from "react"
import { Upload, Trash2, ExternalLink, BookOpen, Pencil, Check, X } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface BookFile {
  _id: string
  name: string
  url: string
  fileType: string
  size: number
}

const formatSize = (bytes: number) => {
  if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  return `${(bytes / 1024).toFixed(0)} KB`
}

const openFile = (url: string) => {
  const [meta, base64] = url.split(",")
  const mime = meta.split(":")[1].split(";")[0]
  const bytes = atob(base64)
  const arr = new Uint8Array(bytes.length)
  for (let i = 0; i < bytes.length; i++) arr[i] = bytes.charCodeAt(i)
  const blob = new Blob([arr], { type: mime })
  window.open(URL.createObjectURL(blob), "_blank")
}

export function BooksLibrary() {
  const [books, setBooks] = useState<BookFile[]>([])
  const [uploading, setUploading] = useState(false)
  const [name, setName] = useState("")
  const [file, setFile] = useState<File | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editName, setEditName] = useState("")

  useEffect(() => {
    fetch("/api/books")
      .then(r => r.json())
      .then(data => setBooks(Array.isArray(data) ? data : []))
  }, [])

  const upload = async () => {
    if (!file || !name.trim()) return
    setUploading(true)
    const formData = new FormData()
    formData.append("file", file)
    formData.append("name", name)
    await fetch("/api/books", { method: "POST", body: formData })
    const refreshed = await fetch("/api/books").then(r => r.json())
    setBooks(Array.isArray(refreshed) ? refreshed : [])
    setName("")
    setFile(null)
    setShowForm(false)
    setUploading(false)
  }

  const deleteBook = async (_id: string) => {
    await fetch(`/api/books/${_id}`, { method: "DELETE" })
    setBooks(prev => prev.filter(b => b._id !== _id))
  }

  const startEdit = (book: BookFile) => {
    setEditingId(book._id)
    setEditName(book.name)
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditName("")
  }

  const saveEdit = async (_id: string) => {
    if (!editName.trim()) return
    const res = await fetch(`/api/books/${_id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: editName.trim() })
    })
    if (res.ok) {
      const updated = await res.json()
      setBooks(prev => prev.map(b => b._id === _id ? { ...b, name: updated.name } : b))
    }
    setEditingId(null)
    setEditName("")
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-foreground">Books</h2>
          <p className="mt-1 text-muted-foreground">Upload and manage your textbooks and references.</p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/resources" className="text-sm text-primary hover:underline cursor-pointer">← Back</Link>
          <Button size="sm" onClick={() => setShowForm(!showForm)} className="cursor-pointer">
            <Upload className="h-4 w-4 mr-2" />
            {showForm ? "Cancel" : "Upload Book"}
          </Button>
        </div>
      </div>

      {showForm && (
        <Card>
          <CardContent className="p-4 space-y-3">
            <input
              type="text"
              placeholder="Book name"
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background text-foreground"
            />
            <input
              type="file"
              accept=".pdf,.jpg,.jpeg,.png,.docx"
              onChange={e => setFile(e.target.files?.[0] || null)}
              className="text-sm text-foreground cursor-pointer"
            />
            <Button onClick={upload} disabled={uploading || !file || !name.trim()} className="w-full cursor-pointer">
              {uploading ? "Uploading..." : "Upload"}
            </Button>
          </CardContent>
        </Card>
      )}

      {books.length === 0 ? (
        <p className="text-center text-muted-foreground py-12">No books uploaded yet.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {books.map(book => {
            const isEditing = editingId === book._id
            return (
              <Card key={book._id}>
                <CardContent className="p-4 flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <div className="rounded-lg bg-amber-100 dark:bg-amber-900 p-2 shrink-0">
                      <BookOpen className="h-5 w-5 text-amber-600 dark:text-amber-300" />
                    </div>
                    <div className="flex-1 min-w-0">
                      {isEditing ? (
                        <div className="flex items-center gap-1">
                          <input
                            autoFocus
                            value={editName}
                            onChange={e => setEditName(e.target.value)}
                            onKeyDown={e => {
                              if (e.key === "Enter") saveEdit(book._id)
                              if (e.key === "Escape") cancelEdit()
                            }}
                            className="w-full border border-border rounded px-2 py-0.5 text-sm bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                          />
                          <button onClick={() => saveEdit(book._id)} className="text-green-500 hover:text-green-600 cursor-pointer shrink-0">
                            <Check className="h-4 w-4" />
                          </button>
                          <button onClick={cancelEdit} className="text-muted-foreground hover:text-foreground cursor-pointer shrink-0">
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ) : (
                        <p className="text-sm font-medium text-foreground line-clamp-2">{book.name}</p>
                      )}
                      <p className="text-xs text-muted-foreground">{formatSize(book.size)}</p>
                    </div>
                  </div>
                  <div className="flex gap-1 shrink-0">
                    <Button size="sm" variant="outline" className="h-8 w-8 p-0 cursor-pointer" onClick={() => openFile(book.url)}>
                      <ExternalLink className="h-3 w-3" />
                    </Button>
                    {!isEditing && (
                      <Button size="sm" variant="outline" className="h-8 w-8 p-0 cursor-pointer" onClick={() => startEdit(book)}>
                        <Pencil className="h-3 w-3" />
                      </Button>
                    )}
                    <Button size="sm" variant="destructive" className="h-8 w-8 p-0 cursor-pointer" onClick={() => deleteBook(book._id)}>
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}