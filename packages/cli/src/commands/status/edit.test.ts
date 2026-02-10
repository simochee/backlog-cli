import { setupMockClient } from "@repo/test-utils";
import { describe, expect, it, vi } from "vitest";

vi.mock("#utils/client.ts", () => ({ getClient: vi.fn() }));
vi.mock("#utils/resolve.ts", () => ({
	resolveProjectArg: vi.fn((v: string) => v),
}));
vi.mock("consola", () => import("@repo/test-utils/mock-consola"));

import { getClient } from "#utils/client.ts";
import consola from "consola";

describe("status edit", () => {
	it("ステータスを更新する", async () => {
		const mockClient = setupMockClient(getClient);
		mockClient.mockResolvedValue({ id: 1, name: "Done" });

		const mod = await import("#commands/status/edit.ts");
		await mod.default.run?.({ args: { id: "1", project: "PROJ", name: "Done" } } as never);

		expect(mockClient).toHaveBeenCalledWith(
			"/projects/PROJ/statuses/1",
			expect.objectContaining({
				method: "PATCH",
				body: expect.objectContaining({ name: "Done" }),
			}),
		);
		expect(consola.success).toHaveBeenCalledWith("Updated status #1: Done");
	});

	it("指定フィールドのみ PATCH ボディに含める", async () => {
		const mockClient = setupMockClient(getClient);
		mockClient.mockResolvedValue({ id: 1, name: "Status" });

		const mod = await import("#commands/status/edit.ts");
		await mod.default.run?.({ args: { id: "1", project: "PROJ", color: "#ffffff" } } as never);

		const callBody = mockClient.mock.calls[0]?.[1]?.body;
		expect(callBody).toHaveProperty("color", "#ffffff");
		expect(callBody).not.toHaveProperty("name");
	});
});
