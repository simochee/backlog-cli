vi.mock("#utils/client.ts", () => ({ getClient: vi.fn() }));
vi.mock("#utils/format.ts", () => ({
	padEnd: vi.fn((s: string, n: number) => s.padEnd(n)),
}));
vi.mock("consola", () => ({
	default: { log: vi.fn(), info: vi.fn(), success: vi.fn(), error: vi.fn() },
}));

import { getClient } from "#utils/client.ts";
import consola from "consola";
import { beforeEach, describe, expect, it, vi } from "vitest";

describe("project users", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("プロジェクトユーザー一覧を表示する", async () => {
		const mockClient = vi.fn();
		vi.mocked(getClient).mockResolvedValue({ client: mockClient as never, host: "example.backlog.com" });
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
		const mockClient = vi.fn();
		vi.mocked(getClient).mockResolvedValue({ client: mockClient as never, host: "example.backlog.com" });
		mockClient.mockResolvedValue([]);

		const mod = await import("#commands/project/users.ts");
		await mod.default.run?.({ args: { "project-key": "PROJ" } } as never);

		expect(consola.info).toHaveBeenCalledWith("No users found.");
	});
});
