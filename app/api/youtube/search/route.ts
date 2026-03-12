import { NextResponse } from "next/server"

const YOUTUBE_API = "https://www.googleapis.com/youtube/v3"
const KEY = process.env.YOUTUBE_API_KEY

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const query = searchParams.get("q")
  const type = searchParams.get("type") || "playlist"

  if (!query) return NextResponse.json({ error: "No query" }, { status: 400 })

  const enhancedQuery = type === "playlist"
    ? `${query} full course lecture playlist`
    : `${query} lecture tutorial`

  if (type === "playlist") {
  const searchRes = await fetch(
    `${YOUTUBE_API}/search?part=snippet&q=${encodeURIComponent(enhancedQuery)}&type=playlist&maxResults=50&relevanceLanguage=en&key=${KEY}`
  )
  const searchData = await searchRes.json()

  if (!searchData.items) return NextResponse.json([])

  const playlistIds = searchData.items.map((i: any) => i.id.playlistId).join(",")
  
  const detailsRes = await fetch(
    `${YOUTUBE_API}/playlists?part=contentDetails&id=${playlistIds}&key=${KEY}`
  )
  const detailsData = await detailsRes.json()

  // Build map by ID
  const detailsMap: Record<string, number> = {}
  detailsData.items?.forEach((item: any) => {
    detailsMap[item.id] = item.contentDetails?.itemCount ?? 0
  })

  // Log to debug
  console.log("detailsMap:", detailsMap)

  const playlists = searchData.items.map((item: any) => {
    const pid = item.id.playlistId
    return {
      playlistId: pid,
      title: item.snippet.title,
      channel: item.snippet.channelTitle,
      thumbnail: item.snippet.thumbnails.medium?.url || "",
      videoCount: detailsMap[pid] ?? "?",  // "?" shows if lookup failed
      url: `https://www.youtube.com/playlist?list=${pid}`,
      type: "playlist"
    }
  })

  return NextResponse.json(playlists)

  } else {
    const searchRes = await fetch(
      `${YOUTUBE_API}/search?part=snippet&q=${encodeURIComponent(enhancedQuery)}&type=video&order=viewCount&maxResults=50&relevanceLanguage=en&key=${KEY}`
    )
    const searchData = await searchRes.json()

    if (!searchData.items) return NextResponse.json([])

    const videoIds = searchData.items.map((i: any) => i.id.videoId).join(",")
    const statsRes = await fetch(
      `${YOUTUBE_API}/videos?part=statistics&id=${videoIds}&key=${KEY}`
    )
    const statsData = await statsRes.json()

    const videos = searchData.items.map((item: any, index: number) => ({
      videoId: item.id.videoId,
      title: item.snippet.title,
      channel: item.snippet.channelTitle,
      thumbnail: item.snippet.thumbnails.medium?.url || "",
      viewCount: statsData.items?.[index]?.statistics?.viewCount || "0",
      url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
      type: "video"
    }))

    return NextResponse.json(videos)
  }
}