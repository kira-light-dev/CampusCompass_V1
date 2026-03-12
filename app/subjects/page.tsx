"use client"

import { useEffect, useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import SubjectCard from "@/components/subjects/subject-card"
import UploadSubjects from "@/components/subjects/upload-subjects"
import AddSubject from "@/components/subjects/add-subject"

interface Topic { _id: string; name: string; completed: boolean }
interface Subject { _id: string; name: string; topics: Topic[] }

export default function SubjectsPage() {
  const [subjects, setSubjects] = useState<Subject[]>([])

  const fetchSubjects = () => {
    fetch("/api/subjects")
      .then(r => r.json())
      .then(data => setSubjects(Array.isArray(data) ? data : []))
      .catch(() => setSubjects([]))
  }

  useEffect(() => { fetchSubjects() }, [])

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-semibold text-foreground">Subjects & Syllabus</h2>
          <p className="mt-1 text-muted-foreground">Track your progress and mark topics as you complete them.</p>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-4">Upload Subjects</h3>
          <UploadSubjects />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-4">Add Subject Manually</h3>
          <AddSubject />
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {subjects.map(subject => (
            <SubjectCard
              key={subject._id}
              subjectId={subject._id}
              name={subject.name}
              topics={subject.topics}
              onProgressChange={fetchSubjects}
            />
          ))}
        </div>
      </div>
    </DashboardLayout>
  )
}