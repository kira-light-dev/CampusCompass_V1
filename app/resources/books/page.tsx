import { DashboardLayout } from "@/components/dashboard-layout"
import { BooksLibrary } from "@/components/resources/books-library"

export default function BooksPage() {
  return (
    <DashboardLayout>
      <BooksLibrary />
    </DashboardLayout>
  )
}