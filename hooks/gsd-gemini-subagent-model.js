#!/usr/bin/env node

/**
 * BeforeModel Hook — Dynamic Model Injection
 *
 * This hook intercepts model_request from gemini-cli and injects the
 * correct model mapping based on GSD's active model profile.
 */

const { resolveModelInternal } = require('../get-shit-done/bin/lib/core.cjs');

let input = '';
const stdinTimeout = setTimeout(() => {
  process.stderr.write('Error: Hook timed out waiting for stdin.\n');
  process.exit(1);
}, 3000);

process.stdin.setEncoding('utf8');
process.stdin.on('data', chunk => {
  input += chunk;
});

process.stdin.on('end', () => {
  clearTimeout(stdinTimeout);
  if (!input.trim()) {
    process.stderr.write('Error: Hook received empty input.\n');
    process.exit(1);
  }

  let data;
  try {
    data = JSON.parse(input);
  } catch (e) {
    process.stderr.write(`Error: Failed to parse hook input JSON: ${e.message}\n`);
    process.exit(1);
  }

  // Determine working directory for config resolution
  let cwd = process.cwd();
  if (data.cwd) {
    cwd = data.cwd;
  }

  // Recover agent context (agent_type) from multiple potential sources
  let agentType = null;

  // 1. Look for explicit agent_type in llm_request (some subagents might inject this)
  if (data.llm_request && data.llm_request.agent_type) {
    agentType = data.llm_request.agent_type;
  }
  // 2. Look for overrideScope in llm_request config (primary match for gemini-cli subagents)
  else if (data.llm_request && data.llm_request.config && data.llm_request.config.overrideScope) {
    agentType = data.llm_request.config.overrideScope;
  }
  // 3. Fallback to environment variable
  else if (process.env.GSD_AGENT_TYPE) {
    agentType = process.env.GSD_AGENT_TYPE;
  }
  // Fallback: Abort model override
  else {
    process.stderr.write('Error: Unable to determine agent_type.\n');
    process.exit(1);
  }

  let resolvedModel = null;
  if (agentType) {
    try {
      // Injected model based on GSD profile
      resolvedModel = resolveModelInternal(cwd, agentType, { forceGemini: true });
    } catch (err) {
      process.stderr.write(`Error: resolveModelInternal failed: ${err.message}\n`);
      process.exit(1);
    }
  }

  // Protocol: Modified fields must be returned under hookSpecificOutput
  const output = {
    hookSpecificOutput: {
      llm_request: {
        model: resolvedModel
      }
    }
  };

  // Output modified JSON to stdout (the protocol)
  process.stdout.write(JSON.stringify(output));
});
