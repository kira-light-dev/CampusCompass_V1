"use client"

import { useState, useEffect } from "react"
import { Search, Bookmark, Trash2, Eye, Play, List, Video, BookmarkCheck } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface YoutubeItem {
  _id?: string
  videoId?: string
  playlistId?: string
  title: string
  channel: string
  thumbnail: string
  viewCount?: string
  videoCount?: number
  url: string
  type: "video" | "playlist"
}

export function YoutubeLibrary() {
  const [saved, setSaved] = useState<YoutubeItem[]>([])
  const [results, setResults] = useState<YoutubeItem[]>([])
  const [query, setQuery] = useState("")
  const [searching, setSearching] = useState(false)
  const [tab, setTab] = useState<"library" | "search">("library")
  const [searchType, setSearchType] = useState<"playlist" | "video">("playlist")
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set())
  const [savingId, setSavingId] = useState<string | null>(null)

  useEffect(() => {
    fetch("/api/youtube/saved").then(r => r.json()).then(data => {
      setSaved(data)
      setSavedIds(new Set(data.map((v: YoutubeItem) => v.playlistId || v.videoId)))
    })
  }, [])

  const search = async () => {
    if (!query.trim()) return
    setSearching(true)
    setTab("search")
    const res = await fetch(`/api/youtube/search?q=${encodeURIComponent(query)}&type=${searchType}`)
    const data = await res.json()
    setResults(data)
    setSearching(false)
  }

  const saveItem = async (item: YoutubeItem) => {
    const id = item.playlistId || item.videoId || ""
    setSavingId(id)
    const res = await fetch("/api/youtube/saved", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(item)
    })
    if (res.ok) {
      const created = await res.json()
      setSaved(prev => [created, ...prev])
      setSavedIds(prev => new Set([...prev, id]))
    }
    setSavingId(null)
  }

  const deleteItem = async (_id: string, id: string) => {
    await fetch(`/api/youtube/saved/${_id}`, { method: "DELETE" })
    setSaved(prev => prev.filter(v => v._id !== _id))
    setSavedIds(prev => { const s = new Set(prev); s.delete(id); return s })
  }

  const formatViews = (count: string) => {
    const n = parseInt(count)
    if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M views`
    if (n >= 1000) return `${(n / 1000).toFixed(0)}K views`
    return `${n} views`
  }

  const isSaved = (item: YoutubeItem) => savedIds.has(item.playlistId || item.videoId || "")

  const ItemCard = ({ item, inLibrary }: { item: YoutubeItem, inLibrary: boolean }) => {
    const saved = isSaved(item)
    const itemId = item.playlistId || item.videoId || ""
    const isSaving = savingId === itemId

    return (
      <Card className="overflow-hidden flex flex-col transition-all duration-200 hover:shadow-md">
        <div className="relative">
          <img src={item.thumbnail} alt={item.title} className="w-full aspect-video object-cover" />
          {/* Saved badge overlay */}
          {saved && !inLibrary && (
            <div className="absolute top-2 right-2 bg-green-500 text-white text-xs font-medium px-2 py-0.5 rounded-full flex items-center gap-1">
              <BookmarkCheck className="h-3 w-3" /> Saved
            </div>
          )}
        </div>

        <CardContent className="p-3 flex flex-col flex-1 space-y-2">
          <p className="text-sm font-medium text-foreground line-clamp-2 flex-1">{item.title}</p>
          <p className="text-xs text-muted-foreground">{item.channel}</p>

          {item.type === "playlist" && item.videoCount !== undefined && (
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <List className="h-3 w-3" /> {item.videoCount} videos
            </p>
          )}
          {item.type === "video" && item.viewCount && (
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <Eye className="h-3 w-3" /> {formatViews(item.viewCount)}
            </p>
          )}

          <div className="flex gap-2 pt-1">
            <a href={item.url} target="_blank" rel="noopener noreferrer" className="flex-1 cursor-pointer">
              <Button size="sm" variant="outline" className="w-full h-8 text-xs cursor-pointer">
                <Play className="h-3 w-3 mr-1" /> View
              </Button>
            </a>

            {inLibrary ? (
              <Button
                size="sm"
                variant="destructive"
                className="h-8 w-8 p-0 shrink-0 cursor-pointer"
                onClick={() => item._id && deleteItem(item._id, item.playlistId || item.videoId || "")}
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            ) : (
              <Button
                size="sm"
                className={`h-8 w-8 p-0 shrink-0 transition-all duration-200 cursor-pointer ${
                  saved
                    ? "bg-green-500 hover:bg-green-600 border-green-500 text-white"
                    : ""
                }`}
                onClick={() => !saved && saveItem(item)}
                disabled={saved || isSaving}
                title={saved ? "Already saved" : "Save to library"}
              >
                {saved ? (
                  <BookmarkCheck className="h-3 w-3" />
                ) : (
                  <Bookmark className="h-3 w-3" />
                )}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-foreground">YouTube</h2>
          <p className="mt-1 text-muted-foreground">Search and save educational playlists and videos.</p>
        </div>
        <Link href="/resources" className="text-sm text-primary hover:underline cursor-pointer">← Back</Link>
      </div>

      <div className="space-y-2">
        <div className="flex gap-2">
          <input
            type="text"
            placeholder={searchType === "playlist" ? "Search for a course or topic..." : "Search for a specific video..."}
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={e => e.key === "Enter" && search()}
            className="flex-1 border border-border rounded-lg px-4 py-2 text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring cursor-text"
          />
          <Button onClick={search} disabled={searching} className="cursor-pointer">
            <Search className="h-4 w-4 mr-2" />
            {searching ? "Searching..." : "Search"}
          </Button>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setSearchType("playlist")}
            className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border transition-colors cursor-pointer ${searchType === "playlist" ? "bg-blue-600 text-white border-blue-600" : "border-border text-muted-foreground hover:bg-muted"}`}
          >
            <List className="h-3 w-3" /> Playlists
          </button>
          <button
            onClick={() => setSearchType("video")}
            className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border transition-colors cursor-pointer ${searchType === "video" ? "bg-red-600 text-white border-red-600" : "border-border text-muted-foreground hover:bg-muted"}`}
          >
            <Video className="h-3 w-3" /> Videos
          </button>
        </div>
      </div>

      <div className="flex gap-4 border-b border-border">
        <button
          onClick={() => setTab("library")}
          className={`pb-2 px-1 text-sm font-medium border-b-2 transition-colors cursor-pointer ${tab === "library" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}
        >
          My Library ({saved.length})
        </button>
        <button
          onClick={() => setTab("search")}
          className={`pb-2 px-1 text-sm font-medium border-b-2 transition-colors cursor-pointer ${tab === "search" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}
        >
          Search Results ({results.length})
        </button>
      </div>

      {tab === "library" && (
        saved.length === 0 ? (
          <p className="text-center text-muted-foreground py-12">No saved items yet. Search and bookmark above!</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {saved.map(v => <ItemCard key={v._id} item={v} inLibrary={true} />)}
          </div>
        )
      )}

      {tab === "search" && (
        searching ? (
          <p className="text-center text-muted-foreground py-12">Searching...</p>
        ) : results.length === 0 ? (
          <p className="text-center text-muted-foreground py-12">Search for playlists or videos above.</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {results.map(v => (
              <ItemCard
                key={v.playlistId || v.videoId}
                item={v}
                inLibrary={false}
              />
            ))}
          </div>
        )
      )}
    </div>
  )
}
