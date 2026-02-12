#!/usr/bin/env bun
/**
 * Vitest → bun:test migration script
 *
 * Transforms:
 * 1. `from "vitest"` → `from "bun:test"`
 * 2. `vi.mock(...)` → `mock.module(...)`
 * 3. `vi.fn()` → `mock()`
 * 4. `vi.mocked(fn)` → `(fn as any)` (runtime cast)
 * 5. `vi.spyOn(...)` → `spyOn(...)`
 * 6. `vi.clearAllMocks()` → remove (handled per-test)
 * 7. Static imports of mocked modules → dynamic imports
 * 8. `toBeTypeOf("x")` → `expect(typeof x).toBe("x")`
 * 9. Handle consola mock pattern
 */

import { Glob } from "bun";
import { readFileSync, writeFileSync } from "node:fs";

const glob = new Glob("packages/{config,api,cli}/src/**/*.test.ts");
const files = Array.from(glob.scanSync("."));

let totalChanged = 0;
let totalSkipped = 0;

for (const file of files) {
	let content = readFileSync(file, "utf-8");
	const original = content;

	// Skip if already using bun:test
	if (content.includes('from "bun:test"')) {
		totalSkipped++;
		continue;
	}

	// Skip if no vitest import
	if (!content.includes('from "vitest"')) {
		totalSkipped++;
		continue;
	}

	// ─── Step 1: Collect mocked module specifiers ───
	const mockedModules = new Set<string>();
	const mockCallRegex = /vi\.mock\(["']([^"']+)["']/g;
	let match: RegExpExecArray | null;
	while ((match = mockCallRegex.exec(content)) !== null) {
		mockedModules.add(match[1]);
	}

	// ─── Step 2: Detect which vi.* features are used ───
	const usesMock = content.includes("vi.mock(") || content.includes("vi.fn(") || content.includes("vi.fn()");
	const usesSpyOn = content.includes("vi.spyOn(");
	const usesMocked = content.includes("vi.mocked(");
	const hasConsolaMock = content.includes('vi.mock("consola"');

	// ─── Step 3: Replace vitest import ───
	content = content.replace(/import\s*\{([^}]+)\}\s*from\s*["']vitest["'];?\n?/, (_match, imports: string) => {
		const items = imports
			.split(",")
			.map((s: string) => s.trim())
			.filter(Boolean);
		const bunItems: string[] = [];

		for (const item of items) {
			if (item === "vi") continue;
			if (item === "type Mock") continue;
			bunItems.push(item);
		}

		if (usesMock && !bunItems.includes("mock")) {
			bunItems.push("mock");
		}
		if (usesSpyOn && !bunItems.includes("spyOn")) {
			bunItems.push("spyOn");
		}

		return `import { ${bunItems.join(", ")} } from "bun:test";\n`;
	});

	// ─── Step 4: Add mockConsola import if consola is mocked ───
	if (hasConsolaMock) {
		const bunTestImportIdx = content.indexOf('from "bun:test"');
		if (bunTestImportIdx !== -1) {
			const lineStart = content.lastIndexOf("\n", bunTestImportIdx) + 1;
			const lineEnd = content.indexOf("\n", bunTestImportIdx);
			const bunTestLine = content.substring(lineStart, lineEnd + 1);
			if (!content.includes("import mockConsola from")) {
				content =
					content.substring(0, lineStart) +
					'import mockConsola from "@repo/test-utils/mock-consola";\n' +
					bunTestLine +
					content.substring(lineEnd + 1);
			}
		}
	}

	// ─── Step 5: Convert vi.mock() to mock.module() ───
	// Handle consola mock with dynamic import pattern
	content = content.replace(
		/vi\.mock\(["']([^"']+)["'],\s*\(\)\s*=>\s*import\(["']@repo\/test-utils\/mock-consola["']\)\);?\n?/g,
		'mock.module("$1", () => ({ default: mockConsola }));\n',
	);

	// Replace remaining vi.mock( with mock.module(
	content = content.replace(/vi\.mock\(/g, "mock.module(");

	// ─── Step 6: Replace vi.fn() with mock() ───
	content = content.replace(/vi\.fn\(\)/g, "mock()");
	content = content.replace(/vi\.fn\((\()/g, "mock($1");

	// ─── Step 7: Replace vi.mocked() ───
	if (usesMocked) {
		content = content.replace(/vi\.mocked\(([a-zA-Z_$][\w$.]*)\)/g, "($1 as any)");
	}

	// ─── Step 8: Replace vi.spyOn() ───
	content = content.replace(/vi\.spyOn\(/g, "spyOn(");

	// ─── Step 9: Replace vi.clearAllMocks() ───
	content = content.replace(/\tvi\.clearAllMocks\(\);\n/g, "");
	content = content.replace(/\t\tvi\.clearAllMocks\(\);\n/g, "");
	// Clean up empty beforeEach
	content = content.replace(/\tbeforeEach\(\(\) => \{\n\t\}\);\n\n?/g, "");

	// ─── Step 10: Convert static imports of mocked modules to dynamic ───
	for (const mod of mockedModules) {
		const escapedMod = mod.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

		// Named imports: import { a, b } from "module";
		const namedImportRegex = new RegExp(`import\\s*\\{([^}]+)\\}\\s*from\\s*["']${escapedMod}["'];?\\n?`);
		const namedMatch = content.match(namedImportRegex);
		if (namedMatch) {
			const names = namedMatch[1].trim();
			content = content.replace(namedImportRegex, `const { ${names} } = await import("${mod}");\n`);
		}

		// Default imports: import name from "module";
		const defaultImportRegex = new RegExp(`import\\s+([a-zA-Z_$][\\w$]*)\\s+from\\s*["']${escapedMod}["'];?\\n?`);
		const defaultMatch = content.match(defaultImportRegex);
		if (defaultMatch) {
			const name = defaultMatch[1];
			if (name !== "mockConsola") {
				content = content.replace(defaultImportRegex, `const { default: ${name} } = await import("${mod}");\n`);
			}
		}
	}

	// ─── Step 11: Handle toBeTypeOf ───
	content = content.replace(/expect\(([^)]+)\)\.toBeTypeOf\(["']([^"']+)["']\)/g, 'expect(typeof $1).toBe("$2")');

	// ─── Step 12: Handle ReturnType<typeof vi.spyOn> ───
	content = content.replace(/ReturnType<typeof vi\.spyOn>/g, "ReturnType<typeof spyOn>");

	// ─── Step 13: Remove const alias = vi.mocked(x) ───
	content = content.replace(/const\s+(\w+)\s*=\s*\((\w+)\s+as\s+any\);?\n/g, "const $1 = $2 as any;\n");

	// ─── Step 14: Warn remaining vi. references ───
	if (content.includes("vi.")) {
		const remainingVi = content.match(/vi\.\w+/g);
		if (remainingVi) {
			console.warn(`⚠️  ${file}: Remaining vi.* usage: ${[...new Set(remainingVi)].join(", ")}`);
		}
	}

	if (content !== original) {
		writeFileSync(file, content);
		totalChanged++;
		console.log(`✅ ${file}`);
	} else {
		totalSkipped++;
	}
}

console.log(`\n📊 Summary: ${totalChanged} files changed, ${totalSkipped} files skipped`);
