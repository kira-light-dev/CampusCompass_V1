import { DashboardLayout } from "@/components/dashboard-layout"
import { NotesLibrary } from "@/components/resources/notes-library"

export default function NotesPage() {
  return (
    <DashboardLayout>
      <NotesLibrary />
    </DashboardLayout>
  )
}