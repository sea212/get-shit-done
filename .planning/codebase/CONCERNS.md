# Codebase Concerns

**Analysis Date: 2026-03-05**

## Tech Debt

**Core Logic Bloat:**
- Issue: Core logic files like `phase.cjs` and `verify.cjs` are becoming monolithic.
- Files: `get-shit-done/bin/lib/phase.cjs`, `get-shit-done/bin/lib/verify.cjs`
- Impact: Increased complexity and maintenance burden.
- Fix approach: Modularize parsing and command logic.

**Manual Git Escaping:**
- Issue: `execGit` manually escapes arguments for shell execution.
- Files: `get-shit-done/bin/lib/core.cjs`
- Impact: Potential for shell injection or argument misinterpretation.
- Fix approach: Use `spawnSync` without a shell.

## Security Considerations

**Shell Injection:**
- Risk: Improperly sanitized inputs passed to `execSync` through `execGit`.
- Files: `get-shit-done/bin/lib/core.cjs`
- Current mitigation: Regex-based sanitization.
- Recommendations: Migrate to non-shell command execution.

## Performance Bottlenecks

**Markdown Parsing:**
- Problem: Re-parsing entire Markdown files with multiple regex passes.
- Files: `get-shit-done/bin/lib/state.cjs`, `get-shit-done/bin/lib/roadmap.cjs`
- Cause: Lack of a structured data store or AST-based parser.
- Improvement path: Use a Markdown AST parser or cache state.

## Fragile Areas

**Regex State Management:**
- Files: `get-shit-done/bin/lib/state.cjs`
- Why fragile: Sensitive to minor formatting changes in `STATE.md`.
- Safe modification: Standardize format or use a more robust parser.

## Test Coverage Gaps

**Real Git Integration:**
- What's not tested: Real-world git side effects (conflicts, locks).
- Files: `get-shit-done/bin/lib/commands.cjs`
- Priority: Medium
