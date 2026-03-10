#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { MODEL_PROFILES } = require('../get-shit-done/bin/lib/core.cjs');

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

	if (!(data.tool_name in MODEL_PROFILES)) {
		exitGraceful();
	}

	if (!data.transcript_path || !fs.existsSync(data.transcript_path)) {
		exitWarning(`transcript_path (${data.transcript_path}) does not exist`);
	}

	const dirname = path.dirname(data.transcript_path);
	const basename = path.basename(data.transcript_path, path.extname(data.transcript_path));

	const parentDir = path.dirname(dirname);
	const appendFile = path.join(parentDir, `agent_override_${basename}`);

	if (!data.tool_name) {
		exitWarning('tool_name is undefined');
	}

	fs.appendFileSync(appendFile, data.tool_name + '\n');

	exitGraceful();
});
