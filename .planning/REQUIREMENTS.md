# Requirements: Get Shit Done - Gemini Migration

**Defined:** 2026-02-28
**Core Value:** Ensure `get-shit-done` functions seamlessly in a Gemini-centric environment by automatically selecting appropriate Gemini models.

## v1 Requirements

### Environment Detection

- [x] **ENV-01**: System can detect if it is running within `gemini-cli`.
- [x] **ENV-02**: System falls back to default behavior if not in a Gemini environment.

### Model Mapping

- [x] **MOD-01**: Map "opus" tier to `gemini-3.1-pro-preview` in Gemini environments.
- [x] **MOD-02**: Map "sonnet" tier to `gemini-3-flash-preview` in Gemini environments.
- [ ] **MOD-03**: Map "haiku" tier to `gemini-2.5-flash-lite` in Gemini environments.

### Profile Resolution Update

- [ ] **PROF-01**: `model_profile` resolution logic respects the environment mapping.
- [ ] **PROF-02**: Agent `Task` calls successfully receive the mapped Gemini model strings.

## v2 Requirements

### Testing & Validation

- **TEST-01**: Comprehensive integration tests for Gemini model assignments.

## Out of Scope

| Feature | Reason |
|---------|--------|
| Removing Claude support | Tool should remain flexible for different CLI runners. |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| ENV-01 | Phase 1 | Complete |
| ENV-02 | Phase 1 | Complete |
| MOD-01 | Phase 2 | Complete |
| MOD-02 | Phase 2 | Complete |
| MOD-03 | Phase 2 | Pending |
| PROF-01 | Phase 2 | Pending |
| PROF-02 | Phase 2 | Pending |

**Coverage:**
- v1 requirements: 7 total
- Mapped to phases: 7
- Unmapped: 0 ✓

---
*Requirements defined: 2026-02-28*
*Last updated: 2026-02-28 after initial definition*
