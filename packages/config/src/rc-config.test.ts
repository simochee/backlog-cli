import { spyOnProcessExit } from "@repo/test-utils";
import { describe, expect, it, mock, spyOn } from "bun:test";

mock.module("rc9", () => ({
	readUser: mock(),
	writeUser: mock(),
}));
const { loadConfig, writeConfig } = await import("#config.ts");
const { default: consola } = await import("consola");
const { readUser, writeUser } = await import("rc9");

describe("loadConfig", () => {
	it("returns validated config when rc file is valid", async () => {
		(readUser as Mock).mockResolvedValue({
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
		(readUser as Mock).mockResolvedValue({});

		const config = await loadConfig();

		expect(config.spaces).toEqual([]);
		expect(config.defaultSpace).toBeUndefined();
	});

	it("exits process when config validation fails", async () => {
		const exitSpy = spyOnProcessExit();
		const errorSpy = spyOn(consola, "error").mockImplementation(() => {});

		(readUser as Mock).mockResolvedValue({
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
