import { setupMockClient } from "@repo/test-utils";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("#utils/client.ts", () => ({ getClient: vi.fn() }));
vi.mock("#utils/resolve.ts", () => ({
	resolveProjectArg: vi.fn(() => "PROJ"),
}));
vi.mock("consola", () => import("@repo/test-utils/mock-consola"));
vi.mock("#utils/format.ts", () => ({
	formatDate: vi.fn(() => "2024-01-01"),
}));

import { getClient } from "#utils/client.ts";
import consola from "consola";

describe("pr comments", () => {
	it("PRコメント一覧を表示する", async () => {
		const mockClient = setupMockClient(getClient);
		mockClient.mockResolvedValue([
			{ id: 1, content: "First comment", createdUser: { name: "User1" }, created: "2024-01-01T00:00:00Z" },
			{ id: 2, content: "Second comment", createdUser: { name: "User2" }, created: "2024-01-02T00:00:00Z" },
		]);

		const mod = await import("#commands/pr/comments.ts");
		await mod.default.run?.({ args: { number: "1", project: "PROJ", repo: "repo", limit: "20" } } as never);

		expect(mockClient).toHaveBeenCalledWith(
			"/projects/PROJ/git/repositories/repo/pullRequests/1/comments",
			expect.objectContaining({ query: { count: 20 } }),
		);
		expect(consola.log).toHaveBeenCalledWith(expect.stringContaining("First comment"));
		expect(consola.log).toHaveBeenCalledWith(expect.stringContaining("Second comment"));
	});

	it("0件の場合メッセージを表示する", async () => {
		const mockClient = setupMockClient(getClient);
		mockClient.mockResolvedValue([]);

		const mod = await import("#commands/pr/comments.ts");
		await mod.default.run?.({ args: { number: "1", project: "PROJ", repo: "repo", limit: "20" } } as never);

		expect(consola.info).toHaveBeenCalledWith("No comments found.");
	});

	describe("--json", () => {
		let writeSpy: ReturnType<typeof vi.spyOn>;

		beforeEach(() => {
			writeSpy = vi.spyOn(process.stdout, "write").mockImplementation(() => true);
		});

		afterEach(() => {
			writeSpy.mockRestore();
		});

		it("--json で JSON を出力する", async () => {
			const mockClient = setupMockClient(getClient);
			const data = [
				{ id: 1, content: "First comment", createdUser: { name: "User1" }, created: "2024-01-01T00:00:00Z" },
			];
			mockClient.mockResolvedValue(data);

			const mod = await import("#commands/pr/comments.ts");
			await mod.default.run?.({ args: { number: "1", project: "PROJ", repo: "repo", limit: "20", json: "" } } as never);

			expect(consola.log).not.toHaveBeenCalled();
			const output = JSON.parse(String(writeSpy.mock.calls[0]?.[0]).trim());
			expect(output).toEqual(data);
		});
	});
});
