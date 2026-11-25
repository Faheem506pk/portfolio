"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { Postbox } from "@/components/admin/dashboard-widgets"
import { Donut, ViewsArea } from "@/components/admin/charts"

const DAYS = 30

function aggregate(rows) {
  const start = new Date()
  start.setHours(0, 0, 0, 0)
  start.setDate(start.getDate() - (DAYS - 1))
  const perDay = new Map()
  for (let i = 0; i < DAYS; i++) {
    const d = new Date(start)
    d.setDate(start.getDate() + i)
    perDay.set(d.toDateString(), { label: d.toLocaleDateString("en-GB", { day: "numeric", month: "short" }), count: 0 })
  }
  const devices = {}
  const posts = {}
  const referrers = {}
  rows.forEach((r) => {
    const bucket = perDay.get(new Date(r.created_at).toDateString())
    if (bucket) bucket.count += 1
    const device = r.device || "unknown"
    devices[device] = (devices[device] || 0) + 1
    posts[r.slug] = (posts[r.slug] || 0) + 1
    if (r.referrer_host) referrers[r.referrer_host] = (referrers[r.referrer_host] || 0) + 1
  })
  const top = (obj, n) =>
    Object.entries(obj)
      .sort((a, b) => b[1] - a[1])
      .slice(0, n)
      .map(([name, value]) => ({ name, value }))
  return { series: [...perDay.values()], total: rows.length, devices: top(devices, 4), posts: top(posts, 5), referrers: top(referrers, 5) }
}

// Real reader data from your own analytics table. Nothing is estimated or filled in.
export function ReadershipBox() {
  const [state, setState] = useState({ status: "loading" })

  useEffect(() => {
    let alive = true
    const since = new Date()
    since.setDate(since.getDate() - DAYS)
    supabase
      .from("post_views")
      .select("slug, created_at, device, referrer_host")
      .gte("created_at", since.toISOString())
      .order("created_at", { ascending: false })
      .limit(10000)
      .then(({ data, error }) => {
        if (!alive) return
        if (error) return setState({ status: "missing" })
        setState({ status: "ready", ...aggregate(data || []) })
      })
    return () => {
      alive = false
    }
  }, [])

  return (
    <Postbox title="Readers, last 30 days" action={state.status === "ready" ? <span className="muted text-muted-foreground">{state.total} views</span> : null}>
      {state.status === "loading" && <p className="muted text-muted-foreground">Loading</p>}
      {state.status === "missing" && <p className="muted text-muted-foreground">Analytics are not enabled yet. Apply migration 0002 to start counting readers.</p>}
      {state.status === "ready" && state.total === 0 && <p className="wp-empty">No reads recorded in the last 30 days. Publish a post on your blog and visits will appear here.</p>}
      {state.status === "ready" && state.total > 0 && (
        <div className="wp-split">
          <div className="wp-chart" role="img" aria-label={`Views per day over the last 30 days, ${state.total} in total`}>
            <ViewsArea data={state.series} />
          </div>
          <div className="wp-split-side">
            <div>
              <h3 className="wp-mini-title">Top posts</h3>
              <ol className="wp-rank">
                {state.posts.map((p) => (
                  <li key={p.name}>
                    <span className="truncate">{p.name}</span>
                    <span className="tabular-nums muted">{p.value}</span>
                  </li>
                ))}
              </ol>
            </div>
            <div className="wp-donut-row">
              <div className="wp-donut" role="img" aria-label="Views by device">
                <Donut data={state.devices} />
              </div>
              <ul className="wp-rank">
                {state.devices.map((d) => (
                  <li key={d.name}>
                    <span className="capitalize">{d.name}</span>
                    <span className="tabular-nums muted">{d.value}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </Postbox>
  )
}

// Google Analytics 4 numbers, read through the server route. Shows a setup hint until credentials exist.
export function GoogleAnalyticsBox() {
  const [state, setState] = useState({ status: "loading" })

  useEffect(() => {
    let alive = true
    fetch("/api/admin/analytics", { cache: "no-store" })
      .then((r) => r.json())
      .then((data) => alive && setState(data))
      .catch(() => alive && setState({ status: "error" }))
    return () => {
      alive = false
    }
  }, [])

  const hint = {
    not_configured: "Google Analytics is not connected yet. Add the service account settings described in docs/google-analytics-setup.md and redeploy.",
    no_access: "Google Analytics refused access. Add the service account email as a Viewer on the property.",
    error: "Google Analytics could not be reached. Try again in a minute.",
    unauthorized: "Sign in again to see Google Analytics.",
  }[state.status]

  return (
    <Postbox title="Google Analytics, last 30 days" action={<span className="muted text-muted-foreground">Source: GA4, can lag by hours</span>}>
      {state.status === "loading" && <p className="muted text-muted-foreground">Loading</p>}
      {hint && <p className="muted text-muted-foreground">{hint}</p>}
      {state.status === "ready" && (
        <div className="space-y-3">
          <p className="flex flex-wrap gap-x-4 gap-y-1">
            <span>
              <strong className="tabular-nums">{state.users}</strong> <span className="muted text-muted-foreground">active users (sum of days)</span>
            </span>
            <span>
              <strong className="tabular-nums">{state.sessions}</strong> <span className="muted text-muted-foreground">sessions</span>
            </span>
            <span>
              <strong className="tabular-nums">{state.views}</strong> <span className="muted text-muted-foreground">page views</span>
            </span>
          </p>
          <div className="wp-split">
            <div className="wp-chart" role="img" aria-label={`Active users per day over the last 30 days`}>
              <ViewsArea data={state.series} unit="users" />
            </div>
            <div className="wp-split-side">
              <div>
                <h3 className="wp-mini-title">Top pages</h3>
                <ol className="wp-rank">
                  {state.pages.map((p) => (
                    <li key={p.name}>
                      <span className="truncate">{p.name}</span>
                      <span className="tabular-nums muted">{p.value}</span>
                    </li>
                  ))}
                </ol>
              </div>
              <div>
                <h3 className="wp-mini-title">Countries</h3>
                <ol className="wp-rank">
                  {state.countries.map((c) => (
                    <li key={c.name}>
                      <span className="truncate">{c.name}</span>
                      <span className="tabular-nums muted">{c.value}</span>
                    </li>
                  ))}
                </ol>
              </div>
              <div className="wp-donut-row">
                <div className="wp-donut" role="img" aria-label="Users by device">
                  <Donut data={state.devices} unit="users" />
                </div>
                <ul className="wp-rank">
                  {state.devices.map((d) => (
                    <li key={d.name}>
                      <span className="capitalize">{d.name}</span>
                      <span className="tabular-nums muted">{d.value}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </Postbox>
  )
}
