#!/usr/bin/env bun
/**
 * Migration Pass 2: Convert remaining static imports to dynamic imports
 * in files that use mock.module().
 *
 * In bun:test, mock.module() runs AFTER static imports are resolved.
 * So any module that depends on a mocked module must be dynamically imported.
 * This pass converts ALL remaining static imports (except bun:test and test utils)
 * to dynamic imports in files that have mock.module() calls.
 */

import { Glob } from "bun";
import { readFileSync, writeFileSync } from "node:fs";

const glob = new Glob("packages/{config,api,cli}/src/**/*.test.ts");
const files = Array.from(glob.scanSync("."));

const SAFE_IMPORTS = new Set([
	"bun:test",
	"@repo/test-utils",
	"@repo/test-utils/mock-consola",
	"@repo/test-utils/setup",
	"arktype",
]);

let totalChanged = 0;

for (const file of files) {
	let content = readFileSync(file, "utf-8");
	const original = content;

	// Only process files that use mock.module
	if (!content.includes("mock.module(")) {
		continue;
	}

	// Find remaining static imports that aren't safe
	const staticImportRegex = /^import\s+(?:\{[^}]+\}|(\w+))\s+from\s*["']([^"']+)["'];?\s*$/gm;
	let match: RegExpExecArray | null;
	const toConvert: Array<{ full: string; names: string; modulePath: string; isDefault: boolean }> = [];

	while ((match = staticImportRegex.exec(content)) !== null) {
		const modulePath = match[2];
		if (SAFE_IMPORTS.has(modulePath)) continue;

		const fullMatch = match[0];
		const isDefault = !!match[1];

		if (isDefault) {
			toConvert.push({
				full: fullMatch,
				names: match[1],
				modulePath,
				isDefault: true,
			});
		} else {
			const namedMatch = fullMatch.match(/import\s*\{([^}]+)\}/);
			if (namedMatch) {
				toConvert.push({
					full: fullMatch,
					names: namedMatch[1].trim(),
					modulePath,
					isDefault: false,
				});
			}
		}
	}

	for (const { full, names, modulePath, isDefault } of toConvert) {
		if (isDefault) {
			content = content.replace(full + "\n", `const { default: ${names} } = await import("${modulePath}");\n`);
			content = content.replace(full, `const { default: ${names} } = await import("${modulePath}");`);
		} else {
			content = content.replace(full + "\n", `const { ${names} } = await import("${modulePath}");\n`);
			content = content.replace(full, `const { ${names} } = await import("${modulePath}");`);
		}
	}

	if (content !== original) {
		writeFileSync(file, content);
		totalChanged++;
		if (toConvert.length > 0) {
			console.log(`✅ ${file}: converted ${toConvert.map((c) => c.modulePath).join(", ")}`);
		}
	}
}

console.log(`\n📊 Pass 2 Summary: ${totalChanged} files changed`);
