import { CheckCircle2, CircleDashed, FileClock } from "lucide-react"
import { Badge } from "@/components/ui/badge"

// Single place that decides how Medium publish state looks everywhere in the admin.
export function MediumStatusBadge({ status = "not_on_medium", className = "" }) {
  if (status === "published_on_medium") {
    return (
      <Badge className={`gap-1 bg-primary/10 text-primary hover:bg-primary/10 ${className}`}>
        <CheckCircle2 />
        On Medium
      </Badge>
    )
  }
  if (status === "draft_on_medium") {
    return (
      <Badge variant="outline" className={`gap-1 ${className}`}>
        <FileClock />
        Draft on Medium
      </Badge>
    )
  }
  return (
    <Badge variant="outline" className={`gap-1 text-muted-foreground ${className}`}>
      <CircleDashed />
      Not on Medium
    </Badge>
  )
}
