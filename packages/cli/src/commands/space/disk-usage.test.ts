import { formatBytes } from "#commands/space/disk-usage.ts";
import { describe, expect, it } from "vitest";

describe("formatBytes", () => {
	it("0 バイトを正しくフォーマットする", () => {
		expect(formatBytes(0)).toBe("0 B");
	});

	it("バイト単位をフォーマットする", () => {
		expect(formatBytes(500)).toBe("500.0 B");
	});

	it("KB 単位をフォーマットする", () => {
		expect(formatBytes(1024)).toBe("1.0 KB");
		expect(formatBytes(1536)).toBe("1.5 KB");
	});

	it("MB 単位をフォーマットする", () => {
		expect(formatBytes(1_048_576)).toBe("1.0 MB");
		expect(formatBytes(5_242_880)).toBe("5.0 MB");
	});

	it("GB 単位をフォーマットする", () => {
		expect(formatBytes(1_073_741_824)).toBe("1.0 GB");
	});

	it("TB 単位をフォーマットする", () => {
		expect(formatBytes(1_099_511_627_776)).toBe("1.0 TB");
	});
});
