import { describe, expect, it } from "vitest";
import { resolveKey, WRITABLE_KEYS } from "#commands/config/set.ts";

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
		expect(WRITABLE_KEYS.has("defaultSpace")).toBe(true);
	});

	it("未知のキーは書き込み可能キーに含まれない", () => {
		expect(WRITABLE_KEYS.has("unknownKey")).toBe(false);
	});
});
