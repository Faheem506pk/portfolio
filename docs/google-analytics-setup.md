# Google Analytics 4 in the admin dashboard

The dashboard box "Google Analytics, last 30 days" reads your GA4 property through the Google Analytics Data API (read-only). It shows users, sessions, page views, top pages, countries and devices. Until credentials exist, the box says it is not connected.

Property: `488016697` (from your GA link).

## One-time setup

1. **Enable the API.** In Google Cloud (any project you own), enable **Google Analytics Data API**.
2. **Create a service account.** IAM and Admin, Service Accounts, Create. No roles are needed on the Cloud project.
3. **Create a JSON key** for it (Keys, Add key, JSON). Keep the file private and never commit it.
4. **Give it read access in GA.** Google Analytics, Admin, Property access management, add the service account email (ends in `.iam.gserviceaccount.com`) with the **Viewer** role only.
5. **Add environment variables in Vercel** (Production and Preview), then redeploy:
   - `GA_PROPERTY_ID` = `488016697`
   - `GA_SERVICE_ACCOUNT_JSON` = the whole JSON key file contents
   - or instead `GA_CLIENT_EMAIL` and `GA_PRIVATE_KEY` (keep the line breaks as `\n`)
6. Open `/mfiadmin`. The box fills in within a few minutes.

## Security

- Read-only scope (`analytics.readonly`) and a Viewer role: it cannot change anything in Analytics.
- The key lives only in Vercel environment variables. The browser never sees it; the route returns aggregate numbers only.
- The route requires a signed-in admin session (401 otherwise) and is cached privately for 5 minutes.
- To revoke access, remove the service account from GA property access, or delete the key.

## Notes

- GA reports lag by hours, and GA hides very small counts. "Active users" is the sum of daily active users, so it can exceed unique users.
- Your own table `post_views` (box "Readers, last 30 days") is exact for blog reads. Both boxes are shown and labeled by source.
