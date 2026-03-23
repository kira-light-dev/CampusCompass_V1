import { NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import Subject from "@/databases/subjects.model"
import * as XLSX from "xlsx"

const GROQ_API_KEY = process.env.GROQ_API_KEY ?? ""

async function extractWithGroq(text: string): Promise<string> {
  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${GROQ_API_KEY}`
    },
    body: JSON.stringify({
      model: "llama-3.3-70b-versatile",
      max_tokens: 8000,
      messages: [{
        role: "user",
        content: `You are a syllabus parser. Extract all subjects and their topics from this content.
Return ONLY a valid JSON array, no explanation, no markdown, no code blocks:
[
  {
    "name": "Subject Name",
    "topics": [
      { "name": "Topic Name", "completed": false }
    ]
  }
]
Rules:
- Group all topics under their correct subject
- Each topic should be a specific concept, chapter or unit
- Ignore page numbers, credits, codes
- Be thorough and extract everything

Content:
${text.substring(0, 15000)}`
      }]
    })
  })
  const data = await res.json()
  if (data.error) throw new Error(data.error.message)
  return data.choices?.[0]?.message?.content ?? ""
}

function parseSubjectsFromJSON(text: string) {
  const match = text.match(/\[[\s\S]*\]/)
  if (!match) throw new Error("No JSON found in response")
  const parsed = JSON.parse(match[0])
  const raw = Array.isArray(parsed) ? parsed : []

  // Ensure topics are always { name: string, completed: boolean }
  return raw.map((s: any) => ({
    name: s.name,
    topics: (s.topics || []).map((t: any) => ({
      name: typeof t === "string" ? t : t.name,
      completed: false
    }))
  }))
}

async function extractTextFromPDF(buffer: Buffer): Promise<string> {
  const { extractText } = await import("unpdf")
  const { text } = await extractText(new Uint8Array(buffer))
  return text.join("\n")
}

export async function POST(req: Request) {
  try {
    await connectDB()
    const formData = await req.formData()
    const file = formData.get("file") as File

    if (!file) return NextResponse.json({ message: "No file provided" }, { status: 400 })

    const fileName = file.name.toLowerCase()
    const buffer = Buffer.from(await file.arrayBuffer())
    let subjects: any[] = []

    // CSV / Excel
    if (fileName.endsWith(".csv") || fileName.endsWith(".xlsx") || fileName.endsWith(".xls")) {
      const workbook = XLSX.read(buffer)
      const sheet = workbook.Sheets[workbook.SheetNames[0]]
      const rows = XLSX.utils.sheet_to_json(sheet) as any[]

      if (rows.length > 0 && (rows[0] as any).Subject) {
        const map: any = {}
        rows.forEach((row: any) => {
          if (!map[row.Subject]) map[row.Subject] = { name: row.Subject, topics: [] }
          if (row.Topic) map[row.Subject].topics.push({ name: row.Topic, completed: false })
        })
        subjects = Object.values(map)
      } else {
        const text = XLSX.utils.sheet_to_csv(sheet)
        const aiText = await extractWithGroq(text)
        subjects = parseSubjectsFromJSON(aiText)
      }
    }

    // PDF
    else if (fileName.endsWith(".pdf")) {
      const text = await extractTextFromPDF(buffer)
      if (!text.trim()) return NextResponse.json({ message: "Could not read PDF text. Make sure it is not a scanned image-only PDF." }, { status: 400 })
      const aiText = await extractWithGroq(text)
      subjects = parseSubjectsFromJSON(aiText)
    }

    // Images — extract text using tesseract
    else if (fileName.endsWith(".png") || fileName.endsWith(".jpg") || fileName.endsWith(".jpeg") || fileName.endsWith(".webp")) {
      const Tesseract = await import("tesseract.js")
      const { data: { text } } = await Tesseract.recognize(buffer, "eng")
      if (!text.trim()) return NextResponse.json({ message: "Could not read text from image." }, { status: 400 })
      const aiText = await extractWithGroq(text)
      subjects = parseSubjectsFromJSON(aiText)
    }

    // Word
    else if (fileName.endsWith(".docx") || fileName.endsWith(".doc")) {
      const mammoth = await import("mammoth")
      const result = await mammoth.extractRawText({ buffer })
      const aiText = await extractWithGroq(result.value)
      subjects = parseSubjectsFromJSON(aiText)
    }

    else {
      return NextResponse.json({ message: "Unsupported file type. Use PDF, image, Excel, CSV, or Word." }, { status: 400 })
    }

    if (!subjects || subjects.length === 0) {
      return NextResponse.json({ message: "Could not extract any subjects. Make sure the file contains syllabus content." }, { status: 400 })
    }

    await Subject.deleteMany({})
    await Subject.insertMany(subjects)

    return NextResponse.json({ message: "Subjects uploaded successfully", count: subjects.length })
  } catch (error: any) {
    console.error("Upload error:", error)
    const msg = error?.message?.includes("GROQ_API_KEY") || error?.message?.includes("Invalid API")
      ? "Invalid Groq API key. Check your GROQ_API_KEY in .env.local"
      : error?.message?.includes("rate_limit")
      ? "Groq rate limit hit. Please wait a moment and try again."
      : "Failed to process file. Please try again."
    return NextResponse.json({ message: msg }, { status: 500 })
  }
}