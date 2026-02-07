import { describe, expect, it } from "vitest";
import { formatBytes } from "#commands/space/disk-usage.ts";

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
		expect(formatBytes(1048576)).toBe("1.0 MB");
		expect(formatBytes(5242880)).toBe("5.0 MB");
	});

	it("GB 単位をフォーマットする", () => {
		expect(formatBytes(1073741824)).toBe("1.0 GB");
	});

	it("TB 単位をフォーマットする", () => {
		expect(formatBytes(1099511627776)).toBe("1.0 TB");
	});
});
