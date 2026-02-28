# Roadmap

**2 phases** | **7 requirements mapped** | All v1 requirements covered ✓

| # | Phase | Goal | Requirements | Success Criteria |
|---|-------|------|--------------|------------------|
| 1 | Environment Detection | Complete    | 2026-02-28 | 2 |
| 2 | Model Resolution & Mapping | Map and resolve model profiles to Gemini variants | MOD-01, MOD-02, MOD-03, PROF-01, PROF-02 | 3 |

### Phase Details

## Phase 1: Environment Detection
Goal: Detect `gemini-cli` environment
Requirements: ENV-01, ENV-02
Success criteria:
1. `gsd-tools.cjs` or equivalent core libraries expose a reliable `isGeminiEnvironment()` check.
2. The environment check correctly identifies when the tool is run by `gemini-cli`.

**Plans:** 1/1 plans complete

Plans:
- [ ] 01-01-PLAN.md — Implement dynamic environment detection

## Phase 2: Model Resolution & Mapping
Goal: Map and resolve model profiles to Gemini variants
Requirements: MOD-01, MOD-02, MOD-03, PROF-01, PROF-02
Success criteria:
1. Orchestrators requesting `opus`, `sonnet`, or `haiku` receive the correct `gemini-*` equivalent when `isGeminiEnvironment()` is true.
2. `config.json` default profiles gracefully handle the mapped names.
3. Unit/Integration tests for `model-profile-resolution` pass with the new mapping logic.

---