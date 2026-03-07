# Gemini Model Integration

## What This Is

This project adds compatibility for Gemini models and `gemini-cli` to the `get-shit-done` (GSD) framework. It ensures that when GSD is running within the `gemini-cli` environment, it correctly maps Claude-based model profiles to their Gemini counterparts and synchronizes these settings with the `gemini-cli` configuration.

## Core Value

Enable seamless use of GSD with Gemini models by automatically managing model configurations and `gemini-cli` integration.

## Requirements

### Validated

- ✓ CLI for managing AI-driven software development — existing
- ✓ Support for Claude model profiles (Opus, Sonnet, Haiku) — existing
- ✓ Planning workflow (Research, Roadmap, Requirements, State) — existing
- ✓ Subagent system for specialized tasks (gsd-planner, gsd-executor, etc.) — existing
- ✓ **GEM-01**: Map Claude model tiers (Opus, Sonnet, Haiku) to Gemini models (Gemini 1.5 Pro, Gemini 1.5 Flash, etc.) by default.
- ✓ **GEM-02**: Detect `gemini-cli` environment (via `$GEMINI_CLI=1`) and prioritize Gemini models.
- ✓ **GEM-03**: Automatically create and maintain `.gemini/settings.json` within the project directory.
- ✓ **GEM-04**: Implement `gemini-cli` hooks to synchronize model profiles on startup.
- ✓ **GEM-05**: Synchronize Per-Agent Overrides from `model-profiles.md` (or GSD config) to `.gemini/settings.json` and via `BeforeModel` hooks.
- ✓ **GEM-06**: Allow customization of the default Opus/Sonnet/Haiku to Gemini model mappings.

### Active

- (None. All requirements for this milestone are completed.)

### Out of Scope

- [ ] Support for other LLM providers (e.g., OpenAI, Anthropic direct) — limited to Gemini integration for this milestone.
- [ ] Refactoring the core GSD orchestration logic — focus is on model profile resolution and configuration sync.

## Context

- `get-shit-done` is currently optimized for Claude models using `model-profiles.md`.
- `gemini-cli` uses `.gemini/settings.json` for model overrides and configuration.
- The project is a Node.js (CommonJS) CLI tool.
- Model tiers: Opus (Quality), Sonnet (Balanced), Haiku (Budget).

## Constraints

- **Compatibility**: Must work within the existing `get-shit-done` structure without breaking Claude support.
- **Environment**: Must detect and adapt to the `gemini-cli` environment.
- **Tech Stack**: Node.js (CommonJS).
- **Simplicity**: "Keep it as simple as possible" (Project Rule 1).

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Use `gemini-cli` hooks | Requested by user for automatic startup sync. | ✓ Implemented `gsd-gemini-sync.js` |
| Automatic sync of overrides | Ensure `.gemini/settings.json` is always up to date with GSD settings. | ✓ Implemented in `syncGeminiSettings` |
| Customizable mappings | Mappings are defaults but can be overridden in `config.json`. | ✓ Implemented in `loadConfig` |
| Use `BeforeModel` Hook | Overcome session reload limitations for dynamic model injection. | ✓ Implemented `gsd-gemini-before-model.js` |

---
*Last updated: 2026-03-07 after Phase 05 completion*
