import { setupMockClient } from "@repo/test-utils";
import { describe, expect, it, vi } from "vitest";

vi.mock("#utils/client.ts", () => ({ getClient: vi.fn() }));
vi.mock("#utils/resolve.ts", () => ({
	resolveProjectArg: vi.fn((v: string) => v),
}));
vi.mock("consola", () => import("@repo/test-utils/mock-consola"));

import { getClient } from "#utils/client.ts";
import consola from "consola";

describe("milestone edit", () => {
	it("マイルストーンを更新する", async () => {
		const mockClient = setupMockClient(getClient);
		mockClient.mockResolvedValue({ id: 1, name: "v1.1" });

		const mod = await import("#commands/milestone/edit.ts");
		await mod.default.run?.({ args: { id: "1", project: "PROJ", name: "v1.1" } } as never);

		expect(mockClient).toHaveBeenCalledWith(
			"/projects/PROJ/versions/1",
			expect.objectContaining({
				method: "PATCH",
				body: expect.objectContaining({ name: "v1.1" }),
			}),
		);
		expect(consola.success).toHaveBeenCalledWith("Updated milestone #1: v1.1");
	});

	it("指定フィールドのみ PATCH ボディに含める", async () => {
		const mockClient = setupMockClient(getClient);
		mockClient.mockResolvedValue({ id: 1, name: "Milestone" });

		const mod = await import("#commands/milestone/edit.ts");
		await mod.default.run?.({ args: { id: "1", project: "PROJ", archived: true } } as never);

		const callBody = mockClient.mock.calls[0]?.[1]?.body;
		expect(callBody).toHaveProperty("archived", true);
		expect(callBody).not.toHaveProperty("name");
	});
});
