# Roadmap: Gemini Model Integration

## Phases

- [x] **Phase 1: Foundation & Config Logic** - Core model mapping and environment detection.
- [x] **Phase 2: Settings Management & Propagation** - Automatic maintenance of `.gemini/settings.json`. (completed 2026-03-05)
- [ ] **Phase 3: Lifecycle Hooks & Sync** - Integration with Gemini CLI lifecycle via startup hooks.

## Phase Details

### Phase 1: Foundation & Config Logic
**Goal**: Establish the core mapping between Claude tiers and Gemini models and detect the environment.
**Depends on**: Nothing
**Requirements**: GEM-01-01, GEM-01-02, GEM-01-03, GEM-02-01, GEM-02-02, GEM-06-01, GEM-07-01, GEM-07-02 (partial)
**Success Criteria** (what must be TRUE):
1. User can see Claude model tiers (Opus, Sonnet, Haiku) correctly mapped to Gemini equivalents when `GEMINI_CLI=1` is set.
2. User can override default mappings in `.planning/config.json`.
3. GSD correctly identifies the `gemini-cli` environment and prioritizes Gemini models for all agents.
4. Gemini safety settings are defaulted to `BLOCK_NONE` for all mapped models.
**Plans**: 
- [x] 01-01: Implementation of core mapping logic and unit tests.

### Phase 2: Settings Management & Propagation
**Goal**: Implement automatic creation and synchronization of the `.gemini/settings.json` file.
**Depends on**: Phase 1
**Requirements**: GEM-03-01, GEM-03-02, GEM-03-03, GEM-05-01, GEM-05-02
**Success Criteria** (what must be TRUE):
1. GSD automatically creates `.gemini/settings.json` in the project root if it doesn't exist.
2. Manual updates to GSD model profiles (via config or commands) are immediately propagated to `.gemini/settings.json`.
3. Existing user-defined settings in `.gemini/settings.json` are preserved during GSD synchronization.
**Plans**: 2 plans
- [ ] 02-01-PLAN.md — Implement syncGeminiSettings to automatically create and synchronize .gemini/settings.json
- [ ] 02-02-PLAN.md — Trigger synchronization of .gemini/settings.json dynamically when Gemini CLI is active

### Phase 3: Lifecycle Hooks & Sync
**Goal**: Connect GSD to the Gemini CLI startup sequence using standard hooks.
**Depends on**: Phase 2
**Requirements**: GEM-04-01, GEM-04-02, GEM-04-03, GEM-07-02 (partial)
**Success Criteria** (what must be TRUE):
1. A synchronization hook script (`hooks/gsd-gemini-sync.js`) exists and adheres to the Gemini CLI JSON protocol.
2. GSD model profiles are automatically synced to the Gemini CLI configuration whenever the CLI starts.
3. Errors in settings file access or hook execution are reported via `stderr` without breaking the CLI's JSON I/O.
**Plans**: TBD

## Progress Table

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Foundation & Config Logic | 1/1 | Completed | 2026-03-05 |
| 2. Settings Management & Propagation | 1/2 | Complete    | 2026-03-05 |
| 3. Lifecycle Hooks & Sync | 0/0 | Not started | - |