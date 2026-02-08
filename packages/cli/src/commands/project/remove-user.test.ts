vi.mock("#utils/client.ts", () => ({ getClient: vi.fn() }));
vi.mock("consola", () => ({
	default: { log: vi.fn(), info: vi.fn(), success: vi.fn(), error: vi.fn() },
}));

import { getClient } from "#utils/client.ts";
import consola from "consola";
import { beforeEach, describe, expect, it, vi } from "vitest";

describe("project remove-user", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("ユーザーを削除する", async () => {
		const mockClient = vi.fn();
		vi.mocked(getClient).mockResolvedValue({ client: mockClient as never, host: "example.backlog.com" });
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
