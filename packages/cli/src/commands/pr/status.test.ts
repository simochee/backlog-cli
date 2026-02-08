import { setupMockClient } from "@repo/test-utils";
import { describe, expect, it, vi } from "vitest";

vi.mock("#utils/client.ts", () => ({ getClient: vi.fn() }));
vi.mock("#utils/resolve.ts", () => ({
	resolveProjectArg: vi.fn(() => "PROJ"),
}));
vi.mock("consola", () => import("@repo/test-utils/mock-consola"));

import { getClient } from "#utils/client.ts";
import consola from "consola";

describe("pr status", () => {
	it("自分のPRをステータス別に表示する", async () => {
		const mockClient = setupMockClient(getClient);
		mockClient.mockImplementation((url: string) => {
			if (url === "/users/myself") return Promise.resolve({ id: 1, name: "User" });
			if (url.includes("/pullRequests"))
				return Promise.resolve([
					{ number: 1, summary: "Add feature", status: { name: "Open" } },
					{ number: 2, summary: "Fix bug", status: { name: "Merged" } },
				]);
			return Promise.resolve(null);
		});

		const mod = await import("#commands/pr/status.ts");
		await mod.default.run?.({ args: { project: "PROJ", repo: "repo" } } as never);

		expect(mockClient).toHaveBeenCalledWith("/users/myself");
		expect(mockClient).toHaveBeenCalledWith(
			"/projects/PROJ/git/repositories/repo/pullRequests",
			expect.objectContaining({
				query: { "assigneeId[]": [1], count: 100 },
			}),
		);
		expect(consola.log).toHaveBeenCalledWith(expect.stringContaining("Pull requests assigned to User"));
		expect(consola.log).toHaveBeenCalledWith(expect.stringContaining("Open (1):"));
		expect(consola.log).toHaveBeenCalledWith(expect.stringContaining("Merged (1):"));
	});

	it("0件の場合メッセージを表示する", async () => {
		const mockClient = setupMockClient(getClient);
		mockClient.mockImplementation((url: string) => {
			if (url === "/users/myself") return Promise.resolve({ id: 1, name: "User" });
			if (url.includes("/pullRequests")) return Promise.resolve([]);
			return Promise.resolve(null);
		});

		const mod = await import("#commands/pr/status.ts");
		await mod.default.run?.({ args: { project: "PROJ", repo: "repo" } } as never);

		expect(consola.info).toHaveBeenCalledWith("No pull requests assigned to you.");
	});

	it("複数ステータスでグルーピングする", async () => {
		const mockClient = setupMockClient(getClient);
		mockClient.mockImplementation((url: string) => {
			if (url === "/users/myself") return Promise.resolve({ id: 1, name: "User" });
			if (url.includes("/pullRequests"))
				return Promise.resolve([
					{ number: 1, summary: "Feature A", status: { name: "Open" } },
					{ number: 2, summary: "Feature B", status: { name: "Open" } },
					{ number: 3, summary: "Hotfix", status: { name: "Merged" } },
				]);
			return Promise.resolve(null);
		});

		const mod = await import("#commands/pr/status.ts");
		await mod.default.run?.({ args: { project: "PROJ", repo: "repo" } } as never);

		expect(consola.log).toHaveBeenCalledWith(expect.stringContaining("Open (2):"));
		expect(consola.log).toHaveBeenCalledWith(expect.stringContaining("Merged (1):"));
		expect(consola.log).toHaveBeenCalledWith(expect.stringContaining("#1  Feature A"));
		expect(consola.log).toHaveBeenCalledWith(expect.stringContaining("#2  Feature B"));
		expect(consola.log).toHaveBeenCalledWith(expect.stringContaining("#3  Hotfix"));
	});
});
