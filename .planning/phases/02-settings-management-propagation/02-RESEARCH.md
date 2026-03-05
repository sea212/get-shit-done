# Phase 02: Settings Management & Propagation - Research

**Researched:** 2026-03-05
**Domain:** Settings management, Node.js JSON file read/write, file system synchronization
**Confidence:** HIGH

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
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

### Claude's Discretion
- **Atomic Writes**: Use a temporary file and `rename` if possible to avoid corrupting `settings.json` if the process crashes during write (though for local CLI tools, simple `writeFileSync` is usually acceptable).
- **Format Consistency**: Ensure the output JSON is pretty-printed (2 spaces) to match `gemini-cli`'s default style.

### Deferred Ideas (OUT OF SCOPE)
- **Model Mapping Feedback Loop**: If `gemini-cli` fails to use the provided settings, detect it via hook/error and notify the user.
- **Agent-specific Safety Overrides**: Allow disabling `BLOCK_NONE` for specific agents (likely not needed).
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| GEM-03-01 | Automatically create `.gemini/settings.json` in the project root if it doesn't exist. | We need a robust file check/write method in a dedicated or existing module. |
| GEM-03-02 | Maintain a `modelConfigs.overrides` section in `.gemini/settings.json`. | This is an array of override objects inside the `modelConfigs` key. |
| GEM-03-03 | Ensure settings are merged correctly without overwriting user-defined non-GSD settings. | Requires reading the existing file, parsing, filtering `gsd-*` scopes out, adding the new ones, and writing back. |
| GEM-05-01 | Whenever a GSD agent's model is overridden (e.g., via `/gsd:set-profile` or `.planning/config.json`), update `.gemini/settings.json`. | Addressed by the "Lazy on Gemini Use" sync trigger. Settings sync when commands are run under `GEMINI_CLI=1`. |
| GEM-05-02 | Map Claude-tier overrides to Gemini models during propagation. | Re-use `resolveModelInternal` or `core.cjs` utilities to know the mapped model. |
</phase_requirements>

## Summary

This phase focuses on ensuring that when users run GSD with `GEMINI_CLI=1`, the project settings and model profiles automatically propagate to a project-root `.gemini/settings.json` file. This synchronization eliminates manual configuration for the user. We will implement a file synchronization mechanism that reads the existing `.gemini/settings.json` (if any), merges in our dynamic `gsd-*` model mappings with `BLOCK_NONE` safety settings, and writes it back atomically using a pretty-printed format.

**Primary recommendation:** Implement a new synchronous function (e.g., `syncGeminiSettings`) in `core.cjs` (or a dedicated helper) that generates overrides for all `MODEL_PROFILES`, merges them with the existing `settings.json` (preserving non-GSD scopes), and writes back. Call this strategically during startup or configuration loads to avoid recursion.

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| `fs` | built-in | File system operations | Built into Node.js, required for file manipulation. |
| `path` | built-in | Path construction | Built into Node.js. |

## Architecture Patterns

### Recommended Project Structure
We're likely modifying `get-shit-done/bin/lib/core.cjs` or adding a new file (e.g., `gemini.cjs`) if the size merits it. For simplicity, adding `syncGeminiSettings(cwd)` to `core.cjs` aligns with `resolveModelInternal` and `getGeminiSafetySettings`.

### Pattern 1: Safe JSON Merge
**What:** Reading, merging, and writing JSON with atomic writes and specific key isolation.
**When to use:** When modifying user-owned configuration files like `.gemini/settings.json`.
**Example:**
```javascript
const fs = require('fs');
const path = require('path');

function syncGeminiSettings(cwd) {
  if (process.env.GEMINI_CLI !== '1') return;

  const settingsDir = path.join(cwd, '.gemini');
  const settingsFile = path.join(settingsDir, 'settings.json');
  
  // Read existing
  let currentSettings = { modelConfigs: { overrides: [] } };
  if (fs.existsSync(settingsFile)) {
    try {
      currentSettings = JSON.parse(fs.readFileSync(settingsFile, 'utf8'));
    } catch (e) {
      currentSettings = { modelConfigs: { overrides: [] } };
    }
  }

  // Ensure structure
  if (!currentSettings.modelConfigs) currentSettings.modelConfigs = {};
  if (!Array.isArray(currentSettings.modelConfigs.overrides)) currentSettings.modelConfigs.overrides = [];

  // Filter out existing GSD overrides
  const userOverrides = currentSettings.modelConfigs.overrides.filter(
    o => !(o.match && o.match.overrideScope && o.match.overrideScope.startsWith('gsd-'))
  );

  // Generate new GSD overrides
  const gsdOverrides = [];
  const safetySettings = getGeminiSafetySettings(); // From core.cjs

  for (const agentType of Object.keys(MODEL_PROFILES)) {
    // Generate override for each agent
    const resolvedModel = resolveModelInternal(cwd, agentType);
    gsdOverrides.push({
      match: { overrideScope: agentType },
      modelConfig: {
        model: resolvedModel,
        safetySettings
      }
    });
  }

  // Merge
  currentSettings.modelConfigs.overrides = [...userOverrides, ...gsdOverrides];

  // Atomic write
  if (!fs.existsSync(settingsDir)) fs.mkdirSync(settingsDir, { recursive: true });
  const tmpFile = `${settingsFile}.tmp-${Date.now()}`;
  fs.writeFileSync(tmpFile, JSON.stringify(currentSettings, null, 2), 'utf8');
  fs.renameSync(tmpFile, settingsFile);
}
```

### Anti-Patterns to Avoid
- **Blind Overwrite:** Never write `{ modelConfigs: { overrides: [...] } }` directly over `.gemini/settings.json` without parsing existing configurations. Users may have other overrides.
- **Constant Disk I/O:** Calling this function on every tiny operation slows down the CLI. A module-level `let hasSynced = false;` flag can ensure it runs only once per CLI execution.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Atomic Writes | Complex locking mechanisms | `fs.writeFileSync` to a temp file + `fs.renameSync` | Node's `fs.renameSync` is atomic on POSIX. Simple and effective for configuration files. |
| Deep Merge | Custom recursive object merging | Array filtering and spreading | We only merge an array (`overrides`). Filter out `gsd-` scopes and append new ones. |

**Key insight:** Keeping the state synchronization localized to `modelConfigs.overrides` and preventing recursive calls are the two most critical aspects.

## Common Pitfalls

### Pitfall 1: Infinite Loops in `resolveModelInternal`
**What goes wrong:** If `syncGeminiSettings` calls `resolveModelInternal` for all agents, and `resolveModelInternal` automatically calls `syncGeminiSettings`, you get a "Maximum call stack size exceeded" error.
**Why it happens:** Circular dependency in logic.
**How to avoid:** Ensure `syncGeminiSettings` is called outside of the `resolveModelInternal` lookup logic. Call it only from top-level command execution entry points, or have it pass a flag like `resolveModelInternal(cwd, agent, { skipSync: true })`.

### Pitfall 2: Environment Variable Bleed in Tests
**What goes wrong:** `syncGeminiSettings` writes `.gemini/settings.json` to the actual project or user directory during unit tests if `GEMINI_CLI=1` is exported in the testing environment.
**Why it happens:** Global state not properly mocked or sandboxed.
**How to avoid:** Explicitly test in a temporary `cwd` directory and manually manage the `process.env.GEMINI_CLI` state around tests.

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | Custom Node test runner in `scripts/run-tests.cjs` |
| Config file | `package.json` ("test" script) |
| Quick run command | `node tests/core.test.cjs` |
| Full suite command | `npm test` |

### Phase Requirements → Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| GEM-03-01 | Creates `.gemini/settings.json` if missing | unit | `node tests/core.test.cjs` | ❌ Wave 0 |
| GEM-03-02 | Maintains `modelConfigs.overrides` section | unit | `node tests/core.test.cjs` | ❌ Wave 0 |
| GEM-03-03 | Merges without overwriting user settings | unit | `node tests/core.test.cjs` | ❌ Wave 0 |
| GEM-05-01 | Updates settings with agent mappings | unit | `node tests/core.test.cjs` | ❌ Wave 0 |
| GEM-05-02 | Maps Claude-tier models to Gemini | unit | `node tests/core.test.cjs` | ❌ Wave 0 |

### Sampling Rate
- **Per task commit:** `node tests/core.test.cjs`
- **Per wave merge:** `npm test`
- **Phase gate:** Full suite green before `/gsd:verify-work`

### Wave 0 Gaps
- [ ] New test cases in `tests/core.test.cjs` (or a dedicated `tests/gemini.test.cjs`) for the sync function. Covers GEM-03-01 to GEM-05-02.

## Sources

### Primary (HIGH confidence)
- `02-CONTEXT.md` - Context for the phase, locked decisions.
- `REQUIREMENTS.md` - Explicit requirements for Phase 02.
- `get-shit-done/bin/lib/core.cjs` - Source of truth for `MODEL_PROFILES` and current model resolution logic.

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - Core Node.js capabilities perfectly fit the requirement.
- Architecture: HIGH - Basic JSON serialization and atomic writes.
- Pitfalls: HIGH - Recursing `resolveModelInternal` is an extremely likely error that must be actively avoided.

**Research date:** 2026-03-05
**Valid until:** 2026-04-05