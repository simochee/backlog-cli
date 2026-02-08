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
import { promptRequired } from "#utils/prompt.ts";
import consola from "consola";

describe("issue-type create", () => {
	beforeEach(() => {
		vi.mocked(promptRequired).mockImplementation((_label, value) => Promise.resolve(value as string));
	});

	it("課題種別を作成する", async () => {
		const mockClient = setupMockClient(getClient);
		mockClient.mockResolvedValue({ id: 1, name: "Bug" });

		const mod = await import("#commands/issue-type/create.ts");
		await mod.default.run?.({ args: { project: "PROJ", name: "Bug", color: "#e30000" } } as never);

		expect(mockClient).toHaveBeenCalledWith(
			"/projects/PROJ/issueTypes",
			expect.objectContaining({
				method: "POST",
				body: { name: "Bug", color: "#e30000" },
			}),
		);
		expect(consola.success).toHaveBeenCalledWith("Created issue type #1: Bug");
	});
});
