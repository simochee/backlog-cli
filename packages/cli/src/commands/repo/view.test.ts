import { setupMockClient } from "@repo/test-utils";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("#utils/client.ts", () => ({ getClient: vi.fn() }));
vi.mock("#utils/resolve.ts", () => ({
	resolveProjectArg: vi.fn((v: string) => v),
}));
vi.mock("#utils/url.ts", () => ({
	openUrl: vi.fn(),
	repositoryUrl: vi.fn(() => "https://example.backlog.com/git/PROJ/repo"),
}));
vi.mock("#utils/format.ts", () => ({
	formatDate: vi.fn(() => "2024-01-01"),
}));
vi.mock("consola", () => import("@repo/test-utils/mock-consola"));

import { getClient } from "#utils/client.ts";
import { openUrl, repositoryUrl } from "#utils/url.ts";
import consola from "consola";

describe("repo view", () => {
	const mockRepo = {
		id: 1,
		name: "my-repo",
		description: "A test repo",
		httpUrl: "https://example.backlog.com/git/PROJ/my-repo.git",
		sshUrl: "git@example.backlog.com:PROJ/my-repo.git",
		createdUser: { name: "User A" },
		created: "2024-01-01",
		updated: "2024-01-02",
		pushedAt: "2024-01-03",
	};

	it("リポジトリ詳細を表示する", async () => {
		const mockClient = setupMockClient(getClient);
		mockClient.mockResolvedValue(mockRepo);

		const mod = await import("#commands/repo/view.ts");
		await mod.default.run?.({ args: { repoName: "my-repo", project: "PROJ", web: false } } as never);

		expect(mockClient).toHaveBeenCalledWith("/projects/PROJ/git/repositories/my-repo");
		expect(consola.log).toHaveBeenCalledWith(expect.stringContaining("my-repo"));
	});

	it("--web でブラウザを開く", async () => {
		const mockClient = setupMockClient(getClient);
		mockClient.mockResolvedValue(mockRepo);

		const mod = await import("#commands/repo/view.ts");
		await mod.default.run?.({ args: { repoName: "my-repo", project: "PROJ", web: true } } as never);

		expect(repositoryUrl).toHaveBeenCalledWith("example.backlog.com", "PROJ", "my-repo");
		expect(openUrl).toHaveBeenCalledWith("https://example.backlog.com/git/PROJ/repo");
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
			mockClient.mockResolvedValue(mockRepo);

			const mod = await import("#commands/repo/view.ts");
			await mod.default.run?.({ args: { repoName: "my-repo", project: "PROJ", web: false, json: "" } } as never);

			expect(consola.log).not.toHaveBeenCalled();
			const output = JSON.parse(String(writeSpy.mock.calls[0]?.[0]).trim());
			expect(output.name).toBe("my-repo");
		});
	});
});
