# External Integrations

**Analysis Date:** 2025-02-15

## APIs & External Services

**Search APIs:**
- Brave Search API - Web search functionality for AI agents (`cmdWebsearch`)
  - Integration method: REST API via `fetch()` (native Node.js)
  - Auth: `X-Subscription-Token` header using `BRAVE_API_KEY` env var or fallback to `~/.get-shit-done/brave_api_key`
  - Endpoints used: `https://api.search.brave.com/res/v1/web/search`

## Data Storage

**Databases:**
- None

**File Storage:**
- Local filesystem only
  - Operations rely heavily on `fs` module to manage `.planning/`, `.md` phase files, and project state.

**Caching:**
- None

## Authentication & Identity

**Auth Provider:**
- Custom / Local configuration files only
  - API keys read from user's `os.homedir()` (e.g., `~/.get-shit-done/brave_api_key`)
  - Agent config locations detected via environment variables (e.g., `CLAUDE_CONFIG_DIR`, `OPENCODE_CONFIG_DIR`, `GEMINI_CONFIG_DIR`, `CODEX_HOME`) or default paths (e.g., `~/.claude.json`)

## Monitoring & Observability

**Error Tracking:**
- None (stdout/stderr only via core output functions)

**Logs:**
- CLI console output, no external logging service.

## CI/CD & Deployment

**Hosting:**
- Distributed as open-source code/CLI package.

**CI Pipeline:**
- GitHub Actions - Testing and issue management
  - Workflows: `test.yml` (tests & coverage), `auto-label-issues.yml`
  - Environment: Node 18, 20, 22 test matrices.

## Environment Configuration

**Development:**
- Optional env vars: `BRAVE_API_KEY`
- Secrets location: Optional local `.env` or `~/.get-shit-done/brave_api_key` (gitignored).

**Production:**
- Installed locally on the user's system; relies on user's environment for keys and config paths.

## Webhooks & Callbacks

**Incoming:**
- None

**Outgoing:**
- None

---

*Integration audit: 2025-02-15*