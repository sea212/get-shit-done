# Get Shit Done - Gemini Migration

## What This Is

Updating the "Get Shit Done" (GSD) framework and CLI tooling to natively support Gemini models and the `gemini-cli` environment. The project enables seamless transition of model configurations and agent mappings to Gemini equivalents when running in a Gemini environment.

## Core Value

Ensure `get-shit-done` functions seamlessly in a Gemini-centric environment by automatically selecting and defaulting to the appropriate Gemini models (`gemini-3.1-pro-preview`, `gemini-3-flash-preview`, `gemini-2.5-flash-lite`) based on agent profiles and task requirements.

## Requirements

### Validated

- ✓ CLI Tool Hub execution and orchestration (Node.js) — v0.1
- ✓ Prompt-driven workflow state management in `.planning/` — v0.1
- ✓ Multi-agent system orchestration and Task delegation — v0.1
- ✓ Frontmatter and document validation — v0.1
- ✓ Detect `gemini-cli` environment dynamically — v1.0
- ✓ Map abstract model tiers (opus, sonnet, haiku) to Gemini variants — v1.0
- ✓ Profile resolution respects environment-aware mapping — v1.0

### Active

- [ ] Comprehensive integration tests for Gemini model assignments (v2)
- [ ] Automated migration tool for legacy config.json files (v2 candidate)

### Out of Scope

- Removing support for Claude completely — GSD should remain flexible or configurable, but Gemini becomes the default in Gemini environments.

## Context

Shipped v1.0 Gemini Migration.
The framework now detects `GEMINI_CLI=1` and maps model tiers to Gemini preview/lite versions.
Tech stack remains zero-dependency Node.js.
Unit tests verify mapping logic and configuration deep-merging.

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Map existing aliases to Gemini | Avoids rewriting all agent definitions, uses translation layer | ✓ Good |
| Move mapping to config.json | Allows user-level overrides and easier maintenance | ✓ Good |
| Manual deep merge for config | Maintains zero-dependency goal while fixing shallow merge bug | ✓ Good |

## Next Milestone Goals (v2.0)

- Robust integration testing suite.
- Configuration migration utilities.

---
*Last updated: 2026-03-01 after v1.0 milestone*
