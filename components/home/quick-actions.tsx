import Link from "next/link"
import { BookOpen, GraduationCap, Briefcase } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

const actions = [
  {
    title: "View Syllabus",
    description: "Track your progress across all subjects",
    icon: BookOpen,
    href: "/subjects",
    color: "bg-blue-500/10 text-blue-600",
  },
  {
    title: "Start Exam Prep",
    description: "Revision checklists and important topics",
    icon: GraduationCap,
    href: "/exam-prep",
    color: "bg-emerald-500/10 text-emerald-600",
  },
  {
    title: "Prepare for Interviews",
    description: "DSA practice and mock interviews",
    icon: Briefcase,
    href: "/interview-prep",
    color: "bg-amber-500/10 text-amber-600",
  },
]

export function QuickActions() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {actions.map((action) => (
        <Link key={action.title} href={action.href}>
          <Card className="h-full transition-shadow hover:shadow-md">
            <CardContent className="flex items-start gap-4 p-5">
              <div className={`rounded-lg p-3 ${action.color}`}>
                <action.icon className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-semibold text-card-foreground">{action.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{action.description}</p>
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  )
}
