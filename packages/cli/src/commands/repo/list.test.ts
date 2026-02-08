import { setupMockClient } from "@repo/test-utils";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("#utils/client.ts", () => ({ getClient: vi.fn() }));
vi.mock("#utils/format.ts", () => ({
	formatRepositoryLine: vi.fn(() => "repo-name                     A repository"),
	padEnd: vi.fn((s: string, n: number) => s.padEnd(n)),
}));
vi.mock("consola", () => import("@repo/test-utils/mock-consola"));

import { getClient } from "#utils/client.ts";
import consola from "consola";

describe("repo list", () => {
	it("リポジトリ一覧を表示する", async () => {
		const mockClient = setupMockClient(getClient);
		mockClient.mockResolvedValue([
			{ id: 1, name: "repo1", description: "Repo 1" },
			{ id: 2, name: "repo2", description: "Repo 2" },
		]);

		const mod = await import("#commands/repo/list.ts");
		await mod.default.run?.({ args: { projectKey: "PROJ" } } as never);

		expect(mockClient).toHaveBeenCalledWith("/projects/PROJ/git/repositories");
		expect(consola.log).toHaveBeenCalledTimes(3);
	});

	it("0件の場合メッセージ表示", async () => {
		const mockClient = setupMockClient(getClient);
		mockClient.mockResolvedValue([]);

		const mod = await import("#commands/repo/list.ts");
		await mod.default.run?.({ args: { projectKey: "PROJ" } } as never);

		expect(consola.info).toHaveBeenCalledWith("No repositories found.");
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
			const data = [{ id: 1, name: "repo1", description: "Repo 1" }];
			mockClient.mockResolvedValue(data);

			const mod = await import("#commands/repo/list.ts");
			await mod.default.run?.({ args: { projectKey: "PROJ", json: "" } } as never);

			expect(consola.log).not.toHaveBeenCalled();
			const output = JSON.parse(String(writeSpy.mock.calls[0]?.[0]).trim());
			expect(output).toEqual(data);
		});
	});
});
