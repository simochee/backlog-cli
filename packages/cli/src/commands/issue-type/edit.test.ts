import { setupMockClient } from "@repo/test-utils";
import { describe, expect, it, vi } from "vitest";

vi.mock("#utils/client.ts", () => ({ getClient: vi.fn() }));
vi.mock("#utils/resolve.ts", () => ({
	resolveProjectArg: vi.fn((v: string) => v),
}));
vi.mock("consola", () => import("@repo/test-utils/mock-consola"));

import { getClient } from "#utils/client.ts";
import consola from "consola";

describe("issue-type edit", () => {
	it("課題種別を更新する", async () => {
		const mockClient = setupMockClient(getClient);
		mockClient.mockResolvedValue({ id: 1, name: "Feature" });

		const mod = await import("#commands/issue-type/edit.ts");
		await mod.default.run?.({ args: { id: "1", project: "PROJ", name: "Feature" } } as never);

		expect(mockClient).toHaveBeenCalledWith(
			"/projects/PROJ/issueTypes/1",
			expect.objectContaining({
				method: "PATCH",
				body: expect.objectContaining({ name: "Feature" }),
			}),
		);
		expect(consola.success).toHaveBeenCalledWith("Updated issue type #1: Feature");
	});

	it("指定フィールドのみ PATCH ボディに含める", async () => {
		const mockClient = setupMockClient(getClient);
		mockClient.mockResolvedValue({ id: 1, name: "Type" });

		const mod = await import("#commands/issue-type/edit.ts");
		await mod.default.run?.({ args: { id: "1", project: "PROJ", color: "#000000" } } as never);

		const callBody = mockClient.mock.calls[0]?.[1]?.body;
		expect(callBody).toHaveProperty("color", "#000000");
		expect(callBody).not.toHaveProperty("name");
	});
});
