# Codebase Concerns

**Analysis Date:** 2025-05-15

## Tech Debt

**Monolithic Installer:**
- Issue: `bin/install.js` is over 2000 lines long, handling multiple runtimes (Claude, OpenCode, Gemini, Codex) and complex shell hook installations in a single file.
- Files: `bin/install.js`
- Impact: Difficult to maintain, test, and extend. High risk of regressions when adding support for new AI CLIs.
- Fix approach: Refactor into smaller modules based on runtime-specific logic and shared utility functions.

**Fragile Markdown Parsing:**
- Issue: Extensive use of complex Regular Expressions to parse and update Markdown files (`STATE.md`, `ROADMAP.md`).
- Files: `get-shit-done/bin/lib/state.cjs`, `get-shit-done/bin/lib/roadmap.cjs`, `get-shit-done/bin/lib/verify.cjs`
- Impact: Minor formatting changes by users or LLMs can break the state management and progression engine.
- Fix approach: Transition to a proper Markdown AST parser (like `unified` or `remark`) for more robust document manipulation.

**Sync Frontmatter Implementation:**
- Issue: State is dual-stored in YAML frontmatter and Markdown body, requiring a custom sync mechanism.
- Files: `get-shit-done/bin/lib/state.cjs`
- Impact: Potential for desynchronization if manual edits are made; complexity in maintaining the `writeStateMd` wrapper.
- Fix approach: Standardize on either Frontmatter or structured Markdown blocks, reducing the need for complex synchronization logic.

## Security Considerations

**Command Injection Risks:**
- Issue: Use of `execSync` with string concatenation for Git commands and file searches. While some sanitization exists, it remains a high-risk pattern.
- Files: `get-shit-done/bin/lib/core.cjs`, `get-shit-done/bin/lib/init.cjs`
- Current mitigation: Basic character replacement/escaping in `isGitIgnored` and `execGit`.
- Recommendations: Use the array-based signature of `spawnSync` or a dedicated library like `simple-git` to avoid shell interpolation entirely.

## Performance Bottlenecks

**Large Payload Handling:**
- Issue: Claude Code Bash tool has a ~50KB buffer limit. The system works around this by writing to temporary files.
- Files: `get-shit-done/bin/lib/core.cjs`
- Cause: JSON output for large codebase maps or project states can exceed terminal limits.
- Improvement path: Implement streaming or pagination for large data transfers between the CLI and the AI agent.

## Fragile Areas

**Phase Progression Engine:**
- Files: `get-shit-done/bin/lib/state.cjs`, `get-shit-done/bin/lib/phase.cjs`
- Why fragile: Relies on exact string matches for phase numbers (e.g., `12A.1`). The logic for comparing and advancing phases is complex.
- Safe modification: Ensure all changes are covered by the extensive test suite in `tests/phase.test.cjs`.
- Test coverage: Generally high, but corner cases in decimal phase numbering are complex.

## Test Coverage Gaps

**Installer Logic:**
- What's not tested: The actual shell hook installation and global/local config directory resolution in `bin/install.js`.
- Files: `bin/install.js`
- Risk: Installation may fail on certain OS/shell combinations (e.g., Zsh vs Bash on macOS).
- Priority: High

**Brave Search Integration:**
- What's not tested: The interaction with the Brave Search API and its configuration.
- Files: `get-shit-done/bin/lib/config.cjs`, `get-shit-done/bin/lib/init.cjs`
- Risk: Configuration detection might fail in different environments.
- Priority: Medium

---

*Concerns audit: 2025-05-15*
