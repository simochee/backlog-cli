import { parseField } from "#commands/api.ts";
import { describe, expect, it } from "vitest";

describe("parseField", () => {
	it("key=value 形式の文字列をパースする", () => {
		expect(parseField("name=test")).toEqual(["name", "test"]);
	});

	it("= がない場合はキーのみで値を true にする", () => {
		expect(parseField("verbose")).toEqual(["verbose", true]);
	});

	it("true をブール値に変換する", () => {
		expect(parseField("enabled=true")).toEqual(["enabled", true]);
	});

	it("false をブール値に変換する", () => {
		expect(parseField("enabled=false")).toEqual(["enabled", false]);
	});

	it("数値文字列を数値に変換する", () => {
		expect(parseField("count=42")).toEqual(["count", 42]);
	});

	it("小数を数値に変換する", () => {
		expect(parseField("ratio=3.14")).toEqual(["ratio", 3.14]);
	});

	it("負の数を数値に変換する", () => {
		expect(parseField("offset=-10")).toEqual(["offset", -10]);
	});

	it("空文字列は文字列として扱う", () => {
		expect(parseField("value=")).toEqual(["value", ""]);
	});

	it("値に = を含む場合は最初の = で分割する", () => {
		expect(parseField("query=a=b")).toEqual(["query", "a=b"]);
	});

	it("非数値文字列をそのまま返す", () => {
		expect(parseField("status=open")).toEqual(["status", "open"]);
	});

	it("0 を数値に変換する", () => {
		expect(parseField("page=0")).toEqual(["page", 0]);
	});
});
