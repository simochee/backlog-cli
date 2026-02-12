import { DEFAULT_PRIORITY_ID, PRIORITY, PR_STATUS, RESOLUTION } from "#types.ts";
import { describe, expect, it } from "bun:test";

describe("PRIORITY", () => {
	it("固定の優先度 ID を持つ", () => {
		expect(PRIORITY).toStrictEqual({ High: 2, Normal: 3, Low: 4 });
	});
});

describe("DEFAULT_PRIORITY_ID", () => {
	it("Normal (3) がデフォルト", () => {
		expect(DEFAULT_PRIORITY_ID).toBe(3);
	});
});

describe("RESOLUTION", () => {
	it("固定の完了理由 ID を持つ", () => {
		expect(RESOLUTION).toStrictEqual({
			Fixed: 0,
			WontFix: 1,
			Invalid: 2,
			Duplicate: 3,
			CannotReproduce: 4,
		});
	});
});

describe("PR_STATUS", () => {
	it("固定の PR ステータス ID を持つ", () => {
		expect(PR_STATUS).toStrictEqual({ Open: 1, Closed: 2, Merged: 3 });
	});
});
