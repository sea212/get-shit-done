# External Integrations

**Analysis Date:** 2025-02-17

## APIs & External Services

**Search:**
- Brave Search - Used for web searching during research phases.
  - SDK/Client: Direct `fetch` to `https://api.search.brave.com/res/v1/web/search`.
  - Auth: `BRAVE_API_KEY` (env var) or `~/.gsd/brave_api_key` (local file).

**LLMs:**
- Anthropic Claude - The codebase is designed for models like Opus, Sonnet, and Haiku.
  - Integration: Indirect model selection through `MODEL_PROFILES` in `get-shit-done/bin/lib/core.cjs`.
  - Auth: Handled by the model caller (e.g., Claude Code, Gemini CLI).

## Data Storage

**Databases:**
- None - Project relies on the filesystem for data persistence.

**File Storage:**
- Local Filesystem Only - Uses `fs` to manage planning artifacts in `.planning/`.

**Caching:**
- None detected.

## Authentication & Identity

**Auth Provider:**
- Custom - CLI auth primarily through environment variables and local configuration files.

## Monitoring & Observability

**Error Tracking:**
- None - Standard Node.js error reporting via `process.stderr`.

**Logs:**
- Console Output - Detailed status messages and JSON output for sub-agent communication.

## CI/CD & Deployment

**Hosting:**
- Local Workspace - Designed to run on developer machines.

**CI Pipeline:**
- GitHub Actions - Workflow in `.github/workflows/test.yml` for testing and linting.

## Environment Configuration

**Required env vars:**
- `BRAVE_API_KEY` - Optional: Enables Brave Search integration.

**Secrets location:**
- Environment variables or local home directory (`~/.gsd/`).

## Webhooks & Callbacks

**Incoming:**
- None

**Outgoing:**
- None

## Git Integration

**Version Control:**
- Git CLI - Used for committing docs and managing phase/milestone branches.
  - Implementation: `execGit` function in `get-shit-done/bin/lib/core.cjs`.
  - Config: `branching_strategy`, `phase_branch_template`, etc., in `.planning/config.json`.

---

*Integration audit: 2025-02-17*
