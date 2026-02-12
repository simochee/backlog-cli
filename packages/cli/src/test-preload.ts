import { beforeEach } from "bun:test";

/**
 * CLI-specific test preload that clears mock.module-created mock functions
 * between tests. bun:test's mock.module creates shared mock instances that
 * accumulate call counts across tests unless explicitly cleared.
 */

function clearModuleMocks(mod: Record<string, unknown>) {
	for (const val of Object.values(mod)) {
		if (typeof val === "function" && typeof (val as any).mockClear === "function") {
			(val as any).mockClear();
		}
	}
}

const moduleCache = new Map<string, Record<string, unknown>>();

async function getModule(specifier: string): Promise<Record<string, unknown> | null> {
	const cached = moduleCache.get(specifier);
	if (cached) return cached;
	try {
		const mod = await import(specifier);
		moduleCache.set(specifier, mod);
		return mod;
	} catch {
		return null;
	}
}

// All modules commonly mocked in CLI test files
const MOCKED_MODULES = [
	"@repo/api",
	"@repo/config",
	"#utils/client.ts",
	"#utils/resolve.ts",
	"#utils/format.ts",
	"#utils/url.ts",
	"#utils/prompt.ts",
	"#utils/oauth-callback.ts",
];

beforeEach(async () => {
	const modules = await Promise.all(MOCKED_MODULES.map(getModule));
	for (const mod of modules) {
		if (mod) clearModuleMocks(mod);
	}
});
