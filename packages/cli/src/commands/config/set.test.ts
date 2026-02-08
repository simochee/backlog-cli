import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@repo/config", () => ({
	loadConfig: vi.fn(),
	writeConfig: vi.fn(),
}));

vi.mock("consola", () => ({
	default: {
		success: vi.fn(),
		error: vi.fn(),
		info: vi.fn(),
	},
}));

import { resolveKey, WRITABLE_KEYS } from "#commands/config/set.ts";
import { loadConfig, writeConfig } from "@repo/config";
import consola from "consola";

describe("resolveKey", () => {
	it("snake_case エイリアスを camelCase に変換する", () => {
		expect(resolveKey("default_space")).toBe("defaultSpace");
	});

	it("未知のキーはそのまま返す", () => {
		expect(resolveKey("unknown_key")).toBe("unknown_key");
	});

	it("camelCase キーはそのまま返す", () => {
		expect(resolveKey("defaultSpace")).toBe("defaultSpace");
	});
});

describe("WRITABLE_KEYS", () => {
	it("defaultSpace が書き込み可能キーに含まれる", () => {
		expect(WRITABLE_KEYS.has("defaultSpace")).toBeTruthy();
	});

	it("未知のキーは書き込み可能キーに含まれない", () => {
		expect(WRITABLE_KEYS.has("unknownKey")).toBeFalsy();
	});
});

describe("config set run()", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("run() で defaultSpace を設定する", async () => {
		vi.mocked(loadConfig).mockResolvedValue({
			spaces: [{ host: "example.backlog.com", auth: { method: "api-key", apiKey: "key" } }],
		} as never);
		const exitSpy = vi.spyOn(process, "exit").mockImplementation(() => undefined as never);

		const mod = await import("#commands/config/set.ts");
		await mod.default.run?.({
			args: { key: "default_space", value: "example.backlog.com" },
		} as never);

		expect(writeConfig).toHaveBeenCalledWith({
			spaces: [{ host: "example.backlog.com", auth: { method: "api-key", apiKey: "key" } }],
			defaultSpace: "example.backlog.com",
		});
		expect(consola.success).toHaveBeenCalledWith("Set default_space to example.backlog.com");
		exitSpy.mockRestore();
	});

	it("run() で hostname 指定時にエラーを返す", async () => {
		const exitSpy = vi.spyOn(process, "exit").mockImplementation(() => undefined as never);

		const mod = await import("#commands/config/set.ts");
		await mod.default.run?.({
			args: { key: "defaultSpace", value: "foo", hostname: "foo" },
		} as never);

		expect(consola.error).toHaveBeenCalledWith("Space-specific config is managed by `backlog auth` commands.");
		expect(exitSpy).toHaveBeenCalledWith(1);
		exitSpy.mockRestore();
	});

	it("run() で書き込み不可のキーでエラーを返す", async () => {
		const exitSpy = vi.spyOn(process, "exit").mockImplementation(() => undefined as never);

		const mod = await import("#commands/config/set.ts");
		await mod.default.run?.({
			args: { key: "unknownKey", value: "someValue" },
		} as never);

		expect(consola.error).toHaveBeenCalledWith("Unknown or read-only config key: unknownKey");
		expect(consola.info).toHaveBeenCalled();
		expect(exitSpy).toHaveBeenCalledWith(1);
		exitSpy.mockRestore();
	});

	it("run() で存在しないスペースを defaultSpace に設定しようとするとエラー", async () => {
		vi.mocked(loadConfig).mockResolvedValue({
			spaces: [{ host: "example.backlog.com", auth: { method: "api-key", apiKey: "key" } }],
		} as never);
		const exitSpy = vi.spyOn(process, "exit").mockImplementation(() => undefined as never);

		const mod = await import("#commands/config/set.ts");
		await mod.default.run?.({
			args: { key: "default_space", value: "nonexistent.backlog.com" },
		} as never);

		expect(consola.error).toHaveBeenCalledWith(
			'Space "nonexistent.backlog.com" is not authenticated. Run `backlog auth login` first.',
		);
		expect(exitSpy).toHaveBeenCalledWith(1);
		expect(writeConfig).not.toHaveBeenCalled();
		exitSpy.mockRestore();
	});
});
