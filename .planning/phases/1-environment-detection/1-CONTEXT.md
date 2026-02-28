# Phase 1 Context: Environment Detection

## State & Caching
- **Decision:** The `isGeminiEnvironment()` check must be evaluated dynamically inside `core.cjs` at runtime whenever model resolution occurs. Do not cache the result during `init.cjs` execution.

## Fallback Behavior
- **Decision:** If the environment is not definitively identified as `gemini-cli` (ambiguous or missing markers), the system must safely default to the current Claude behavior (returning `opus`, `sonnet`, or `haiku` as it currently does).

## Environment Markers
- **Decision:** The specific environment variables or process properties to check for `gemini-cli` are left to the researcher/planner to determine by inspecting standard process variables in the execution environment.

## Code Context
- **Relevant files:** `get-shit-done/bin/lib/core.cjs` and `get-shit-done/bin/lib/init.cjs`.
- **Target integration point:** `resolveModelInternal` within `core.cjs` is where this dynamic check will be leveraged.
