#!/usr/bin/env bun
/**
 * Migration Pass 3: Reorder dynamic imports to come AFTER mock.module calls.
 *
 * In bun:test, mock.module() must be called BEFORE any await import() of
 * modules that depend on the mocked modules. This pass moves dynamic imports
 * that appear before mock.module to after the last mock.module call.
 */

import { Glob } from "bun";
import { readFileSync, writeFileSync } from "node:fs";

const glob = new Glob("packages/{config,api,cli}/src/**/*.test.ts");
const files = Array.from(glob.scanSync("."));

let totalChanged = 0;

for (const file of files) {
	let content = readFileSync(file, "utf-8");
	const original = content;

	if (!content.includes("mock.module(")) continue;

	const lines = content.split("\n");

	// Find indices of mock.module lines and dynamic import lines
	const mockModuleLines: number[] = [];
	const dynamicImportLines: number[] = [];

	for (let i = 0; i < lines.length; i++) {
		const line = lines[i];
		if (line.includes("mock.module(")) {
			mockModuleLines.push(i);
		}
		if (/^const\s+\{.*\}\s*=\s*await\s+import\(/.test(line.trimStart())) {
			dynamicImportLines.push(i);
		}
	}

	if (mockModuleLines.length === 0 || dynamicImportLines.length === 0) continue;

	const firstMockModule = mockModuleLines[0];
	const lastMockModule = mockModuleLines[mockModuleLines.length - 1];

	// Find dynamic imports that are BEFORE the first mock.module
	const importsToMove = dynamicImportLines.filter((idx) => idx < firstMockModule);

	if (importsToMove.length === 0) continue;

	// Find the end of the last mock.module block (could be multi-line)
	let insertAfter = lastMockModule;
	// Walk forward to find the end of the mock.module statement
	let parenDepth = 0;
	let foundStart = false;
	for (let i = lastMockModule; i < lines.length; i++) {
		const line = lines[i];
		for (const ch of line) {
			if (ch === "(") {
				parenDepth++;
				foundStart = true;
			}
			if (ch === ")") parenDepth--;
		}
		if (foundStart && parenDepth === 0) {
			insertAfter = i;
			break;
		}
	}

	// Extract lines to move
	const linesToMove = importsToMove.map((idx) => lines[idx]);

	// Remove the lines (in reverse order to keep indices valid)
	for (let i = importsToMove.length - 1; i >= 0; i--) {
		lines.splice(importsToMove[i], 1);
		// Adjust insertAfter if needed
		if (importsToMove[i] <= insertAfter) {
			insertAfter--;
		}
	}

	// Insert after the last mock.module
	lines.splice(insertAfter + 1, 0, ...linesToMove);

	const newContent = lines.join("\n");
	if (newContent !== original) {
		writeFileSync(file, newContent);
		totalChanged++;
		console.log(`✅ ${file}: moved ${linesToMove.length} import(s) after mock.module`);
	}
}

console.log(`\n📊 Pass 3 Summary: ${totalChanged} files changed`);
