import { setupMockClient } from "@repo/test-utils";
import mockConsola from "@repo/test-utils/mock-consola";
import { afterEach, beforeEach, describe, expect, it, mock, spyOn } from "bun:test";

mock.module("#utils/client.ts", () => ({ getClient: mock() }));
mock.module("#utils/resolve.ts", () => ({
	resolveProjectArg: mock(() => "PROJ"),
}));
mock.module("consola", () => ({ default: mockConsola }));
mock.module("#utils/format.ts", () => ({
	formatDate: mock(() => "2024-01-01"),
}));
mock.module("#utils/url.ts", () => ({
	openUrl: mock(),
	pullRequestUrl: mock(() => "https://example.backlog.com/git/PROJ/repo/pullRequests/1"),
}));

const { getClient } = await import("#utils/client.ts");
const { openUrl, pullRequestUrl } = await import("#utils/url.ts");
const { default: consola } = await import("consola");

const mockPr = {
	number: 1,
	summary: "Test PR",
	description: "PR description",
	status: { name: "Open" },
	branch: "feature/test",
	base: "main",
	assignee: { name: "User" },
	createdUser: { name: "Creator" },
	created: "2024-01-01T00:00:00Z",
	updated: "2024-01-02T00:00:00Z",
	issue: null,
	mergeAt: null,
	closeAt: null,
};

describe("pr view", () => {
	it("PRの詳細を表示する", async () => {
		const mockClient = setupMockClient(getClient);
		mockClient.mockResolvedValue(mockPr);

		const mod = await import("#commands/pr/view.ts");
		await mod.default.run?.({ args: { number: "1", project: "PROJ", repo: "repo" } } as never);

		expect(mockClient).toHaveBeenCalledWith("/projects/PROJ/git/repositories/repo/pullRequests/1");
		expect(consola.log).toHaveBeenCalledWith(expect.stringContaining("#1"));
		expect(consola.log).toHaveBeenCalledWith(expect.stringContaining("Test PR"));
		expect(consola.log).toHaveBeenCalledWith(expect.stringContaining("Open"));
		expect(consola.log).toHaveBeenCalledWith(expect.stringContaining("feature/test"));
		expect(consola.log).toHaveBeenCalledWith(expect.stringContaining("main"));
		expect(consola.log).toHaveBeenCalledWith(expect.stringContaining("User"));
		expect(consola.log).toHaveBeenCalledWith(expect.stringContaining("Creator"));
	});

	it("--web でブラウザを開く", async () => {
		const mockClient = setupMockClient(getClient);
		mockClient.mockResolvedValue(mockPr);

		const mod = await import("#commands/pr/view.ts");
		await mod.default.run?.({ args: { number: "1", project: "PROJ", repo: "repo", web: true } } as never);

		expect(pullRequestUrl).toHaveBeenCalledWith("example.backlog.com", "PROJ", "repo", 1);
		expect(openUrl).toHaveBeenCalledWith("https://example.backlog.com/git/PROJ/repo/pullRequests/1");
		expect(consola.info).toHaveBeenCalledWith("Opening https://example.backlog.com/git/PROJ/repo/pullRequests/1");
	});

	it("--comments でコメントを含める", async () => {
		const mockClient = setupMockClient(getClient);
		mockClient.mockResolvedValueOnce(mockPr).mockResolvedValueOnce([
			{ content: "Comment 1", createdUser: { name: "User1" }, created: "2024-01-03T00:00:00Z" },
			{ content: "Comment 2", createdUser: { name: "User2" }, created: "2024-01-04T00:00:00Z" },
		]);

		const mod = await import("#commands/pr/view.ts");
		await mod.default.run?.({ args: { number: "1", project: "PROJ", repo: "repo", comments: true } } as never);

		expect(mockClient).toHaveBeenCalledTimes(2);
		expect(mockClient).toHaveBeenCalledWith("/projects/PROJ/git/repositories/repo/pullRequests/1");
		expect(mockClient).toHaveBeenCalledWith("/projects/PROJ/git/repositories/repo/pullRequests/1/comments");
		expect(consola.log).toHaveBeenCalledWith(expect.stringContaining("Comments:"));
	});

	it("descriptionを表示する", async () => {
		const mockClient = setupMockClient(getClient);
		mockClient.mockResolvedValue(mockPr);

		const mod = await import("#commands/pr/view.ts");
		await mod.default.run?.({ args: { number: "1", project: "PROJ", repo: "repo" } } as never);

		expect(consola.log).toHaveBeenCalledWith(expect.stringContaining("Description:"));
		expect(consola.log).toHaveBeenCalledWith(expect.stringContaining("PR description"));
	});

	describe("--json", () => {
		let writeSpy: ReturnType<typeof spyOn>;

		beforeEach(() => {
			writeSpy = spyOn(process.stdout, "write").mockImplementation(() => true);
		});

		afterEach(() => {
			writeSpy.mockRestore();
		});

		it("--json で JSON を出力する", async () => {
			const mockClient = setupMockClient(getClient);
			mockClient.mockResolvedValue(mockPr);

			const mod = await import("#commands/pr/view.ts");
			await mod.default.run?.({ args: { number: "1", project: "PROJ", repo: "repo", json: "" } } as never);

			expect(consola.log).not.toHaveBeenCalled();
			const output = JSON.parse(String(writeSpy.mock.calls[0]?.[0]).trim());
			expect(output.number).toBe(1);
			expect(output.summary).toBe("Test PR");
		});
	});
});
