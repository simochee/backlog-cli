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

describe("category create", () => {
	beforeEach(() => {
		vi.mocked(promptRequired).mockImplementation((_label: string, value?: string) => Promise.resolve(value as string));
	});

	it("カテゴリを作成する", async () => {
		const mockClient = setupMockClient(getClient);
		mockClient.mockResolvedValue({ id: 1, name: "New Category" });

		const mod = await import("#commands/category/create.ts");
		await mod.default.run?.({ args: { project: "PROJ", name: "New Category" } } as never);

		expect(mockClient).toHaveBeenCalledWith(
			"/projects/PROJ/categories",
			expect.objectContaining({
				method: "POST",
				body: { name: "New Category" },
			}),
		);
		expect(consola.success).toHaveBeenCalledWith("Created category #1: New Category");
	});
});
