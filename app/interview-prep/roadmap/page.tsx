import { DashboardLayout } from "@/components/dashboard-layout"
import { InterviewRoadmap } from "@/components/interview-prep/interview-roadmap"
import { ChevronLeft } from "lucide-react"
import Link from "next/link"

export default function InterviewRoadmapPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <Link href="/interview-prep" className="flex items-center gap-1 text-sm text-primary hover:underline cursor-pointer w-fit">
          <ChevronLeft className="h-4 w-4" /> Back to Interview Prep
        </Link>

        <div>
          <h2 className="text-2xl font-semibold text-foreground">Interview Roadmap</h2>
          <p className="mt-1 text-muted-foreground">Get a company + role specific interview breakdown powered by AI.</p>
        </div>

        <InterviewRoadmap />
      </div>
    </DashboardLayout>
  )
}
