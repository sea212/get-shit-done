# Roadmap: Gemini Model Integration

## Phases

- [x] **Phase 1: Foundation & Config Logic** - Core model mapping and environment detection.
- [x] **Phase 2: Settings Management & Propagation** - Automatic maintenance of `.gemini/settings.json`. (completed 2026-03-05)
- [x] **Phase 3: Lifecycle Hooks & Sync** - Integration with Gemini CLI lifecycle via startup hooks. (completed 2026-03-05)
- [x] **Phase 4: Fix Gemini Model Mapping Bug** - Fix incorrect model mapping in `syncGeminiSettings`. (completed 2026-03-07)
- [x] **Phase 5: Model Injection via BeforeModel Hook** - Transition from `settings.json` based approach to model injection via the `BeforeModel` hook, ensuring proper resolution of Gemini models. (completed 2026-03-07)

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
**Plans**: 6 plans
- [x] 02-01-PLAN.md — Implement syncGeminiSettings to automatically create and synchronize .gemini/settings.json
- [x] 02-02-PLAN.md — Trigger synchronization of .gemini/settings.json dynamically when Gemini CLI is active
- [x] 02-03-PLAN.md — Handle configuration merging for existing .gemini/settings.json
- [x] 02-04-PLAN.md — Fix model mapping for Opus tier to use gemini-1.5-pro-preview-0514
- [x] 02-05-PLAN.md — Standardize safety settings to BLOCK_NONE for all Gemini models
- [x] 02-06-PLAN.md — Fix agent override mapping in settings.json to match gemini-cli nested structure

- [x] **Phase 02.1: Correct agent model override semantics** - Update to nested structure and remove safety settings. (completed 2026-03-05)
### Phase 3: Lifecycle Hooks & Sync
**Goal**: Connect GSD to the Gemini CLI startup sequence using standard hooks.
**Depends on**: Phase 02.1
**Requirements**: GEM-04-01, GEM-04-02, GEM-04-03, GEM-07-02 (partial)
**Success Criteria** (what must be TRUE):
1. A synchronization hook script (`hooks/gsd-gemini-sync.js`) exists and adheres to the Gemini CLI JSON protocol.
2. GSD model profiles are automatically synced to the Gemini CLI configuration whenever the CLI starts.
3. Errors in settings file access or hook execution are reported via `stderr` without breaking the CLI's JSON I/O.
**Plans**: 4 plans
- [x] 03-01-PLAN.md — Implement the Gemini Sync Hook Script (completed 2026-03-05)
- [x] 03-02-PLAN.md — Update Installer to Register Sync Hook (completed 2026-03-05)
- [x] 03-03-PLAN.md — Fix hook script distribution in build process (gap closure) (completed 2026-03-07)
- [x] 03-04-PLAN.md — Fix config synchronization and bypass guard in hook (gap closure) (completed 2026-03-07)

### Phase 4: Fix Gemini Model Mapping Bug
**Goal**: Ensure that `syncGeminiSettings` correctly maps models to Gemini equivalents even when triggered via the startup hook without `GEMINI_CLI=1` set.
**Depends on**: Phase 3
**Requirements**: GEM-08-01
**Success Criteria** (what must be TRUE):
1. `syncGeminiSettings` produces correct Gemini model names (e.g., `gemini-3.1-pro-preview`) in `.gemini/settings.json`.
2. The `gsd-gemini-sync.js` hook correctly updates the settings file with Gemini models when executed by the Gemini CLI.
**Plans**: 
- [x] 04-01-PLAN.md — Fix model resolution logic in syncGeminiSettings (completed 2026-03-07)

### Phase 5: Model Injection via BeforeModel Hook
**Goal**: Transition from `settings.json` based approach to model injection via the `BeforeModel` hook.
**Depends on**: Phase 4
**Requirements**: GEM-09-01
**Success Criteria** (what must be TRUE):
1. A `BeforeModel` hook script correctly intercepts model requests from `gemini-cli`.
2. The hook script resolves the intended model for the current subagent using GSD's internal mappings.
3. The hook script injects the correct Gemini model into the request on-the-fly.
4. The system no longer relies on `settings.json` for turn-by-turn model overrides.
**Plans**: 2 plans
- [x] 05-01-PLAN.md — Implement model injection via BeforeModel hook. (completed 2026-03-07)
- [x] 05-02-PLAN.md — Close UAT gaps regarding Gemini settings migration logic and uninstaller hook cleanup (completed 2026-03-07)

## Progress Table

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Foundation & Config Logic | 1/1 | Completed | 2026-03-05 |
| 2. Settings Management & Propagation | 6/6 | Completed | 2026-03-05 |
| 02.1. Correct agent model overrides | 1/1 | Completed | 2026-03-05 |
| 3. Lifecycle Hooks & Sync | 4/4 | Completed | 2026-03-07 |
| 4. Fix Gemini Model Mapping Bug | 1/1 | Completed | 2026-03-07 |
| 5. Model Injection via BeforeModel Hook | 2/2 | Completed | 2026-03-07 |
