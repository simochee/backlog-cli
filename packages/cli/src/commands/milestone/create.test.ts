import { setupMockClient } from "@repo/test-utils";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("#utils/client.ts", () => ({ getClient: vi.fn() }));
vi.mock("#utils/resolve.ts", () => ({
	resolveProjectArg: vi.fn((v: string) => v),
}));
vi.mock("#utils/prompt.ts", () => {
	const fn = vi.fn();
	return { default: fn, promptRequired: fn };
});
vi.mock("consola", () => import("@repo/test-utils/mock-consola"));

import { getClient } from "#utils/client.ts";
import promptRequired from "#utils/prompt.ts";
import consola from "consola";

describe("milestone create", () => {
	beforeEach(() => {
		vi.mocked(promptRequired).mockImplementation((_label: string, value?: string) => Promise.resolve(value as string));
	});

	it("マイルストーンを作成する", async () => {
		const mockClient = setupMockClient(getClient);
		mockClient.mockResolvedValue({ id: 1, name: "v1.0" });

		const mod = await import("#commands/milestone/create.ts");
		await mod.default.run?.({ args: { project: "PROJ", name: "v1.0" } } as never);

		expect(mockClient).toHaveBeenCalledWith(
			"/projects/PROJ/versions",
			expect.objectContaining({
				method: "POST",
				body: expect.objectContaining({ name: "v1.0" }),
			}),
		);
		expect(consola.success).toHaveBeenCalledWith("Created milestone #1: v1.0");
	});

	it("日付オプションを含める", async () => {
		const mockClient = setupMockClient(getClient);
		mockClient.mockResolvedValue({ id: 2, name: "v2.0" });

		const mod = await import("#commands/milestone/create.ts");
		await mod.default.run?.({
			args: { project: "PROJ", name: "v2.0", "start-date": "2024-01-01", "release-due-date": "2024-03-01" },
		} as never);

		expect(mockClient).toHaveBeenCalledWith(
			"/projects/PROJ/versions",
			expect.objectContaining({
				method: "POST",
				body: expect.objectContaining({ startDate: "2024-01-01", releaseDueDate: "2024-03-01" }),
			}),
		);
	});
});
