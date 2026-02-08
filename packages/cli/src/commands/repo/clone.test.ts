import { setupMockClient } from "@repo/test-utils";
import { describe, expect, it, vi } from "vitest";

vi.mock("#utils/client.ts", () => ({ getClient: vi.fn() }));
vi.mock("#utils/resolve.ts", () => ({
	resolveProjectArg: vi.fn((v: string) => v),
}));
vi.mock("consola", () => import("@repo/test-utils/mock-consola"));

import { getClient } from "#utils/client.ts";
import consola from "consola";

describe("repo clone", () => {
	it("リポジトリ情報を取得して git clone を実行する", async () => {
		const mockClient = setupMockClient(getClient);
		mockClient.mockResolvedValue({
			name: "my-repo",
			httpUrl: "https://example.backlog.com/git/PROJ/my-repo.git",
		});

		const mockProc = { exited: Promise.resolve(0) };
		const originalSpawn = globalThis.Bun?.spawn;
		globalThis.Bun = { spawn: vi.fn(() => mockProc) } as never;

		const mod = await import("#commands/repo/clone.ts");
		await mod.default.run?.({ args: { repoName: "my-repo", project: "PROJ" } } as never);

		expect(mockClient).toHaveBeenCalledWith("/projects/PROJ/git/repositories/my-repo");
		expect(consola.info).toHaveBeenCalledWith(expect.stringContaining("Cloning"));
		expect(consola.success).toHaveBeenCalledWith("Cloned my-repo");

		if (originalSpawn) {
			globalThis.Bun = { spawn: originalSpawn } as never;
		}
	});
});
