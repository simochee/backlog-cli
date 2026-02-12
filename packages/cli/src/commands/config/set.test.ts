import mockConsola from "@repo/test-utils/mock-consola";
import { beforeEach, describe, expect, it, mock, spyOn } from "bun:test";

mock.module("@repo/config", () => ({
	loadConfig: mock(),
	writeConfig: mock(),
	addSpace: mock(),
	findSpace: mock(),
	removeSpace: mock(),
	resolveSpace: mock(),
	updateSpaceAuth: mock(),
}));

mock.module("consola", () => ({ default: mockConsola }));

const { resolveKey, WRITABLE_KEYS } = await import("#commands/config/set.ts");
const { loadConfig, writeConfig } = await import("@repo/config");
const { default: consola } = await import("consola");

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
	beforeEach(() => {});

	it("run() で defaultSpace を設定する", async () => {
		(loadConfig as any).mockResolvedValue({
			spaces: [{ host: "example.backlog.com", auth: { method: "api-key", apiKey: "key" } }],
		} as never);
		const exitSpy = spyOn(process, "exit").mockImplementation(() => undefined as never);

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

	it("run() で --space 指定時にエラーを返す", async () => {
		const exitSpy = spyOn(process, "exit").mockImplementation(() => undefined as never);

		const mod = await import("#commands/config/set.ts");
		await mod.default.run?.({
			args: { key: "defaultSpace", value: "foo", space: "foo" },
		} as never);

		expect(consola.error).toHaveBeenCalledWith("Space-specific config is managed by `bl auth` commands.");
		expect(exitSpy).toHaveBeenCalledWith(1);
		exitSpy.mockRestore();
	});

	it("run() で書き込み不可のキーでエラーを返す", async () => {
		const exitSpy = spyOn(process, "exit").mockImplementation(() => undefined as never);

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
		(loadConfig as any).mockResolvedValue({
			spaces: [{ host: "example.backlog.com", auth: { method: "api-key", apiKey: "key" } }],
		} as never);
		const exitSpy = spyOn(process, "exit").mockImplementation(() => undefined as never);

		const mod = await import("#commands/config/set.ts");
		await mod.default.run?.({
			args: { key: "default_space", value: "nonexistent.backlog.com" },
		} as never);

		expect(consola.error).toHaveBeenCalledWith(
			'Space "nonexistent.backlog.com" is not authenticated. Run `bl auth login` first.',
		);
		expect(exitSpy).toHaveBeenCalledWith(1);
		expect(writeConfig).not.toHaveBeenCalled();
		exitSpy.mockRestore();
	});
});
