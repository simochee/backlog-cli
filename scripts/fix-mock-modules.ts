/**
 * Fix mock.module calls for @repo/api and @repo/config to be comprehensive.
 *
 * bun:test's mock.module() is global across test files. When different files mock
 * the same module with different subsets of exports, the "winning" mock may not
 * include exports needed by other files. This script updates all mock.module calls
 * to include ALL value exports for each module.
 */
import { Glob } from "bun";
import { readFile, writeFile } from "node:fs/promises";

const CLI_SRC = new URL("../packages/cli/src", import.meta.url).pathname;

// Comprehensive mock replacements
const REPO_API_MOCK = `mock.module("@repo/api", () => ({
	createClient: mock(),
	formatResetTime: mock(),
	exchangeAuthorizationCode: mock(),
	refreshAccessToken: mock(),
	DEFAULT_PRIORITY_ID: 3,
	PR_STATUS: { Open: 1, Closed: 2, Merged: 3 },
	PRIORITY: { High: 2, Normal: 3, Low: 4 },
	RESOLUTION: { Fixed: 0, WontFix: 1, Invalid: 2, Duplicate: 3, CannotReproduce: 4 },
}));`;

const REPO_CONFIG_MOCK = `mock.module("@repo/config", () => ({
	loadConfig: mock(),
	writeConfig: mock(),
	addSpace: mock(),
	findSpace: mock(),
	removeSpace: mock(),
	resolveSpace: mock(),
	updateSpaceAuth: mock(),
}));`;

// Pattern to match mock.module("@repo/api", ...) - handles multi-line
const API_PATTERN = /mock\.module\("@repo\/api",\s*\(\)\s*=>\s*\(\{[\s\S]*?\}\)\);/;
const CONFIG_PATTERN = /mock\.module\("@repo\/config",\s*\(\)\s*=>\s*\(\{[\s\S]*?\}\)\);/;

let apiCount = 0;
let configCount = 0;

const glob = new Glob("**/*.test.ts");
for await (const path of glob.scan(CLI_SRC)) {
	const fullPath = `${CLI_SRC}/${path}`;
	let content = await readFile(fullPath, "utf-8");
	let modified = false;

	if (API_PATTERN.test(content)) {
		content = content.replace(API_PATTERN, REPO_API_MOCK);
		modified = true;
		apiCount++;
		console.log(`[api] ${path}`);
	}

	if (CONFIG_PATTERN.test(content)) {
		content = content.replace(CONFIG_PATTERN, REPO_CONFIG_MOCK);
		modified = true;
		configCount++;
		console.log(`[config] ${path}`);
	}

	if (modified) {
		await writeFile(fullPath, content);
	}
}

console.log(`\nUpdated ${apiCount} @repo/api mocks, ${configCount} @repo/config mocks`);
