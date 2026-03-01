# Phase 02: Model Resolution & Mapping - Research

**Researched:** 2026-02-28
**Domain:** Model Resolution / Configuration Overrides
**Confidence:** HIGH

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- **Universal Mapping**: If `isGeminiEnvironment()` is true, any model name that is NOT a `gemini-*` variant will be mapped to its corresponding Gemini equivalent.
- **Strict Tiers**: Mapping applies strictly to the three standard tiers: `opus`, `sonnet`, and `haiku`.
- **Gemini Priority**: When in a Gemini environment, the mapping (e.g., `opus` -> `gemini-3.1-pro-preview`) takes precedence over the original name, even if the user manually overrides a model to `opus` or `claude-3-opus`.
- **Direct Overrides**: If a user explicitly sets a model override in `config.json` to a specific Gemini model (e.g., `gemini-1.5-pro-002`), it will be used exactly as-is.
- **Default Config**: The default Gemini model variants will be defined in `config.json` as a default mapping.
- **Customizable**: Users can completely define which Gemini model is used for every agent/phase using the existing `model_profiles` configuration. The Gemini mappings serve as the fallback when no specific override is provided.
- **No Global Preference**: No separate `preferred_gemini_model` setting is needed; existing profile/agent overrides are sufficient.
- **One-Time Notification**: GSD will notify the user once at the start of a command if it is running in a Gemini environment and mapping models (e.g., "Environment detected: gemini-cli. Mapping 'opus' to 'gemini-3.1-pro-preview'.").
- **Transparent Progress**: The actual Gemini model name (e.g., `gemini-3.1-pro-preview`) will be shown in progress indicators during task execution.
- **Status Visibility**: A way to view the currently resolved model mapping will be provided (e.g., through `gsd status --models` or similar).
- **Exact Strings**: Use the exact strings provided in the requirements as defaults:
  - `opus` -> `gemini-3.1-pro-preview`
  - `sonnet` -> `gemini-3-flash-preview`
  - `haiku` -> `gemini-2.5-flash-lite`
- **Validation**: Perform validation to ensure that model strings start with `gemini-` when running in the Gemini environment.
- **Deprecation Warning**: Implement a mechanism to warn the user if these default strings are known to be deprecated.

### Claude's Discretion
[None specified in Context]

### Deferred Ideas (OUT OF SCOPE)
[None specified in Context]
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| MOD-01 | Map "opus" tier to `gemini-3.1-pro-preview` in Gemini environments. | Validated target model |
| MOD-02 | Map "sonnet" tier to `gemini-3-flash-preview` in Gemini environments. | Validated target model |
| MOD-03 | Map "haiku" tier to `gemini-2.5-flash-lite` in Gemini environments. | Validated target model |
| PROF-01 | `model_profile` resolution logic respects the environment mapping. | Requires modifying `resolveModelInternal()` in `core.cjs` |
| PROF-02 | Agent `Task` calls successfully receive the mapped Gemini model strings. | Ensures orchestrator logic consumes the correct string |
</phase_requirements>

## Summary

The current model resolution in `get-shit-done` relies on `get-shit-done/bin/lib/core.cjs` via `resolveModelInternal()`. It uses predefined profiles mapping `quality`, `balanced`, and `budget` keys to `opus`, `sonnet`, or `haiku`. This works seamlessly for Anthropic models but breaks down when run within a pure Gemini environment.

To solve this, we will augment `resolveModelInternal` to transparently map Anthropic tiers to their Gemini equivalents (`gemini-3.1-pro-preview`, `gemini-3-flash-preview`, `gemini-2.5-flash-lite`) if `isGeminiEnvironment()` returns true. Furthermore, any override present in `model_overrides` that is an Anthropic string will be similarly mapped, while native `gemini-*` strings will be passed through verbatim.

**Primary recommendation:** Intercept the model resolution step at the very end of `resolveModelInternal()`, applying the mapping only if `isGeminiEnvironment()` is active, while continuing to parse `.planning/config.json` for customized mapping behavior.

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| `get-shit-done` Core | Internal | Resolution Pipeline | Modifying `core.cjs` provides universal intercept |
| `node:test` | Built-in | Testing Framework | Project's chosen lightweight standard framework |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| `process.env` | Native | Environment Check | Uses `GEMINI_CLI=1` via `isGeminiEnvironment()` |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Modifying `resolveModelInternal()` | Monkey-patching task calls | Modifying core is robust; patching task calls leads to spaghetti code |

## Architecture Patterns

### Recommended Project Structure
```
get-shit-done/
├── bin/
│   └── lib/
│       └── core.cjs      # Central model resolution
└── tests/
    └── core.test.cjs     # Model mapping behavior validation
```

### Pattern 1: Environment-Aware Model Resolution
**What:** Centralized routing that switches default mappings conditionally.
**When to use:** When standard behavior needs to seamlessly transition based on the hosting CLI runtime.
**Example:**
```javascript
// Source: Proposed architecture based on core.cjs
function resolveModelInternal(cwd, agentType) {
  const config = loadConfig(cwd);
  
  // existing logic evaluating override or default 'opus' / 'sonnet'
  let resolvedModel;
  const override = config.model_overrides?.[agentType];
  
  if (override) {
    resolvedModel = override;
  } else {
    const profile = config.model_profile || 'balanced';
    const agentModels = MODEL_PROFILES[agentType];
    resolvedModel = agentModels ? (agentModels[profile] || agentModels['balanced'] || 'sonnet') : 'sonnet';
  }

  if (isGeminiEnvironment()) {
    // Look up in config.gemini_models or fallback to default mappings
    const defaultGeminiModels = config.gemini_models || {
      'opus': 'gemini-3.1-pro-preview',
      'sonnet': 'gemini-3-flash-preview',
      'haiku': 'gemini-2.5-flash-lite'
    };
    
    // Normalize aliases
    const baseModel = resolvedModel.replace('claude-3-', '');
    if (defaultGeminiModels[baseModel]) {
      return defaultGeminiModels[baseModel];
    }
    
    // Validate that it is a gemini model otherwise
    if (!resolvedModel.startsWith('gemini-')) {
       // warning or fallback logic
    }
    return resolvedModel;
  }

  return resolvedModel === 'opus' ? 'inherit' : resolvedModel;
}
```

### Anti-Patterns to Avoid
- **Anti-pattern:** Duplicating mapping logic in individual command files. Modify `resolveModelInternal()` once so that all consumers benefit.
- **Anti-pattern:** Assuming `config.gemini_models` always exists. Ensure graceful fallback to the hardcoded defaults.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Environment detection | A new environment flag check | `isGeminiEnvironment()` | Already implemented in Phase 1 and battle-tested |
| CLI Argument parsing for models | Custom flags for Gemini override | `model_overrides` in `config.json` | Reuses existing patterns rather than fracturing UX |

**Key insight:** The user should not have to change their `model_profiles` configuration. The system should transparently upgrade `opus` to `gemini-3.1-pro-preview`.

## Common Pitfalls

### Pitfall 1: Breaking 'inherit' behavior
**What goes wrong:** The orchestrator expects `inherit` to delegate to Claude Code, but in Gemini CLI, `inherit` might not work.
**Why it happens:** Returning `inherit` from `resolveModelInternal` when Gemini environment is active.
**How to avoid:** Map `opus` (which usually returns `inherit`) to `gemini-3.1-pro-preview` *before* the `inherit` check if in a Gemini environment.
**Warning signs:** Tasks running with default models instead of Pro tiers.

### Pitfall 2: Bypassing User Overrides
**What goes wrong:** A user provides `model_overrides: { 'gsd-planner': 'gemini-1.5-pro-002' }` and it gets ignored or overridden.
**Why it happens:** The mapping logic accidentally applies strictly to the output of `model_profiles` without checking overrides.
**How to avoid:** First apply user overrides. If the resulting string is an Anthropic tier, map it. If it is already a Gemini tier, pass it through.

## Code Examples

Verified patterns from official sources:

### Reading config for default mappings
```javascript
// Source: `get-shit-done/bin/lib/core.cjs` loadConfig()
function loadConfig(cwd) {
  // Add new field extraction
  // ...
  return {
    // ...
    gemini_models: parsed.gemini_models || {
      opus: 'gemini-3.1-pro-preview',
      sonnet: 'gemini-3-flash-preview',
      haiku: 'gemini-2.5-flash-lite'
    },
    // ...
  };
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Hardcoded Claude models | Environment-aware proxy models | Phase 2 | Allows executing unmodified workflow files on either Claude Code or Gemini CLI |

**Deprecated/outdated:**
- Hardcoding `claude-3-opus` string references anywhere outside of the mapping dictionary.

## Open Questions

1. **Deprecation Warnings**
   - What we know: The spec requires a deprecation warning if the default strings are known to be deprecated.
   - What's unclear: How do we *know* they are deprecated without making external API calls?
   - Recommendation: Since models change, we might implement a simple static check against an "expired" list if feasible, or defer the warning logic to API call failure responses.

## Sources

### Primary (HIGH confidence)
- Project Source: `get-shit-done/bin/lib/core.cjs` - Structure of model resolution pipeline.
- Project Source: `get-shit-done/tests/core.test.cjs` - Testing standards for config overrides.

### Secondary (MEDIUM confidence)
- WebSearch verified: Target models `gemini-3.1-pro-preview`, `gemini-3-flash-preview`, `gemini-2.5-flash-lite` correspond to Google's latest preview and production offerings.

### Tertiary (LOW confidence)
- None.

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - Interacting directly with existing core library.
- Architecture: HIGH - Extending existing intercept patterns matches codebase style.
- Pitfalls: HIGH - Pitfalls identified directly from code review of `resolveModelInternal()`.

**Research date:** 2026-02-28
**Valid until:** 2026-04-01 (Assuming model string updates)
