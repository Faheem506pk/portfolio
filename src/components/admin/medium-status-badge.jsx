// Single place that decides how Medium publish state looks everywhere in the admin.
export function MediumStatusBadge({ status = "not_on_medium", className = "" }) {
  const map = {
    published_on_medium: { tone: "success", label: "On Medium" },
    draft_on_medium: { tone: "warning", label: "Draft on Medium" },
    not_on_medium: { tone: "neutral", label: "Not on Medium" },
  }
  const { tone, label } = map[status] || map.not_on_medium
  return (
    <span className={`wp-chip ${className}`} data-tone={tone}>
      {label}
    </span>
  )
}
