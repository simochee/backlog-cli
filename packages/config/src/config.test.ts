import consola from "consola";
import { readUser, writeUser } from "rc9";
import { beforeEach, describe, expect, it, type Mock, vi } from "vitest";
import { loadConfig, writeConfig } from "#config.ts";

vi.mock("rc9", () => ({
	readUser: vi.fn(),
	writeUser: vi.fn(),
}));

describe("loadConfig", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

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
		expect(config.spaces[0].host).toBe("example.backlog.com");
	});

	it("returns empty spaces array when rc file is empty", async () => {
		(readUser as Mock).mockResolvedValue({});

		const config = await loadConfig();

		expect(config.spaces).toEqual([]);
		expect(config.defaultSpace).toBeUndefined();
	});

	it("exits process when config validation fails", async () => {
		const exitSpy = vi
			.spyOn(process, "exit")
			.mockImplementation(() => undefined as never);
		const errorSpy = vi.spyOn(consola, "error").mockImplementation(() => {});

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
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("writes config to rc file", async () => {
		const config = {
			defaultSpace: "example.backlog.com",
			spaces: [
				{
					host: "example.backlog.com" as const,
					auth: { method: "api-key" as const, apiKey: "abc123" },
				},
			],
		};

		await writeConfig(config);

		expect(writeUser).toHaveBeenCalledWith(config, { name: "backlog" });
	});
});
