# Keep the platform update pages current (STRICT)

Every change that people will notice, or that changes how something works, also updates
`src/lib/platformUpdates.ts` in the same piece of work. That file feeds the dev-only pages
(root app, under the `/platform` base):

| Page | Address | What goes in it |
|---|---|---|
| What's new | `/platform/whats-new` | `WHATS_NEW`: what changed, in plain words. A `headsUp` list for anything that behaves differently for people, old apps or the mobile app, and for deploy steps. |
| Releases | `/platform/release` | `RELEASES`: ticket, date, short list of changes, and where it is (`local`, `github`, `staging`, `live`). Move it along as it ships. |
| Status | `/platform/status` | `STATUS`: each feature with `working`, `in_progress`, `needs_action` or `not_started`, where it is, and a one-line note. |
| Health | `/platform/health` | Live checks; update `src/pages/platform/PlatformHealth.tsx` and `supabase/functions/api-v1/routes/health.ts` when a new service or API needs watching. |

Rules:
- Plain words for owners, managers and resellers; no file paths or code names in the text.
- Only write what was checked. Say "on a developer's computer" until it is pushed, "on GitHub" until it is deployed.
- A change that breaks or changes behaviour for existing apps (old terminal apps, the mobile app) or people's access always gets a `headsUp` line and is also told to the user in the chat.
- No em dashes.

The pages are visible only in dev mode (`src/lib/devMode.ts`: development build or localhost) to owner, manager, reseller and super admin roles.

Mirrored: root `CLAUDE.md` §4 rule 14, `AGENTS.md` hard rule 27.
