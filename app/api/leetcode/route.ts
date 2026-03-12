import { NextResponse } from "next/server"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const username = searchParams.get("username")

  if (!username?.trim()) {
    return NextResponse.json({ message: "Username required" }, { status: 400 })
  }

  try {
    const res = await fetch("https://leetcode.com/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Referer": "https://leetcode.com",
      },
      body: JSON.stringify({
        query: `
          query getUserProfile($username: String!) {
            matchedUser(username: $username) {
              username
              profile { ranking }
              submitStatsGlobal {
                acSubmissionNum {
                  difficulty
                  count
                }
              }
            }
            allQuestionsCount {
              difficulty
              count
            }
          }
        `,
        variables: { username },
      }),
    })

    const json = await res.json()
    const user = json?.data?.matchedUser

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 })
    }

    const submissions = user.submitStatsGlobal.acSubmissionNum
    const allQ = json.data.allQuestionsCount
    const get = (arr: any[], difficulty: string) =>
      arr.find((x: any) => x.difficulty === difficulty)?.count ?? 0

    return NextResponse.json({
      username: user.username,
      ranking: user.profile.ranking,
      totalSolved: get(submissions, "All"),
      easySolved: get(submissions, "Easy"),
      mediumSolved: get(submissions, "Medium"),
      hardSolved: get(submissions, "Hard"),
      totalQuestions: get(allQ, "All"),
      totalEasy: get(allQ, "Easy"),
      totalMedium: get(allQ, "Medium"),
      totalHard: get(allQ, "Hard"),
    })
  } catch (error) {
    return NextResponse.json({ message: "Failed to fetch" }, { status: 500 })
  }
}