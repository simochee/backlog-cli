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

const { getNestedValue, resolveKey } = await import("#commands/config/get.ts");
const { loadConfig } = await import("@repo/config");
const { default: consola } = await import("consola");

describe("getNestedValue", () => {
	it("浅いキーで値を取得する", () => {
		expect(getNestedValue({ a: 1 }, "a")).toBe(1);
	});

	it("ネストしたキーで値を取得する", () => {
		expect(getNestedValue({ a: { b: 2 } }, "a.b")).toBe(2);
	});

	it("存在しないキーで undefined を返す", () => {
		expect(getNestedValue({ a: 1 }, "x")).toBeUndefined();
	});

	it("中間値が null の場合 undefined を返す", () => {
		expect(getNestedValue({ a: null } as Record<string, unknown>, "a.b")).toBeUndefined();
	});

	it("中間値が undefined の場合 undefined を返す", () => {
		expect(getNestedValue({}, "a.b")).toBeUndefined();
	});

	it("深くネストした値を取得する", () => {
		expect(getNestedValue({ a: { b: { c: 3 } } }, "a.b.c")).toBe(3);
	});

	it("オブジェクト値を返す", () => {
		const nested = { b: 2 };
		expect(getNestedValue({ a: nested }, "a")).toBe(nested);
	});
});

describe("resolveKey", () => {
	it("snake_case エイリアスを camelCase に変換する", () => {
		expect(resolveKey("default_space")).toBe("defaultSpace");
	});

	it("未知のキーはそのまま返す", () => {
		expect(resolveKey("pager")).toBe("pager");
	});

	it("camelCase キーはそのまま返す", () => {
		expect(resolveKey("defaultSpace")).toBe("defaultSpace");
	});
});

describe("config get run()", () => {
	beforeEach(() => {});

	it("グローバル設定値を取得する", async () => {
		(loadConfig as any).mockResolvedValue({
			spaces: [],
			defaultSpace: "example.backlog.com",
		} as never);

		const mod = await import("#commands/config/get.ts");
		await mod.default.run?.({
			args: { key: "default_space" },
		} as never);

		expect(consola.log).toHaveBeenCalledWith("example.backlog.com");
	});

	it("ネストした設定値をJSON出力する", async () => {
		const spaces = [{ host: "example.backlog.com", auth: { method: "api-key", apiKey: "key123" } }];
		(loadConfig as any).mockResolvedValue({
			spaces,
			defaultSpace: "example.backlog.com",
		} as never);

		const mod = await import("#commands/config/get.ts");
		await mod.default.run?.({
			args: { key: "spaces" },
		} as never);

		expect(consola.log).toHaveBeenCalledWith(JSON.stringify(spaces));
	});

	it("--space 指定時にスペース固有の値を取得する", async () => {
		(loadConfig as any).mockResolvedValue({
			spaces: [{ host: "example.backlog.com", auth: { method: "api-key", apiKey: "key123" } }],
			defaultSpace: "example.backlog.com",
		} as never);

		const mod = await import("#commands/config/get.ts");
		await mod.default.run?.({
			args: { key: "host", space: "example.backlog.com" },
		} as never);

		expect(consola.log).toHaveBeenCalledWith("example.backlog.com");
	});

	it("--space が見つからない場合 process.exit(1) を呼ぶ", async () => {
		(loadConfig as any).mockResolvedValue({
			spaces: [],
			defaultSpace: undefined,
		} as never);

		const exitSpy = spyOn(process, "exit").mockImplementation(() => undefined as never);

		const mod = await import("#commands/config/get.ts");
		await mod.default.run?.({
			args: { key: "host", space: "nonexistent.backlog.com" },
		} as never);

		expect(consola.error).toHaveBeenCalledWith('Space "nonexistent.backlog.com" not found in configuration.');
		expect(exitSpy).toHaveBeenCalledWith(1);

		exitSpy.mockRestore();
	});

	it("未定義キーは何も出力しない", async () => {
		(loadConfig as any).mockResolvedValue({
			spaces: [],
			defaultSpace: undefined,
		} as never);

		const mod = await import("#commands/config/get.ts");
		await mod.default.run?.({
			args: { key: "nonexistent_key" },
		} as never);

		expect(consola.log).not.toHaveBeenCalled();
	});
});
