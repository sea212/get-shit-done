# Get Shit Done - Gemini Migration

## What This Is

Updating the "Get Shit Done" (GSD) framework and CLI tooling to natively support Gemini models and the `gemini-cli` environment. The project currently assigns Claude models based on profiles, and this effort will transition default model configurations and agent mappings to Gemini models when running in a Gemini environment.

## Core Value

Ensure `get-shit-done` functions seamlessly in a Gemini-centric environment by automatically selecting and defaulting to the appropriate Gemini models (`gemini-3.1-pro-preview`, `gemini-3-flash-preview`, `gemini-2.5-flash-lite`) based on agent profiles and task requirements.

## Requirements

### Validated

- ✓ CLI Tool Hub execution and orchestration (Node.js)
- ✓ Prompt-driven workflow state management in `.planning/`
- ✓ Multi-agent system orchestration and Task delegation
- ✓ Frontmatter and document validation

### Active

- [ ] Detect `gemini-cli` environment dynamically
- [ ] Map "opus" model profile to "gemini-3.1-pro-preview"
- [ ] Map "sonnet" model profile to "gemini-3-flash-preview"
- [ ] Map "haiku" model profile to "gemini-2.5-flash-lite"
- [ ] Update default profile definitions to default to Gemini when in Gemini environments

### Out of Scope

- Removing support for Claude completely — GSD should remain flexible or configurable, but Gemini becomes the default in Gemini environments.

## Context

- The framework is a vanilla Node.js CLI tool with executable markdown workflows.
- Currently, model resolution happens in orchestrators and `config.json` (e.g., `model_overrides`, `model_profile`).
- We need to hook into the model profile resolution to map Claude model tiers to Gemini equivalents when `gemini-cli` is detected.

## Constraints

- **Compatibility**: Must retain the zero-dependency Node.js architecture.
- **Model Mapping**: Must reliably map the abstract model quality tiers (quality, balanced, budget) to specific Gemini models.

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Map existing aliases to Gemini | Avoids rewriting all agent definitions, uses translation layer | — Pending |

---
*Last updated: 2026-02-28 after initialization*
