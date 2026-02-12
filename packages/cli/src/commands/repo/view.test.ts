import { setupMockClient } from "@repo/test-utils";
import mockConsola from "@repo/test-utils/mock-consola";
import { afterEach, beforeEach, describe, expect, it, mock, spyOn } from "bun:test";

mock.module("#utils/client.ts", () => ({ getClient: mock() }));
mock.module("#utils/resolve.ts", () => ({
	resolveProjectArg: mock((v: string) => v),
}));
mock.module("#utils/url.ts", () => ({
	openUrl: mock(),
	repositoryUrl: mock(() => "https://example.backlog.com/git/PROJ/repo"),
}));
mock.module("#utils/format.ts", () => ({
	formatDate: mock(() => "2024-01-01"),
}));
mock.module("consola", () => ({ default: mockConsola }));

const { getClient } = await import("#utils/client.ts");
const { openUrl, repositoryUrl } = await import("#utils/url.ts");
const { default: consola } = await import("consola");

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
		let writeSpy: ReturnType<typeof spyOn>;

		beforeEach(() => {
			writeSpy = spyOn(process.stdout, "write").mockImplementation(() => true);
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
