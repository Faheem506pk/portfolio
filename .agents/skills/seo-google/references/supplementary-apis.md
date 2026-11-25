# Supplementary Google APIs for SEO

## Knowledge Graph Search API

Verify brand, organization, or entity presence in Google's Knowledge Graph.

**Endpoint:** `GET https://kgsearch.googleapis.com/v1/entities:search`

| Param | Type | Description |
|-------|------|-------------|
| `query` | string | The name of the entity to search for. |
| `types` | string[] | Limits results to entities of these types (e.g. `Person`, `Organization`). |
| `limit` | int | Max number of entities to return (default: 10). |
| `key` | string | API key. |

### Response
Returns entity information including Knowledge Graph ID (`@id` or machine-readable ID format like `kg:/m/02mjmr`), detailed description, and image URL if available.

---

## YouTube Data API v3

Audit video content performance and metadata alignment.

**Endpoint:** `GET https://www.googleapis.com/youtube/v3/videos`

| Param | Type | Description |
|-------|------|-------------|
| `part` | string | Parts to retrieve (e.g., `snippet`, `statistics`, `contentDetails`). |
| `id` | string | Comma-separated list of YouTube Video IDs. |
| `key` | string | API key. |

---

## Web Risk API

Verify page safety (detect phishing, malware, and social engineering warnings).

**Endpoint:** `GET https://webrisk.googleapis.com/v1/uris:search`
Used to cross-check domains before external link inclusion to protect search index trust factors.
