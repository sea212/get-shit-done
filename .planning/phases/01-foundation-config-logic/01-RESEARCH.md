# Phase 01: Foundation & Config Logic - Research

**Researched:** 2026-03-05
**Domain:** Model resolution and configuration logic
**Confidence:** HIGH

## Summary

This phase establishes the foundational mapping logic between Claude-defined tiers (Opus, Sonnet, Haiku) and Gemini models. The integration is strictly environment-driven, activated by `GEMINI_CLI=1`. Key components include updating `resolveModelInternal` to handle conditional mapping, enhancing `loadConfig` to support a new `gemini` configuration section, and ensuring default mappings are bootstrapped during configuration initialization.

**Primary recommendation:** Implement a centralized tier-to-model mapping in `core.cjs` that only activates when `GEMINI_CLI=1` is present, ensuring that user overrides in `.planning/config.json` are respected and correctly translated to their Gemini equivalents.

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- **Environment Activation**: Gemini mode is activated strictly via the `GEMINI_CLI=1` environment variable. If not set, GSD defaults to standard Claude-based resolution.
- **Default Tier Mappings**:
  - `opus` → `gemini-3-pro-latest`
  - `sonnet` → `gemini-3-flash-latest`
  - `haiku` → `gemini-2.5-flash-lite-latest`
- **Config Schema**:
  - Add a `gemini` section to `.planning/config.json`.
  - Nested `mappings` key allows overriding specific tiers for Gemini mode only.
- **Override Priority**:
  - If a user has an explicit Claude model override (e.g., `claude-3-opus-20240229`) in `.planning/config.json`, and `GEMINI_CLI=1` is set, GSD will map the **tier** of that override to the corresponding Gemini model (e.g., `gemini-3-pro-latest`).
- **Safety Defaults**:
  - All Gemini model resolutions will have `BLOCK_NONE` safety settings applied by default (to be handled in Phase 2/3 sync, but the logic should exist in Phase 1).

### Claude's Discretion
- **Error Handling**: If `GEMINI_CLI=1` is set but a mapping is missing or invalid, the executor should log a clear warning and fall back to the safest tier equivalent rather than crashing.
- **Migration Logic**: When `loadConfig` detects legacy mapping formats, it should migrate them to the new `gemini.mappings` section if appropriate.

### Deferred Ideas (OUT OF SCOPE)
- **Context Caching**: Gemini-specific context caching optimization (GEM-09).
- **Free Tier Throttling**: Intelligent rate-limit handling for 2 RPM (GEM-08).
- **Vertex AI Support**: Support for Vertex AI endpoint selection (currently out of scope).
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| GEM-01-01 | Map "opus" to "gemini-3-pro-latest" | Verified mapping in `01-CONTEXT.md` and logic location in `core.cjs`. |
| GEM-01-02 | Map "sonnet" to "gemini-3-flash-latest" | Verified mapping in `01-CONTEXT.md`. |
| GEM-01-03 | Map "haiku" to "gemini-2.5-flash-lite-latest" | Verified mapping in `01-CONTEXT.md`. |
| GEM-02-01 | Detect if `GEMINI_CLI=1` is set | Environment variable detection is standard in `core.cjs`. |
| GEM-02-02 | Prioritize Gemini mappings if `GEMINI_CLI=1` | Logic identified for `resolveModelInternal`. |
| GEM-06-01 | Custom mapping support in `.planning/config.json` | Schema identified: `gemini.mappings` in `loadConfig`. |
| GEM-07-01 | Safety settings to `BLOCK_NONE` by default | Constant mapping for Gemini safety settings identified. |
| GEM-07-02 | Clear error messages for mapping failures | Warning/fallback strategy identified in `01-CONTEXT.md`. |
</phase_requirements>

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Node.js | ^18.0.0 | Runtime | Project standard for `gsd-tools`. |
| path | built-in | Path manipulation | Standard for cross-platform file paths. |
| fs | built-in | File system access | Standard for config CRUD. |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| gemini-cli | N/A | External tool | The target tool for integration (hooks/settings). |

## Architecture Patterns

### Recommended Project Structure
No new files are expected in Phase 01. Logic will be integrated into existing library files:
```
get-shit-done/bin/lib/
├── core.cjs         # Main model resolution logic
└── config.cjs       # Config initialization and CRUD
```

### Pattern 1: Tier-First Model Resolution
The system resolves the model in two distinct steps:
1. **Agent Resolution:** Map the `agent-type` (e.g., `gsd-planner`) and current `profile` (e.g., `balanced`) to a tier (`opus`, `sonnet`, or `haiku`).
2. **Environment Mapping:** Convert the tier to a concrete model string based on `GEMINI_CLI` and `config.json` mappings.

**Why:** This keeps the agent profiles clean and allows for easy swapping of backend models (Claude vs. Gemini) without changing agent definitions.

### Pattern 2: Explicit Mapping Constants
Store the default Gemini mappings in a constant object within `core.cjs`.

```javascript
const GEMINI_DEFAULT_MAPPINGS = {
  'opus': 'gemini-3-pro-latest',
  'sonnet': 'gemini-3-flash-latest',
  'haiku': 'gemini-2.5-flash-lite-latest'
};
```

### Anti-Patterns to Avoid
- **Implicit Activation:** Never activate Gemini mappings unless `GEMINI_CLI=1` is explicitly set.
- **Deep Model Extraction:** Avoid trying to parse tier information from complex custom Claude model strings (e.g., `claude-3-5-sonnet-20241022`) using regex. If it's not a standard tier string, fallback to a safe default (like `sonnet` -> `gemini-3-flash-latest`).

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Config Merging | Deep recursive merge | Existing `loadConfig` pattern | The project uses a flat/shallow merge with specific path logic in `core.cjs`. |
| Argument Parsing | Full `yargs` or `commander` | Positional/Flag slice | `gsd-tools.cjs` uses a lightweight manual slice to minimize overhead. |
| Tier Detection | Complex regex for model strings | Simple tier-lookup table | Model strings are volatile; tiers are stable abstractions. |

## Common Pitfalls

### Pitfall 1: Case Sensitivity in Env Vars
**What goes wrong:** `GEMINI_CLI=1` vs `gemini_cli=1`.
**Why it happens:** Standard shell environment variable conventions.
**How to avoid:** Always use `process.env.GEMINI_CLI` (uppercase) and verify it strictly equals `'1'`.

### Pitfall 2: Overriding the Wrong Section
**What goes wrong:** Users might add `gemini_mappings` instead of `gemini: { mappings: ... }`.
**How to avoid:** Use `cmdConfigEnsureSection` to provide a commented-out or default example in `.planning/config.json`.

## Code Examples

### Resolution Logic Pattern
```javascript
function resolveModelInternal(cwd, agentType) {
  const config = loadConfig(cwd);
  const isGemini = process.env.GEMINI_CLI === '1';

  // 1. Resolve Tier
  let tier = 'sonnet'; // Default
  const override = config.model_overrides?.[agentType];
  if (override) {
    tier = override;
  } else {
    const agentModels = MODEL_PROFILES[agentType];
    const profile = config.model_profile || 'balanced';
    tier = agentModels[profile] || agentModels['balanced'] || 'sonnet';
  }

  // 2. Map to Concrete Model
  if (isGemini) {
    // Check custom mappings in config first
    const customMapping = config.gemini?.mappings?.[tier];
    if (customMapping) return customMapping;

    // Use default Gemini mappings
    return GEMINI_DEFAULT_MAPPINGS[tier] || GEMINI_DEFAULT_MAPPINGS['sonnet'];
  }

  // Claude path (standard)
  return tier === 'opus' ? 'inherit' : tier;
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Tier -> Claude model | Tier -> Provider -> Model | 2026-03-05 | Allows multi-provider support. |

## Open Questions

1. **How should safety settings be surfaced?**
   - What we know: `BLOCK_NONE` is the requirement.
   - What's unclear: Should `resolveModel` return an object `{ model, safety }` or just the string?
   - Recommendation: Return just the string for now; Phase 2/3 will handle the hook sync where the safety settings are actually written to `.gemini/settings.json`.

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | Vitest / custom runner |
| Config file | `scripts/run-tests.cjs` |
| Quick run command | `node scripts/run-tests.cjs core` |
| Full suite command | `npm test` |

### Phase Requirements → Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| GEM-01-XX | Tiers map correctly to Gemini models | Unit | `node scripts/run-tests.cjs core.test.cjs` | ✅ |
| GEM-02-XX | `GEMINI_CLI=1` triggers mapping | Unit | `node scripts/run-tests.cjs core.test.cjs` | ✅ |
| GEM-06-01 | `config.json` overrides work | Unit | `node scripts/run-tests.cjs config.test.cjs` | ✅ |

### Wave 0 Gaps
- [ ] `tests/gemini-config.test.cjs` — needs to be created to specifically test the new `gemini` section in config and its resolution.
- [ ] Mock environment variables helper in `tests/helpers.cjs` to toggle `GEMINI_CLI` during tests.

## Sources

### Primary (HIGH confidence)
- `get-shit-done/bin/lib/core.cjs` - Existing resolution logic.
- `get-shit-done/bin/lib/config.cjs` - Existing config management.
- `01-CONTEXT.md` - Locked mappings and env activation.

### Secondary (MEDIUM confidence)
- `geminicli.com/docs/hooks` - Protocol for settings and lifecycle.

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - Minimal changes to existing Node.js code.
- Architecture: HIGH - Follows existing tiered resolution pattern.
- Pitfalls: MEDIUM - Based on common environment variable and JSON schema issues.

**Research date:** 2026-03-05
**Valid until:** 2026-04-05
