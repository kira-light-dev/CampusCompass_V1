import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ExternalLink } from "lucide-react"

const dsaSheets = [
  {
    id: 1,
    name: "Striver's A2Z DSA Sheet",
    author: "Raj Vikramaditya",
    problems: 455,
    url: "https://takeuforward.org/strivers-a2z-dsa-course/strivers-a2z-dsa-course-sheet-2/",
    tag: "Most Popular",
    tagColor: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
    description: "Complete DSA from scratch to advanced",
  },
  {
    id: 2,
    name: "Striver's SDE Sheet",
    author: "Raj Vikramaditya",
    problems: 191,
    url: "https://takeuforward.org/interviews/strivers-sde-sheet-top-coding-interview-problems/",
    tag: "Interview Focused",
    tagColor: "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300",
    description: "Top coding interview problems",
  },
  {
    id: 3,
    name: "Love Babbar DSA Sheet",
    author: "Love Babbar",
    problems: 450,
    url: "https://450dsa.com/",
    tag: "450 Problems",
    tagColor: "bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300",
    description: "The famous 450 DSA questions",
  },
  {
    id: 4,
    name: "NeetCode 150",
    author: "NeetCode",
    problems: 150,
    url: "https://neetcode.io/practice",
    tag: "FAANG Prep",
    tagColor: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
    description: "Best questions for FAANG interviews",
  },
  {
    id: 5,
    name: "Blind 75",
    author: "yangshun",
    problems: 75,
    url: "https://leetcode.com/discuss/general-discussion/460599/blind-75-leetcode-questions",
    tag: "Essential",
    tagColor: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300",
    description: "Must-do 75 LeetCode questions",
  },
  {
    id: 6,
    name: "Apna College DSA Sheet",
    author: "Apna College",
    problems: 377,
    url: "https://docs.google.com/spreadsheets/d/1hXserPuxVoWMG9Hs7y8wVdRCJTcj3xMBAEYUOXQ5Xag",
    tag: "Beginner Friendly",
    tagColor: "bg-teal-100 text-teal-700 dark:bg-teal-900 dark:text-teal-300",
    description: "Great for beginners and college students",
  },
]

export function DsaPractice() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Famous DSA Sheets</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {dsaSheets.map(sheet => (
          <a
            key={sheet.id}
            href={sheet.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between rounded-lg border border-border p-3 transition-colors hover:bg-muted cursor-pointer group"
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="text-sm font-medium text-foreground">{sheet.name}</p>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${sheet.tagColor}`}>
                  {sheet.tag}
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                by {sheet.author} • {sheet.description} • {sheet.problems} problems
              </p>
            </div>
            <ExternalLink className="h-4 w-4 text-muted-foreground shrink-0 ml-2 group-hover:text-foreground transition-colors" />
          </a>
        ))}
      </CardContent>
    </Card>
  )
}