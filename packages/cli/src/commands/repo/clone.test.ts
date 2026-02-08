import { setupMockClient } from "@repo/test-utils";
import { describe, expect, it, vi } from "vitest";

vi.mock("#utils/client.ts", () => ({ getClient: vi.fn() }));
vi.mock("#utils/resolve.ts", () => ({
	resolveProjectArg: vi.fn((v: string) => v),
}));
vi.mock("consola", () => import("@repo/test-utils/mock-consola"));
vi.mock("node:child_process", () => ({
	spawn: vi.fn(),
}));

import { getClient } from "#utils/client.ts";
import consola from "consola";
import { spawn } from "node:child_process";

describe("repo clone", () => {
	it("リポジトリ情報を取得して git clone を実行する", async () => {
		const mockClient = setupMockClient(getClient);
		mockClient.mockResolvedValue({
			name: "my-repo",
			httpUrl: "https://example.backlog.com/git/PROJ/my-repo.git",
		});

		const mockOn = vi.fn((event: string, cb: (code: number) => void) => {
			if (event === "close") cb(0);
		});
		vi.mocked(spawn).mockReturnValue({ on: mockOn } as never);

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
