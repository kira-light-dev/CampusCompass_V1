import { DashboardLayout } from "@/components/dashboard-layout"
import { ExternalLink, ChevronLeft } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"

const platforms = [
  {
    name: "LeetCode",
    url: "https://leetcode.com",
    initial: "LC",
    description: "Most popular for FAANG interview prep",
    color: "bg-orange-500",
    tag: "Industry Standard",
    tagColor: "bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300",
    stats: "3500+ problems",
  },
  {
    name: "Codeforces",
    url: "https://codeforces.com",
    initial: "CF",
    description: "Best for competitive programming contests",
    color: "bg-blue-500",
    tag: "Competitive",
    tagColor: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
    stats: "8000+ problems",
  },
  {
    name: "CodeChef",
    url: "https://www.codechef.com",
    initial: "CC",
    description: "Monthly contests and learning tracks",
    color: "bg-amber-700",
    tag: "Contests",
    tagColor: "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300",
    stats: "Monthly contests",
  },
  {
    name: "HackerRank",
    url: "https://www.hackerrank.com",
    initial: "HR",
    description: "Great for beginners and skill certificates",
    color: "bg-green-600",
    tag: "Beginner Friendly",
    tagColor: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
    stats: "Skill certificates",
  },
  {
    name: "GeeksforGeeks",
    url: "https://www.geeksforgeeks.org",
    initial: "GFG",
    description: "DSA theory + practice problems",
    color: "bg-green-500",
    tag: "Learning + Practice",
    tagColor: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300",
    stats: "Articles + Problems",
  },
  {
    name: "AtCoder",
    url: "https://atcoder.jp",
    initial: "AC",
    description: "Excellent algorithm problems from Japan",
    color: "bg-gray-700",
    tag: "Advanced",
    tagColor: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
    stats: "High quality problems",
  },
  {
    name: "InterviewBit",
    url: "https://www.interviewbit.com",
    initial: "IB",
    description: "Structured interview preparation path",
    color: "bg-indigo-500",
    tag: "Interview Prep",
    tagColor: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300",
    stats: "Structured roadmap",
  },
  {
    name: "SPOJ",
    url: "https://www.spoj.com",
    initial: "SP",
    description: "Classic problems for CP enthusiasts",
    color: "bg-red-600",
    tag: "Classic CP",
    tagColor: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300",
    stats: "Classic problems",
  },
]

export default function DsaPlatformsPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <Link href="/interview-prep" className="flex items-center gap-1 text-sm text-primary hover:underline cursor-pointer w-fit">
          <ChevronLeft className="h-4 w-4" /> Back to Interview Prep
        </Link>

        <div>
          <h2 className="text-2xl font-semibold text-foreground">DSA Coding Platforms</h2>
          <p className="mt-1 text-muted-foreground">All the best platforms to practice DSA. Click any card to open.</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {platforms.map(platform => (
            <a key={platform.name} href={platform.url} target="_blank" rel="noopener noreferrer" className="cursor-pointer group">
              <Card className="h-full transition-all duration-200 hover:shadow-md hover:border-primary/50">
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`h-9 w-9 rounded-lg ${platform.color} flex items-center justify-center shrink-0`}>
                        <span className="text-white text-xs font-bold">{platform.initial}</span>
                      </div>
                      <p className="font-semibold text-foreground">{platform.name}</p>
                    </div>
                    <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
                  </div>
                  <p className="text-xs text-muted-foreground">{platform.description}</p>
                  <div className="flex items-center justify-between">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${platform.tagColor}`}>{platform.tag}</span>
                    <span className="text-xs text-muted-foreground">{platform.stats}</span>
                  </div>
                </CardContent>
              </Card>
            </a>
          ))}
        </div>
      </div>
    </DashboardLayout>
  )
}