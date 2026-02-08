import { setupMockClient } from "@repo/test-utils";
import { describe, expect, it, vi } from "vitest";

vi.mock("#utils/client.ts", () => ({ getClient: vi.fn() }));
vi.mock("#utils/format.ts", () => ({
	padEnd: vi.fn((s: string, n: number) => s.padEnd(n)),
}));
vi.mock("consola", () => import("@repo/test-utils/mock-consola"));

import { getClient } from "#utils/client.ts";
import consola from "consola";

describe("project users", () => {
	it("プロジェクトユーザー一覧を表示する", async () => {
		const mockClient = setupMockClient(getClient);
		mockClient.mockResolvedValue([
			{ id: 1, userId: "user1", name: "User One", roleType: 1 },
			{ id: 2, userId: "user2", name: "User Two", roleType: 2 },
		]);

		const mod = await import("#commands/project/users.ts");
		await mod.default.run?.({ args: { "project-key": "PROJ" } } as never);

		expect(mockClient).toHaveBeenCalledWith("/projects/PROJ/users");
		// ヘッダー1回 + ユーザー2回 = 3回
		expect(consola.log).toHaveBeenCalledTimes(3);
	});

	it("0件の場合メッセージ表示", async () => {
		const mockClient = setupMockClient(getClient);
		mockClient.mockResolvedValue([]);

		const mod = await import("#commands/project/users.ts");
		await mod.default.run?.({ args: { "project-key": "PROJ" } } as never);

		expect(consola.info).toHaveBeenCalledWith("No users found.");
	});
});
