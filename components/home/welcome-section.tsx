import { Compass } from "lucide-react"

export function WelcomeSection() {
  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <div className="flex items-start gap-4">
        <div className="rounded-lg bg-primary/10 p-3">
          <Compass className="h-8 w-8 text-primary" />
        </div>
        <div>
          <h2 className="text-2xl font-semibold text-foreground">Welcome to CampusCompass</h2>
          <p className="mt-2 text-muted-foreground">
            Your personal academic companion designed to help you navigate through college life with clarity and ease.
            Track your syllabus, prepare for exams, ace your interviews, and access curated resources — all in one
            place.
          </p>
        </div>
      </div>
    </div>
  )
}
