vi.mock("#utils/client.ts", () => ({ getClient: vi.fn() }));
vi.mock("#utils/format.ts", () => ({
	formatProjectLine: vi.fn(() => "PROJ  Test Project  Active"),
	padEnd: vi.fn((s: string, n: number) => s.padEnd(n)),
}));
vi.mock("consola", () => ({
	default: { log: vi.fn(), info: vi.fn() },
}));

import { getClient } from "#utils/client.ts";
import consola from "consola";
import { beforeEach, describe, expect, it, vi } from "vitest";

describe("project list", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("プロジェクト一覧を表示する", async () => {
		const mockClient = vi.fn();
		vi.mocked(getClient).mockResolvedValue({ client: mockClient as never, host: "example.backlog.com" });
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
		const mockClient = vi.fn();
		vi.mocked(getClient).mockResolvedValue({ client: mockClient as never, host: "example.backlog.com" });
		mockClient.mockResolvedValue([]);

		const mod = await import("#commands/project/list.ts");
		await mod.default.run?.({ args: { limit: "20" } } as never);

		expect(consola.info).toHaveBeenCalledWith("No projects found.");
	});

	it("--archived でクエリに archived が含まれる", async () => {
		const mockClient = vi.fn();
		vi.mocked(getClient).mockResolvedValue({ client: mockClient as never, host: "example.backlog.com" });
		mockClient.mockResolvedValue([]);

		const mod = await import("#commands/project/list.ts");
		await mod.default.run?.({ args: { archived: true, limit: "20" } } as never);

		expect(mockClient).toHaveBeenCalledWith("/projects", expect.objectContaining({ query: { archived: true } }));
	});
});
