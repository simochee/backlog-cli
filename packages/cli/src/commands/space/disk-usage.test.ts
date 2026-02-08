import { setupMockClient } from "@repo/test-utils";
import { describe, expect, it, vi } from "vitest";

vi.mock("#utils/client.ts", () => ({ getClient: vi.fn() }));
vi.mock("consola", () => import("@repo/test-utils/mock-consola"));

import { formatBytes } from "#commands/space/disk-usage.ts";
import { getClient } from "#utils/client.ts";
import consola from "consola";

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

describe("disk-usage run()", () => {
	const mockUsage = {
		// 1 GB
		capacity: 1_073_741_824,
		// 1 MB
		issue: 1_048_576,
		// 512 KB
		wiki: 524_288,
		// 2 MB
		file: 2_097_152,
		subversion: 0,
		// 10 MB
		git: 10_485_760,
		// 5 MB
		gitLFS: 5_242_880,
		// 1 MB
		pullRequest: 1_048_576,
	};

	it("run() でディスク使用量を表示する", async () => {
		const mockClient = setupMockClient(getClient);
		mockClient.mockResolvedValue(mockUsage);

		const mod = await import("#commands/space/disk-usage.ts");
		await mod.default.run?.({} as never);

		expect(mockClient).toHaveBeenCalledWith("/space/diskUsage");
		expect(consola.log).toHaveBeenCalledWith(expect.stringContaining("Disk Usage"));
		expect(consola.log).toHaveBeenCalledWith(expect.stringContaining("Capacity:"));
		expect(consola.log).toHaveBeenCalledWith(expect.stringContaining("Used:"));
		expect(consola.log).toHaveBeenCalledWith(expect.stringContaining("Issue:"));
		expect(consola.log).toHaveBeenCalledWith(expect.stringContaining("Wiki:"));
		expect(consola.log).toHaveBeenCalledWith(expect.stringContaining("File:"));
		expect(consola.log).toHaveBeenCalledWith(expect.stringContaining("Subversion:"));
		expect(consola.log).toHaveBeenCalledWith(expect.stringContaining("Git:"));
		expect(consola.log).toHaveBeenCalledWith(expect.stringContaining("Git LFS:"));
		expect(consola.log).toHaveBeenCalledWith(expect.stringContaining("Pull Request:"));
	});

	it("run() で各項目が正しくフォーマットされる", async () => {
		const mockClient = setupMockClient(getClient);
		mockClient.mockResolvedValue(mockUsage);

		const mod = await import("#commands/space/disk-usage.ts");
		await mod.default.run?.({} as never);

		// Capacity: 1 GB
		expect(consola.log).toHaveBeenCalledWith(expect.stringContaining("1.0 GB"));
		// Used: 1 MB + 512 KB + 2 MB + 0 + 10 MB + 5 MB + 1 MB = 20,447,232 bytes ≈ 19.5 MB
		expect(consola.log).toHaveBeenCalledWith(expect.stringContaining("19.5 MB"));
		// Issue: 1 MB
		expect(consola.log).toHaveBeenCalledWith(expect.stringContaining("1.0 MB"));
		// Wiki: 512 KB
		expect(consola.log).toHaveBeenCalledWith(expect.stringContaining("512.0 KB"));
		// File: 2 MB
		expect(consola.log).toHaveBeenCalledWith(expect.stringContaining("2.0 MB"));
		// Subversion: 0 B
		expect(consola.log).toHaveBeenCalledWith(expect.stringContaining("0 B"));
		// Git: 10 MB
		expect(consola.log).toHaveBeenCalledWith(expect.stringContaining("10.0 MB"));
		// Git LFS: 5 MB
		expect(consola.log).toHaveBeenCalledWith(expect.stringContaining("5.0 MB"));
	});
});
