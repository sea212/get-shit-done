# Roadmap

**2 phases** | **7 requirements mapped** | All v1 requirements covered ✓

| # | Phase | Goal | Requirements | Status |
|---|-------|------|--------------|--------|
| 1 | Environment Detection | Detect `gemini-cli` environment | ENV-01, ENV-02 | Complete ✓ |
| 2 | 2/2 | Complete    | 2026-03-01 | Gap Closure ⟳ |

### Phase Details

## Phase 1: Environment Detection
Goal: Detect `gemini-cli` environment
Requirements: ENV-01, ENV-02
Success criteria:
1. `gsd-tools.cjs` or equivalent core libraries expose a reliable `isGeminiEnvironment()` check.
2. The environment check correctly identifies when the tool is run by `gemini-cli`.

**Plans:** 1/1 plans complete

Plans:
- [x] 01-01-PLAN.md — Implement dynamic environment detection

## Phase 2: Model Resolution & Mapping
Goal: Map and resolve model profiles to Gemini variants
Requirements: MOD-01, MOD-02, MOD-03, PROF-01, PROF-02
Success criteria:
1. Orchestrators requesting `opus`, `sonnet`, or `haiku` receive the correct `gemini-*` equivalent when `isGeminiEnvironment()` is true.
2. `config.json` default profiles gracefully handle the mapped names.
3. Unit/Integration tests for `model-profile-resolution` pass with the new mapping logic.

**Plans:** 2/2 plans complete

Plans:
- [x] 02-01-PLAN.md — Implement dynamic model mapping
- [ ] 02-02-PLAN.md — Fix model mapping deep merge (Gap Closure)

---
