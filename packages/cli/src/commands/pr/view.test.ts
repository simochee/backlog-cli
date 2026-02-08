import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("#utils/client.ts", () => ({ getClient: vi.fn() }));
vi.mock("#utils/resolve.ts", () => ({
	resolveProjectArg: vi.fn(() => "PROJ"),
}));
vi.mock("consola", () => ({
	default: { log: vi.fn(), info: vi.fn(), success: vi.fn(), error: vi.fn(), start: vi.fn() },
}));
vi.mock("#utils/format.ts", () => ({
	formatDate: vi.fn(() => "2024-01-01"),
}));
vi.mock("#utils/url.ts", () => ({
	openUrl: vi.fn(),
	pullRequestUrl: vi.fn(() => "https://example.backlog.com/git/PROJ/repo/pullRequests/1"),
}));

import { getClient } from "#utils/client.ts";
import { openUrl, pullRequestUrl } from "#utils/url.ts";
import consola from "consola";

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
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("PRの詳細を表示する", async () => {
		const mockClient = vi.fn();
		vi.mocked(getClient).mockResolvedValue({ client: mockClient as never, host: "example.backlog.com" });
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
		const mockClient = vi.fn();
		vi.mocked(getClient).mockResolvedValue({ client: mockClient as never, host: "example.backlog.com" });
		mockClient.mockResolvedValue(mockPr);

		const mod = await import("#commands/pr/view.ts");
		await mod.default.run?.({ args: { number: "1", project: "PROJ", repo: "repo", web: true } } as never);

		expect(pullRequestUrl).toHaveBeenCalledWith("example.backlog.com", "PROJ", "repo", 1);
		expect(openUrl).toHaveBeenCalledWith("https://example.backlog.com/git/PROJ/repo/pullRequests/1");
		expect(consola.info).toHaveBeenCalledWith("Opening https://example.backlog.com/git/PROJ/repo/pullRequests/1");
	});

	it("--comments でコメントを含める", async () => {
		const mockClient = vi.fn();
		vi.mocked(getClient).mockResolvedValue({ client: mockClient as never, host: "example.backlog.com" });
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
		const mockClient = vi.fn();
		vi.mocked(getClient).mockResolvedValue({ client: mockClient as never, host: "example.backlog.com" });
		mockClient.mockResolvedValue(mockPr);

		const mod = await import("#commands/pr/view.ts");
		await mod.default.run?.({ args: { number: "1", project: "PROJ", repo: "repo" } } as never);

		expect(consola.log).toHaveBeenCalledWith(expect.stringContaining("Description:"));
		expect(consola.log).toHaveBeenCalledWith(expect.stringContaining("PR description"));
	});
});
