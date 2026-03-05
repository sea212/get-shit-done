---
phase: "02"
name: "Settings Management & Propagation"
created: 2026-03-05
---

# Phase 02: Settings Management & Propagation — Context

## Decisions

- **Sync Trigger**: **Lazy on Gemini Use**. `.gemini/settings.json` should only be updated when GSD commands are run while `GEMINI_CLI=1` is set. If the environment variable is not present, no sync should occur to avoid cluttering projects that aren't using Gemini.
- **Merge Strategy**: **Scope-based Merge**.
  - Identify GSD-owned overrides by `match.overrideScope` starting with `gsd-` (e.g., `gsd-planner`, `gsd-executor`).
  - When syncing, only update or add overrides for these specific scopes.
  - Preserve any existing user-defined overrides in `modelConfigs.overrides` that do not match the `gsd-` prefix.
  - If `.gemini/settings.json` is missing or contains invalid JSON, recreate it with the GSD defaults.
- **Population Depth**: **Full Manifest**. 
  - On the first sync (or when the profile changes), populate `.gemini/settings.json` with entries for *all* GSD subagents listed in `MODEL_PROFILES` (found in `core.cjs`).
  - This ensures all agents are immediately correctly mapped to their Gemini equivalents according to the current profile.
- **Safety Defaults**: **Hardcoded BLOCK_NONE**.
  - Every override added by GSD to `.gemini/settings.json` must include the `modelConfig.safetySettings` array set to `BLOCK_NONE` for all categories.
  - This is hardcoded for GSD agents to ensure maximum permissiveness during development tasks.
- **Storage Location**: Root-level `.gemini/settings.json`.
  - Always prefer the project-root `.gemini` folder over global settings for project-specific model mappings.

## Scouted Codebase

- **core.cjs**:
  - `loadConfig(cwd)`: Already retrieves `model_profile` and `model_overrides`.
  - `MODEL_PROFILES`: Use this as the source for the full agent list to populate the manifest.
  - `resolveModelInternal(cwd, agentType)`: This is the primary "entry point" where `GEMINI_CLI=1` check happens. It's a good place to trigger the sync if needed.
- **config.cjs**:
  - `cmdConfigSet`: While we decided on "Lazy" sync, it's worth considering if an explicit sync should be triggered after a manual profile switch even if `GEMINI_CLI` is not set. (Deferred: Stick to lazy for now).

## Discretion Areas

- **Atomic Writes**: Use a temporary file and `rename` if possible to avoid corrupting `settings.json` if the process crashes during write (though for local CLI tools, simple `writeFileSync` is usually acceptable).
- **Format Consistency**: Ensure the output JSON is pretty-printed (2 spaces) to match `gemini-cli`'s default style.

## Deferred Ideas

- **Model Mapping Feedback Loop**: If `gemini-cli` fails to use the provided settings, detect it via hook/error and notify the user.
- **Agent-specific Safety Overrides**: Allow disabling `BLOCK_NONE` for specific agents (likely not needed).
