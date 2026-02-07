import { describe, expect, it } from "vitest";
import { getNestedValue, resolveKey } from "#commands/config/get.ts";

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
		expect(
			getNestedValue({ a: null } as Record<string, unknown>, "a.b"),
		).toBeUndefined();
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
