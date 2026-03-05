# External Integrations

**Analysis Date:** 2025-02-14

## APIs & External Services

**Search API:**
- Brave Search - Used for real-time web search capabilities in agents.
  - SDK/Client: Native `fetch` API.
  - Auth: `BRAVE_API_KEY` environment variable.

## Data Storage

**Databases:**
- Not detected.

**File Storage:**
- Local filesystem for all planning data.
- Structure: `.planning/` directory contains `config.json`, `ROADMAP.md`, `phases/`, `milestones/`, and `state.md`.

**Caching:**
- Local caching of file hashes for local patch persistence in `bin/install.js`.

## Authentication & Identity

**Auth Provider:**
- Not detected.

## Monitoring & Observability

**Error Tracking:**
- Basic error logging via `stderr` and `process.exit(1)` in `get-shit-done/bin/lib/core.cjs`.

**Logs:**
- Standard output and error streams.

## CI/CD & Deployment

**Hosting:**
- Not applicable.

**CI Pipeline:**
- GitHub Actions - `.github/workflows/test.yml` runs tests and checks coverage on pull requests.

## Environment Configuration

**Required env vars:**
- `BRAVE_API_KEY` (Optional) - For web search features.
- `CLAUDE_CONFIG_DIR`, `GEMINI_CONFIG_DIR`, `OPENCODE_CONFIG_DIR`, `CODEX_HOME` - Overrides for agent config directories.

**Secrets location:**
- Not applicable. Handled by host agent runtime (Claude Code, etc.).

## Webhooks & Callbacks

**Incoming:**
- Not detected.

**Outgoing:**
- Brave Search API calls (`https://api.search.brave.com/res/v1/web/search`).

## Runtime Integrations (Host AI Agents)

**Claude Code:**
- Integration: `~/.claude/commands/gsd/` (commands), `~/.claude/settings.json` (hooks).
- Model Profiles: Claude Opus, Sonnet, Haiku.

**Gemini CLI:**
- Integration: `~/.gemini/commands/gsd/` (commands), `~/.gemini/settings.json` (hooks), experimental agent support.
- Config: `GEMINI_API_KEY` determines hook event naming (`AfterTool` vs. `PostToolUse`).

**OpenCode:**
- Integration: `~/.config/opencode/command/` (flattened commands), `opencode.json` (permissions).
- Auth: Handled via OpenCode's own configuration.

**Codex:**
- Integration: `~/.codex/skills/` (skills), `config.toml` (agent roles).

---

*Integration audit: 2025-02-14*
