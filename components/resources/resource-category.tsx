import type React from "react"
import { ExternalLink, Youtube, FileText, BookOpen, Code } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface ResourceItem {
  id: number
  name: string
  url: string
  description: string
}

interface ResourceCategoryProps {
  category: string
  items: ResourceItem[]
}

const categoryIcons: Record<string, React.ElementType> = {
  YouTube: Youtube,
  Notes: FileText,
  Books: BookOpen,
  Practice: Code,
}

export function ResourceCategory({ category, items }: ResourceCategoryProps) {
  const Icon = categoryIcons[category] || FileText

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Icon className="h-5 w-5 text-primary" />
          {category}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {items.map((item) => (
          <a
            key={item.id}
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-start justify-between rounded-lg border border-border p-3 transition-colors hover:bg-muted"
          >
            <div>
              <p className="text-sm font-medium text-foreground">{item.name}</p>
              <p className="text-xs text-muted-foreground">{item.description}</p>
            </div>
            <ExternalLink className="h-4 w-4 shrink-0 text-muted-foreground" />
          </a>
        ))}
      </CardContent>
    </Card>
  )
}
