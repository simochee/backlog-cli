import { setupMockClient } from "@repo/test-utils";
import mockConsola from "@repo/test-utils/mock-consola";
import { describe, expect, it, mock } from "bun:test";

mock.module("#utils/client.ts", () => ({ getClient: mock() }));
mock.module("#utils/resolve.ts", () => ({
	resolveProjectArg: mock((v: string) => v),
}));
mock.module("consola", () => ({ default: mockConsola }));
mock.module("node:child_process", () => ({
	spawn: mock(),
}));

const { getClient } = await import("#utils/client.ts");
const { default: consola } = await import("consola");
const { spawn } = await import("node:child_process");

describe("repo clone", () => {
	it("リポジトリ情報を取得して git clone を実行する", async () => {
		const mockClient = setupMockClient(getClient);
		mockClient.mockResolvedValue({
			name: "my-repo",
			httpUrl: "https://example.backlog.com/git/PROJ/my-repo.git",
		});

		const mockOn = mock((event: string, cb: (code: number) => void) => {
			if (event === "close") cb(0);
		});
		(spawn as any).mockReturnValue({ on: mockOn } as never);

		const mod = await import("#commands/repo/clone.ts");
		await mod.default.run?.({ args: { repoName: "my-repo", project: "PROJ" } } as never);

		expect(mockClient).toHaveBeenCalledWith("/projects/PROJ/git/repositories/my-repo");
		expect(spawn).toHaveBeenCalledWith("git", ["clone", "https://example.backlog.com/git/PROJ/my-repo.git"], {
			stdio: "inherit",
		});
		expect(consola.info).toHaveBeenCalledWith(expect.stringContaining("Cloning"));
		expect(consola.success).toHaveBeenCalledWith("Cloned my-repo");
	});
});
