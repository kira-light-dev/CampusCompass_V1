import { DashboardLayout } from "@/components/dashboard-layout"
import { RevisionChecklist } from "@/components/exam-prep/revision-checklist"
import { PreviousPapers } from "@/components/exam-prep/previous-papers"
import { ImportantTopics } from "@/components/exam-prep/important-topics"
import Link from "next/link"
import { Sparkles } from "lucide-react"

export default function ExamPrepPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-semibold text-foreground">Exam Preparation</h2>
          <p className="mt-1 text-muted-foreground">Stay organized with checklists, papers, and key topics.</p>
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          <RevisionChecklist />
          <PreviousPapers />
        </div>
        <ImportantTopics />

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Sparkles className="h-4 w-4 text-amber-400 shrink-0" />
          <span>
            Need notes, books or video playlists for your exam?{" "}
            <Link href="/resources" className="text-primary hover:underline cursor-pointer font-medium">
              Check out the Resources page →
            </Link>
          </span>
        </div>
      </div>
    </DashboardLayout>
  )
}