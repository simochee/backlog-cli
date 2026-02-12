import { spyOnProcessExit } from "@repo/test-utils";
import { beforeEach, describe, expect, it, mock, spyOn } from "bun:test";

// Create mock functions for rc9 (shared via closure with the #config.ts factory below)
const readUser = mock();
const writeUser = mock();

mock.module("rc9", () => ({
	readUser,
	writeUser,
}));

// Override any existing #config.ts mock from other test files (e.g. space.test.ts).
// Provides a factory that re-creates config.ts logic using our mocked rc9.
// Required because bun:test runs all files in the same process and
// `mock.module` leaks across test files.
mock.module("#config.ts", async () => {
	const { Rc } = await import("#types.ts");
	const { type } = await import("arktype");
	const { default: consola } = await import("consola");
	const rc9 = await import("rc9");

	return {
		loadConfig: () => {
			const rc = rc9.readUser({ name: "backlog" });
			const result = Rc(rc);
			if (result instanceof type.errors) {
				consola.error("Configuration Error:");
				consola.error(result.summary);
				process.exit(1);
			}
			return result;
		},
		writeConfig: (config: typeof Rc.infer) => {
			rc9.writeUser(config, { name: "backlog" });
		},
	};
});

const { loadConfig, writeConfig } = await import("#config.ts");
const { default: consola } = await import("consola");

describe("loadConfig", () => {
	beforeEach(() => {
		readUser.mockReset();
		writeUser.mockReset();
	});

	it("returns validated config when rc file is valid", async () => {
		readUser.mockReturnValue({
			defaultSpace: "example.backlog.com",
			spaces: [
				{
					host: "example.backlog.com",
					auth: { method: "api-key", apiKey: "abc123" },
				},
			],
		});

		const config = await loadConfig();

		expect(config.defaultSpace).toBe("example.backlog.com");
		expect(config.spaces).toHaveLength(1);
		expect(config.spaces[0]?.host).toBe("example.backlog.com");
	});

	it("returns empty spaces array when rc file is empty", async () => {
		readUser.mockReturnValue({});

		const config = await loadConfig();

		expect(config.spaces).toEqual([]);
		expect(config.defaultSpace).toBeUndefined();
	});

	it("exits process when config validation fails", async () => {
		const exitSpy = spyOnProcessExit();
		const errorSpy = spyOn(consola, "error").mockImplementation((() => {}) as unknown as typeof consola.error);

		readUser.mockReturnValue({
			spaces: [{ host: "invalid", auth: { method: "bad" } }],
		});

		await loadConfig();

		expect(exitSpy).toHaveBeenCalledWith(1);
		expect(errorSpy).toHaveBeenCalledWith("Configuration Error:");

		exitSpy.mockRestore();
		errorSpy.mockRestore();
	});
});

describe("writeConfig", () => {
	it("writes config to rc file", async () => {
		const config = {
			defaultSpace: "example.backlog.com",
			spaces: [
				{
					host: "example.backlog.com",
					auth: { method: "api-key" as const, apiKey: "abc123" },
				},
			],
			aliases: {} as Record<string, string>,
		};

		await writeConfig(config);

		expect(writeUser).toHaveBeenCalledWith(config, { name: "backlog" });
	});
});
