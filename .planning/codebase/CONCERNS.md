# Codebase Concerns

**Analysis Date:** 2025-02-18

## Tech Debt

**Monolithic Utility Files:**
- Issue: Several utility files in the bin library are growing quite large and handling multiple distinct concerns.
  - `get-shit-done/bin/lib/phase.cjs` (871 lines)
  - `get-shit-done/bin/lib/verify.cjs` (773 lines)
  - `get-shit-done/bin/lib/init.cjs` (710 lines)
- Why: Organic growth as CLI features and workflows were sequentially added over time.
- Impact: Increased maintenance difficulty, higher risk of merge conflicts, and higher cognitive load when tracing bugs.
- Fix approach: Refactor these large library files into smaller, focused modules grouped by specific sub-commands rather than broad feature categories.

**CLI Dispatcher Monolith:**
- Issue: The main CLI tool entrypoint `get-shit-done/bin/gsd-tools.cjs` (588 lines) is a massive switch statement routing all CLI commands.
- Why: Centralized routing was simple to implement initially.
- Impact: Difficult to navigate and scale as more commands are added. High risk of breaking existing command resolution when modifying the switch statement.
- Fix approach: Implement a more dynamic, map-based command registry or separate routing definitions.

## Known Bugs

Not detected

## Security Considerations

Not detected

## Performance Bottlenecks

Not detected

## Fragile Areas

Not detected

## Scaling Limits

Not detected

## Dependencies at Risk

Not detected

## Missing Critical Features

Not detected

## Test Coverage Gaps

**Template Logic Verification:**
- What's not tested: The template selection and generation logic in `get-shit-done/bin/lib/template.cjs` has only ~5.4% test coverage, whereas the rest of the project is consistently above 90%.
- Risk: Future changes to template logic, frontmatter reconstruction, or CLI arguments might silently break template generation since it's practically untested.
- Priority: High
- Difficulty to test: Medium. It requires setting up file system mocks or integration fixtures to safely assert on template file creation without messing up the actual project directory.

---

*Concerns audit: 2025-02-18*
*Update as issues are fixed or new ones discovered*
