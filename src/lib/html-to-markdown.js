// Small HTML to Markdown converter so a story copied from Medium (or any page) keeps its structure
// when pasted into the editor. Browser only (uses DOMParser).

function inline(node) {
  if (node.nodeType === 3) return node.textContent.replace(/\s+/g, " ")
  if (node.nodeType !== 1) return ""
  const tag = node.tagName.toLowerCase()
  const inner = () => Array.from(node.childNodes).map(inline).join("")
  switch (tag) {
    case "strong":
    case "b":
      return inner().trim() ? `**${inner().trim()}**` : ""
    case "em":
    case "i":
      return inner().trim() ? `_${inner().trim()}_` : ""
    case "code":
      return `\`${node.textContent}\``
    case "a": {
      const href = node.getAttribute("href") || ""
      const text = inner().trim()
      return href && text ? `[${text}](${href})` : text
    }
    case "img":
      return `![${node.getAttribute("alt") || ""}](${node.getAttribute("src") || ""})`
    case "br":
      return "\n"
    default:
      return inner()
  }
}

function block(node, out, depth = 0) {
  if (node.nodeType === 3) {
    const t = node.textContent.trim()
    if (t) out.push(t)
    return
  }
  if (node.nodeType !== 1) return
  const tag = node.tagName.toLowerCase()
  if (["script", "style", "meta", "link", "title"].includes(tag)) return
  const text = () => Array.from(node.childNodes).map(inline).join("").replace(/[ \t]+/g, " ").trim()

  if (/^h[1-6]$/.test(tag)) {
    // Medium uses a single H1 for the title, so push headings down: h1/h2 -> ##, h3+ -> ###
    const level = Number(tag[1]) <= 2 ? "##" : "###"
    if (text()) out.push(`${level} ${text()}`)
  } else if (tag === "p") {
    if (text()) out.push(text())
  } else if (tag === "blockquote") {
    if (text()) out.push(text().split("\n").map((l) => `> ${l}`).join("\n"))
  } else if (tag === "pre") {
    out.push("```\n" + node.textContent.replace(/\n+$/, "") + "\n```")
  } else if (tag === "ul" || tag === "ol") {
    const items = Array.from(node.children)
      .filter((c) => c.tagName.toLowerCase() === "li")
      .map((li, i) => `${"  ".repeat(depth)}${tag === "ol" ? `${i + 1}.` : "-"} ${Array.from(li.childNodes).map(inline).join("").replace(/\s+/g, " ").trim()}`)
    if (items.length) out.push(items.join("\n"))
  } else if (tag === "hr") {
    out.push("---")
  } else if (tag === "figure" || tag === "img") {
    const img = tag === "img" ? node : node.querySelector("img")
    if (img) out.push(`![${img.getAttribute("alt") || ""}](${img.getAttribute("src") || ""})`)
    const cap = node.querySelector && node.querySelector("figcaption")
    if (cap) out.push(`_${cap.textContent.trim()}_`)
  } else {
    Array.from(node.childNodes).forEach((c) => block(c, out, depth))
  }
}

export function htmlToMarkdown(html = "") {
  const doc = new DOMParser().parseFromString(html, "text/html")
  const out = []
  Array.from(doc.body.childNodes).forEach((n) => block(n, out))
  return out.join("\n\n").replace(/\n{3,}/g, "\n\n").trim()
}
