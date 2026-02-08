import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("#config.ts", () => ({
	loadConfig: vi.fn(),
	writeConfig: vi.fn(),
}));

import { loadConfig, writeConfig } from "#config.ts";
import { addSpace, removeSpace, resolveSpace, updateSpaceAuth } from "#space.ts";

const mockLoadConfig = vi.mocked(loadConfig);
const mockWriteConfig = vi.mocked(writeConfig);

const makeSpace = (host: string) => ({
	host: host as `${string}.backlog.${"com" | "jp"}`,
	auth: { method: "api-key" as const, apiKey: "key123" },
});

const makeConfig = (spaces: ReturnType<typeof makeSpace>[], defaultSpace?: string) => ({
	spaces,
	defaultSpace,
	aliases: {} as Record<string, string>,
});

describe("addSpace", () => {
	it("adds a new space to config", async () => {
		mockLoadConfig.mockResolvedValue(makeConfig([]));

		const newSpace = makeSpace("new.backlog.com");
		await addSpace(newSpace);

		expect(mockWriteConfig).toHaveBeenCalledWith(
			expect.objectContaining({
				spaces: [newSpace],
			}),
		);
	});

	it("throws if space with same host already exists", async () => {
		const existing = makeSpace("existing.backlog.com");
		mockLoadConfig.mockResolvedValue(makeConfig([existing]));

		await expect(addSpace(makeSpace("existing.backlog.com"))).rejects.toThrow(
			'Space with host "existing.backlog.com" already exists',
		);
	});
});

describe("removeSpace", () => {
	it("removes an existing space", async () => {
		const space1 = makeSpace("one.backlog.com");
		const space2 = makeSpace("two.backlog.com");
		mockLoadConfig.mockResolvedValue(makeConfig([space1, space2]));

		await removeSpace("one.backlog.com");

		expect(mockWriteConfig).toHaveBeenCalledWith(
			expect.objectContaining({
				spaces: [space2],
			}),
		);
	});

	it("clears defaultSpace when removing the default space", async () => {
		const space = makeSpace("default.backlog.com");
		mockLoadConfig.mockResolvedValue(makeConfig([space], "default.backlog.com"));

		await removeSpace("default.backlog.com");

		expect(mockWriteConfig).toHaveBeenCalledWith(
			expect.objectContaining({
				defaultSpace: undefined,
			}),
		);
	});

	it("keeps defaultSpace when removing a non-default space", async () => {
		const space1 = makeSpace("one.backlog.com");
		const space2 = makeSpace("two.backlog.com");
		mockLoadConfig.mockResolvedValue(makeConfig([space1, space2], "one.backlog.com"));

		await removeSpace("two.backlog.com");

		expect(mockWriteConfig).toHaveBeenCalledWith(
			expect.objectContaining({
				defaultSpace: "one.backlog.com",
			}),
		);
	});

	it("throws if space not found", async () => {
		mockLoadConfig.mockResolvedValue(makeConfig([]));

		await expect(removeSpace("missing.backlog.com")).rejects.toThrow('Space with host "missing.backlog.com" not found');
	});
});

describe("updateSpaceAuth", () => {
	it("updates auth for an existing space", async () => {
		const space = makeSpace("target.backlog.com");
		mockLoadConfig.mockResolvedValue(makeConfig([space]));

		const newAuth = {
			method: "oauth" as const,
			accessToken: "new-access",
			refreshToken: "new-refresh",
		};

		await updateSpaceAuth("target.backlog.com", newAuth);

		expect(mockWriteConfig).toHaveBeenCalledWith(
			expect.objectContaining({
				spaces: [{ host: "target.backlog.com", auth: newAuth }],
			}),
		);
	});

	it("throws if space not found", async () => {
		mockLoadConfig.mockResolvedValue(makeConfig([]));

		await expect(
			updateSpaceAuth("missing.backlog.com", {
				method: "api-key",
				apiKey: "key",
			}),
		).rejects.toThrow('Space with host "missing.backlog.com" not found');
	});
});

describe("resolveSpace", () => {
	beforeEach(() => {
		delete process.env["BACKLOG_SPACE"];
	});

	it("returns space matching explicit host", async () => {
		const space = makeSpace("explicit.backlog.com");
		mockLoadConfig.mockResolvedValue(makeConfig([space]));

		const result = await resolveSpace("explicit.backlog.com");

		expect(result).toEqual(space);
	});

	it("returns space matching BACKLOG_SPACE env var", async () => {
		const space = makeSpace("env.backlog.com");
		mockLoadConfig.mockResolvedValue(makeConfig([space]));
		process.env["BACKLOG_SPACE"] = "env.backlog.com";

		const result = await resolveSpace();

		expect(result).toEqual(space);
	});

	it("returns space matching defaultSpace config", async () => {
		const space = makeSpace("default.backlog.com");
		mockLoadConfig.mockResolvedValue(makeConfig([space], "default.backlog.com"));

		const result = await resolveSpace();

		expect(result).toEqual(space);
	});

	it("prioritizes explicit host over env and default", async () => {
		const explicit = makeSpace("explicit.backlog.com");
		const env = makeSpace("env.backlog.com");
		mockLoadConfig.mockResolvedValue(makeConfig([explicit, env], "env.backlog.com"));
		process.env["BACKLOG_SPACE"] = "env.backlog.com";

		const result = await resolveSpace("explicit.backlog.com");

		expect(result).toEqual(explicit);
	});

	it("returns null when no host is resolvable", async () => {
		mockLoadConfig.mockResolvedValue(makeConfig([]));

		const result = await resolveSpace();

		expect(result).toBeNull();
	});

	it("returns null when host is specified but not found", async () => {
		mockLoadConfig.mockResolvedValue(makeConfig([]));

		const result = await resolveSpace("missing.backlog.com");

		expect(result).toBeNull();
	});
});
