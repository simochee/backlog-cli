import { setupMockClient } from "@repo/test-utils";
import { describe, expect, it, vi } from "vitest";

vi.mock("#utils/client.ts", () => ({ getClient: vi.fn() }));
vi.mock("#utils/format.ts", () => ({
	formatProjectLine: vi.fn(() => "PROJ  Test Project  Active"),
	padEnd: vi.fn((s: string, n: number) => s.padEnd(n)),
}));
vi.mock("consola", () => import("@repo/test-utils/mock-consola"));

import { getClient } from "#utils/client.ts";
import consola from "consola";

describe("project list", () => {
	it("プロジェクト一覧を表示する", async () => {
		const mockClient = setupMockClient(getClient);
		mockClient.mockResolvedValue([
			{ id: 1, projectKey: "PROJ1", name: "Project 1", archived: false },
			{ id: 2, projectKey: "PROJ2", name: "Project 2", archived: false },
		]);

		const mod = await import("#commands/project/list.ts");
		await mod.default.run?.({ args: { limit: "20" } } as never);

		expect(mockClient).toHaveBeenCalledWith("/projects", expect.objectContaining({ query: {} }));
		// ヘッダー1回 + プロジェクト2回 = 3回
		expect(consola.log).toHaveBeenCalledTimes(3);
	});

	it("0件の場合メッセージ表示", async () => {
		const mockClient = setupMockClient(getClient);
		mockClient.mockResolvedValue([]);

		const mod = await import("#commands/project/list.ts");
		await mod.default.run?.({ args: { limit: "20" } } as never);

		expect(consola.info).toHaveBeenCalledWith("No projects found.");
	});

	it("--archived でクエリに archived が含まれる", async () => {
		const mockClient = setupMockClient(getClient);
		mockClient.mockResolvedValue([]);

		const mod = await import("#commands/project/list.ts");
		await mod.default.run?.({ args: { archived: true, limit: "20" } } as never);

		expect(mockClient).toHaveBeenCalledWith("/projects", expect.objectContaining({ query: { archived: true } }));
	});
});
