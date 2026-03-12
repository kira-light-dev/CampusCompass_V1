import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const { company, role } = await req.json()

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.GROQ_API_KEY ?? ""}`
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        max_tokens: 1500,
        messages: [{
          role: "user",
          content: `Give me a detailed interview roadmap for ${company} for the role of ${role}.

Return ONLY a JSON object with this exact structure, no explanation, no markdown:
{
  "company": "${company}",
  "role": "${role}",
  "overview": "2-3 sentence overview of how ${company} interviews for ${role}",
  "difficulty": "Easy|Medium|Hard|Very Hard",
  "rounds": [
    {
      "name": "Round name",
      "description": "What happens in this round",
      "topics": ["topic1", "topic2", "topic3"],
      "tip": "One specific tip for this round"
    }
  ],
  "keyTopics": ["topic1", "topic2", "topic3", "topic4", "topic5", "topic6"],
  "focusAreas": ["area1", "area2", "area3", "area4"]
}`
        }]
      })
    })

    const data = await response.json()
    const text = data.choices?.[0]?.message?.content ?? ""
    const clean = text.replace(/```json|```/g, "").trim()
    const parsed = JSON.parse(clean)
    return NextResponse.json(parsed)
  } catch (error) {
    return NextResponse.json({ message: "Failed to generate roadmap" }, { status: 500 })
  }
}
