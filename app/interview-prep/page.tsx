import { DashboardLayout } from "@/components/dashboard-layout"
import { DsaPractice } from "@/components/interview-prep/dsa-practice"
import { CoreSubjects } from "@/components/interview-prep/core-subjects"
import { MockInterviews } from "@/components/interview-prep/mock-interviews"
import { ReadinessIndicator } from "@/components/interview-prep/readiness-indicator"
import { Code2, ChevronRight, Map } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"

export default function InterviewPrepPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-semibold text-foreground">Interview Preparation</h2>
          <p className="mt-1 text-muted-foreground">Practice DSA, review core subjects, and track your readiness.</p>
        </div>

        <ReadinessIndicator />

        {/* Interview Roadmap entry card */}
        <Link href="/interview-prep/roadmap" className="cursor-pointer block">
          <Card className="transition-all duration-200 hover:shadow-md hover:border-primary/50">
            <CardContent className="flex items-center justify-between p-5">
              <div className="flex items-center gap-4">
                <div className="rounded-lg bg-blue-500/10 p-3">
                  <Map className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Interview Roadmap</h3>
                  <p className="text-sm text-muted-foreground mt-0.5">Company + role specific interview breakdown</p>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </CardContent>
          </Card>
        </Link>

        {/* DSA Platforms entry card */}
        <Link href="/interview-prep/dsa" className="cursor-pointer block">
          <Card className="transition-all duration-200 hover:shadow-md hover:border-primary/50">
            <CardContent className="flex items-center justify-between p-5">
              <div className="flex items-center gap-4">
                <div className="rounded-lg bg-violet-500/10 p-3">
                  <Code2 className="h-6 w-6 text-violet-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">DSA Coding Platforms</h3>
                  <p className="text-sm text-muted-foreground mt-0.5">LeetCode, Codeforces, HackerRank and more</p>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </CardContent>
          </Card>
        </Link>

        <DsaPractice />

        <div className="grid gap-6 lg:grid-cols-2">
          <CoreSubjects />
          <MockInterviews />
        </div>
      </div>
    </DashboardLayout>
  )
}
