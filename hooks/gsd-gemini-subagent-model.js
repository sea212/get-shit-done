#!/usr/bin/env node

/**
 * BeforeModel Hook — Dynamic Model Injection
 *
 * This hook intercepts model_request from gemini-cli and injects the
 * correct model mapping based on GSD's active model profile.
 */

const { resolveModelInternal } = require('../get-shit-done/bin/lib/core.cjs');
const fs = require('fs');
const path = require('path');


/**
 * Exits the hook gracefully, allowing the model request to proceed without modification.
 */
function exitGraceful() {
	process.stdout.write('{"decision": "allow"}');
	process.exit(0);
}

/**
 * Exits the hook with a warning message on stderr and exit code 1.
 * Model execution will proceed with the current model.
 * @param {string} message - Warning message to write to stderr.
 */
function exitWarning(message) {
	process.stderr.write(`${message}\n`);
	process.exit(1);
}

let input = '';
const stdinTimeout = setTimeout(() => {
	exitWarning('Hook timed out waiting for stdin.');
}, 3000);

process.stdin.setEncoding('utf8');
process.stdin.on('data', chunk => {
	input += chunk;
});

process.stdin.on('end', () => {
	clearTimeout(stdinTimeout);
	if (!input.trim()) {
		exitWarning('Hook received empty input.');
	}
	let data;
	try {
		data = JSON.parse(input);
	} catch (e) {
		exitWarning(`Failed to parse hook input JSON: ${e.message}`);
	}

	// Determine working directory for config resolution
	let cwd = process.cwd();
	if (data.cwd) {
		cwd = data.cwd;
	}

	if (!data.transcript_path || !fs.existsSync(data.transcript_path)) {
		exitGraceful();
	}

	const dirname = path.dirname(data.transcript_path);
	const basename = path.basename(data.transcript_path, path.extname(data.transcript_path));
	const parentDir = path.dirname(dirname);
	const agentOverrideFile = path.join(parentDir, `agent_override_${basename}`);

	if (!fs.existsSync(agentOverrideFile)) {
		exitGraceful();
	}

	let lines = fs.readFileSync(agentOverrideFile, 'utf8').split(/\r?\n/).filter(line => line.trim().length > 0);
	if (lines.length === 0) {
		try { fs.unlinkSync(agentOverrideFile); } catch (e) { }
		exitGraceful();
	}

	const agentType = lines.shift().trim();

	if (lines.length === 0) {
		try { fs.unlinkSync(agentOverrideFile); } catch (e) { }
	} else {
		fs.writeFileSync(agentOverrideFile, lines.join('\n') + '\n');
	}

	let resolvedModel = null;

	if (agentType) {
		try {
			// Injected model based on GSD profile
			resolvedModel = resolveModelInternal(cwd, agentType, { forceGemini: true });
		} catch (err) {
			exitWarning(`resolveModelInternal failed: ${err.message}`);
		}
	}

	// Protocol: Modified fields must be returned under hookSpecificOutput
	const output = {
		hookEventName: 'BeforeModel',
		hookSpecificOutput: {
			llm_request: {
				model: resolvedModel,
			}
		}
	};

	// Output modified JSON to stdout (the protocol)
	process.stdout.write(JSON.stringify(output));
});