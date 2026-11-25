import { handleMcpRequest } from "@/lib/mcp-drafts"

// Remote MCP endpoint: POST https://<your-site>/api/mcp with an Authorization: Bearer <token> header.
// All logic and security checks live in src/lib/mcp-drafts.js. Runs on Node (needs node:crypto).
export const runtime = "nodejs"
export const dynamic = "force-dynamic"
export const maxDuration = 30

export const POST = handleMcpRequest
export const GET = handleMcpRequest
export const DELETE = handleMcpRequest
export const OPTIONS = handleMcpRequest
