import { setupMockClient } from "@repo/test-utils";
import { describe, expect, it, vi } from "vitest";

vi.mock("#utils/client.ts", () => ({ getClient: vi.fn() }));
vi.mock("consola", () => import("@repo/test-utils/mock-consola"));

import { getClient } from "#utils/client.ts";
import consola from "consola";

describe("star add", () => {
	it("課題にスターを付ける", async () => {
		const mockClient = setupMockClient(getClient);
		// GET /issues/PROJ-1 → POST /stars
		mockClient.mockResolvedValueOnce({ id: 42 }).mockResolvedValueOnce({});

		const mod = await import("#commands/star/add.ts");
		await mod.default.run?.({ args: { issue: "PROJ-1" } } as never);

		expect(mockClient).toHaveBeenCalledWith("/issues/PROJ-1");
		expect(mockClient).toHaveBeenCalledWith(
			"/stars",
			expect.objectContaining({
				method: "POST",
				body: { issueId: 42 },
			}),
		);
		expect(consola.success).toHaveBeenCalledWith("Star added.");
	});

	it("コメントにスターを付ける", async () => {
		const mockClient = setupMockClient(getClient);
		mockClient.mockResolvedValue({});

		const mod = await import("#commands/star/add.ts");
		await mod.default.run?.({ args: { comment: "100" } } as never);

		expect(mockClient).toHaveBeenCalledWith(
			"/stars",
			expect.objectContaining({
				method: "POST",
				body: { commentId: 100 },
			}),
		);
		expect(consola.success).toHaveBeenCalledWith("Star added.");
	});

	it("Wiki にスターを付ける", async () => {
		const mockClient = setupMockClient(getClient);
		mockClient.mockResolvedValue({});

		const mod = await import("#commands/star/add.ts");
		await mod.default.run?.({ args: { wiki: "200" } } as never);

		expect(mockClient).toHaveBeenCalledWith(
			"/stars",
			expect.objectContaining({
				method: "POST",
				body: { wikiId: 200 },
			}),
		);
	});

	it("PR コメントにスターを付ける", async () => {
		const mockClient = setupMockClient(getClient);
		mockClient.mockResolvedValue({});

		const mod = await import("#commands/star/add.ts");
		await mod.default.run?.({ args: { "pr-comment": "300" } } as never);

		expect(mockClient).toHaveBeenCalledWith(
			"/stars",
			expect.objectContaining({
				method: "POST",
				body: { pullRequestCommentId: 300 },
			}),
		);
	});

	it("無効なコメント ID でエラー終了する", async () => {
		setupMockClient(getClient);
		const mockExit = vi.spyOn(process, "exit").mockImplementation(() => undefined as never);

		const mod = await import("#commands/star/add.ts");
		await mod.default.run?.({ args: { comment: "abc" } } as never);

		expect(consola.error).toHaveBeenCalledWith('Invalid comment ID: "abc"');
		expect(mockExit).toHaveBeenCalledWith(1);
		mockExit.mockRestore();
	});

	it("無効な Wiki ID でエラー終了する", async () => {
		setupMockClient(getClient);
		const mockExit = vi.spyOn(process, "exit").mockImplementation(() => undefined as never);

		const mod = await import("#commands/star/add.ts");
		await mod.default.run?.({ args: { wiki: "xyz" } } as never);

		expect(consola.error).toHaveBeenCalledWith('Invalid wiki ID: "xyz"');
		expect(mockExit).toHaveBeenCalledWith(1);
		mockExit.mockRestore();
	});

	it("無効な PR コメント ID でエラー終了する", async () => {
		setupMockClient(getClient);
		const mockExit = vi.spyOn(process, "exit").mockImplementation(() => undefined as never);

		const mod = await import("#commands/star/add.ts");
		await mod.default.run?.({ args: { "pr-comment": "bad" } } as never);

		expect(consola.error).toHaveBeenCalledWith('Invalid pull request comment ID: "bad"');
		expect(mockExit).toHaveBeenCalledWith(1);
		mockExit.mockRestore();
	});

	it("ターゲット未指定でエラー終了する", async () => {
		setupMockClient(getClient);
		const mockExit = vi.spyOn(process, "exit").mockImplementation(() => undefined as never);

		const mod = await import("#commands/star/add.ts");
		await mod.default.run?.({ args: {} } as never);

		expect(consola.error).toHaveBeenCalledWith("Specify a target: --issue, --comment, --wiki, or --pr-comment");
		expect(mockExit).toHaveBeenCalledWith(1);
		mockExit.mockRestore();
	});
});
