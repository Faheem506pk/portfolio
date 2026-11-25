import crypto from "node:crypto"

// Read-only Google Analytics 4 reports for the admin dashboard, using the GA4 Data API over REST.
// Auth is a service account (JWT bearer). No third-party SDK, no write access, nothing sent to the browser
// except aggregate numbers. Fails closed: without credentials it reports "not_configured".

const TOKEN_URL = "https://oauth2.googleapis.com/token"
const SCOPE = "https://www.googleapis.com/auth/analytics.readonly"

let cached = { token: null, exp: 0 }

export function readCredentials(env = process.env) {
  const propertyId = (env.GA_PROPERTY_ID || "").replace(/^properties\//, "").trim()
  let email = env.GA_CLIENT_EMAIL
  let key = env.GA_PRIVATE_KEY
  if (env.GA_SERVICE_ACCOUNT_JSON) {
    try {
      const parsed = JSON.parse(env.GA_SERVICE_ACCOUNT_JSON)
      email = parsed.client_email
      key = parsed.private_key
    } catch {
      return null
    }
  }
  if (!propertyId || !/^\d+$/.test(propertyId) || !email || !key) return null
  return { propertyId, email, privateKey: key.replace(/\\n/g, "\n") }
}

const b64url = (input) => Buffer.from(input).toString("base64url")

export function signJwt({ email, privateKey }, now = Math.floor(Date.now() / 1000)) {
  const header = b64url(JSON.stringify({ alg: "RS256", typ: "JWT" }))
  const claims = b64url(JSON.stringify({ iss: email, scope: SCOPE, aud: TOKEN_URL, iat: now, exp: now + 3600 }))
  const signature = crypto.createSign("RSA-SHA256").update(`${header}.${claims}`).sign(privateKey, "base64url")
  return `${header}.${claims}.${signature}`
}

async function accessToken(creds) {
  const now = Date.now()
  if (cached.token && cached.exp > now + 60_000) return cached.token
  const res = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer", assertion: signJwt(creds) }),
    cache: "no-store",
  })
  if (!res.ok) throw new Error(`token ${res.status}`)
  const data = await res.json()
  cached = { token: data.access_token, exp: now + (data.expires_in || 3600) * 1000 }
  return cached.token
}

const rangeLast30 = [{ startDate: "29daysAgo", endDate: "today" }]

export function buildRequests() {
  return [
    { dateRanges: rangeLast30, dimensions: [{ name: "date" }], metrics: [{ name: "activeUsers" }, { name: "sessions" }, { name: "screenPageViews" }], orderBys: [{ dimension: { dimensionName: "date" } }] },
    { dateRanges: rangeLast30, dimensions: [{ name: "pagePath" }], metrics: [{ name: "screenPageViews" }], orderBys: [{ metric: { metricName: "screenPageViews" }, desc: true }], limit: 8 },
    { dateRanges: rangeLast30, dimensions: [{ name: "country" }], metrics: [{ name: "activeUsers" }], orderBys: [{ metric: { metricName: "activeUsers" }, desc: true }], limit: 6 },
    { dateRanges: rangeLast30, dimensions: [{ name: "deviceCategory" }], metrics: [{ name: "activeUsers" }], orderBys: [{ metric: { metricName: "activeUsers" }, desc: true }] },
  ]
}

const num = (v) => Number(v) || 0

// Turns the raw batchRunReports response into the small shape the dashboard needs.
export function summarize(response) {
  const [daily, pages, countries, devices] = response.reports || []
  const series = (daily?.rows || []).map((row) => {
    const raw = row.dimensionValues[0].value // YYYYMMDD
    const date = new Date(Number(raw.slice(0, 4)), Number(raw.slice(4, 6)) - 1, Number(raw.slice(6, 8)))
    return { label: date.toLocaleDateString("en-GB", { day: "numeric", month: "short" }), count: num(row.metricValues[0].value), sessions: num(row.metricValues[1].value), views: num(row.metricValues[2].value) }
  })
  const pair = (report) => (report?.rows || []).map((r) => ({ name: r.dimensionValues[0].value, value: num(r.metricValues[0].value) }))
  return {
    users: series.reduce((a, d) => a + d.count, 0), // sum of daily active users, an approximation of total users
    sessions: series.reduce((a, d) => a + d.sessions, 0),
    views: series.reduce((a, d) => a + d.views, 0),
    series,
    pages: pair(pages),
    countries: pair(countries),
    devices: pair(devices),
  }
}

export async function fetchOverview() {
  const creds = readCredentials()
  if (!creds) return { status: "not_configured" }
  try {
    const token = await accessToken(creds)
    const res = await fetch(`https://analyticsdata.googleapis.com/v1beta/properties/${creds.propertyId}:batchRunReports`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ requests: buildRequests() }),
      cache: "no-store",
    })
    if (res.status === 403 || res.status === 401) return { status: "no_access" }
    if (!res.ok) return { status: "error" }
    return { status: "ready", ...summarize(await res.json()) }
  } catch (error) {
    console.error("GA fetch failed:", error.message)
    return { status: "error" }
  }
}
