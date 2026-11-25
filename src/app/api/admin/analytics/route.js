import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import { createServerClient } from "@supabase/ssr"
import { fetchOverview } from "@/lib/ga-data"

// Admin only: requires a signed-in Supabase session. Returns aggregate Google Analytics numbers, never raw rows.
export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !anon) return NextResponse.json({ status: "error" }, { status: 500 })

  const store = await cookies()
  const supabase = createServerClient(url, anon, { cookies: { getAll: () => store.getAll(), setAll: () => {} } })
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ status: "unauthorized" }, { status: 401 })

  const overview = await fetchOverview()
  return NextResponse.json(overview, { headers: { "Cache-Control": "private, max-age=300" } })
}
