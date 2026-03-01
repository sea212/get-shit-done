# Phase 2 Context: Model Resolution & Mapping

## Goal
Map and resolve model profiles to Gemini variants when running in the `gemini-cli` environment.

## Decisions

### Mapping Logic & Overrides
- **Universal Mapping**: If `isGeminiEnvironment()` is true, any model name that is NOT a `gemini-*` variant will be mapped to its corresponding Gemini equivalent.
- **Strict Tiers**: Mapping applies strictly to the three standard tiers: `opus`, `sonnet`, and `haiku`.
- **Gemini Priority**: When in a Gemini environment, the mapping (e.g., `opus` -> `gemini-3.1-pro-preview`) takes precedence over the original name, even if the user manually overrides a model to `opus` or `claude-3-opus`.
- **Direct Overrides**: If a user explicitly sets a model override in `config.json` to a specific Gemini model (e.g., `gemini-1.5-pro-002`), it will be used exactly as-is.

### Configuration vs. Hardcoding
- **Default Config**: The default Gemini model variants will be defined in `config.json` as a default mapping.
- **Customizable**: Users can completely define which Gemini model is used for every agent/phase using the existing `model_profiles` configuration. The Gemini mappings serve as the fallback when no specific override is provided.
- **No Global Preference**: No separate `preferred_gemini_model` setting is needed; existing profile/agent overrides are sufficient.

### User Feedback & Visibility
- **One-Time Notification**: GSD will notify the user once at the start of a command if it is running in a Gemini environment and mapping models (e.g., "Environment detected: gemini-cli. Mapping 'opus' to 'gemini-3.1-pro-preview'.").
- **Transparent Progress**: The actual Gemini model name (e.g., `gemini-3.1-pro-preview`) will be shown in progress indicators during task execution.
- **Status Visibility**: A way to view the currently resolved model mapping will be provided (e.g., through `gsd status --models` or similar).

### Model Version Selection
- **Exact Strings**: Use the exact strings provided in the requirements as defaults:
  - `opus` -> `gemini-3.1-pro-preview`
  - `sonnet` -> `gemini-3-flash-preview`
  - `haiku` -> `gemini-2.5-flash-lite`
- **Validation**: Perform validation to ensure that model strings start with `gemini-` when running in the Gemini environment.
- **Deprecation Warning**: Implement a mechanism to warn the user if these default strings are known to be deprecated.

## Code Context
- **Integration Point**: Mapping logic should be integrated into `get-shit-done/bin/lib/core.cjs` within the `resolveModelInternal` function (currently marked with a Phase 2 placeholder).
- **Detection**: Use the `isGeminiEnvironment()` check from Phase 1 (already available in `core.cjs`).
- **Tests**: Update `tests/core.test.cjs` to verify that `isGeminiEnvironment()` correctly triggers the mapping and that overrides behave as expected.
