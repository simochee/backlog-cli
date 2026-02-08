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

describe("status-type create", () => {
	beforeEach(() => {
		vi.mocked(promptRequired).mockImplementation((_label: string, value?: string) => Promise.resolve(value as string));
	});

	it("ステータスを作成する", async () => {
		const mockClient = setupMockClient(getClient);
		mockClient.mockResolvedValue({ id: 1, name: "In Progress" });

		const mod = await import("#commands/status-type/create.ts");
		await mod.default.run?.({ args: { project: "PROJ", name: "In Progress", color: "#4488cc" } } as never);

		expect(mockClient).toHaveBeenCalledWith(
			"/projects/PROJ/statuses",
			expect.objectContaining({
				method: "POST",
				body: { name: "In Progress", color: "#4488cc" },
			}),
		);
		expect(consola.success).toHaveBeenCalledWith("Created status #1: In Progress");
	});
});
