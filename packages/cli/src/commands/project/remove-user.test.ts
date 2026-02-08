import { setupMockClient } from "@repo/test-utils";
import { describe, expect, it, vi } from "vitest";

vi.mock("#utils/client.ts", () => ({ getClient: vi.fn() }));
vi.mock("consola", () => import("@repo/test-utils/mock-consola"));

import { getClient } from "#utils/client.ts";
import consola from "consola";

describe("project remove-user", () => {
	it("ユーザーを削除する", async () => {
		const mockClient = setupMockClient(getClient);
		mockClient.mockResolvedValue({ id: 12_345, name: "Test User" });

		const mod = await import("#commands/project/remove-user.ts");
		await mod.default.run?.({ args: { "project-key": "PROJ", "user-id": "12345" } } as never);

		expect(mockClient).toHaveBeenCalledWith(
			"/projects/PROJ/users",
			expect.objectContaining({
				method: "DELETE",
				body: { userId: 12_345 },
			}),
		);
		expect(consola.success).toHaveBeenCalledWith("Removed user Test User from project PROJ.");
	});
});
