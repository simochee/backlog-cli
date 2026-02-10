import { setupMockClient } from "@repo/test-utils";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("#utils/client.ts", () => ({ getClient: vi.fn() }));
vi.mock("consola", () => import("@repo/test-utils/mock-consola"));

import { getClient } from "#utils/client.ts";
import consola from "consola";

describe("issue status", () => {
	it("自分の課題をステータス別に表示する", async () => {
		const mockClient = setupMockClient(getClient);
		mockClient.mockImplementation((url: string) => {
			if (url === "/users/myself") return Promise.resolve({ id: 1, name: "User" });
			if (url === "/issues")
				return Promise.resolve([
					{ issueKey: "PROJ-1", summary: "First issue", status: { name: "Open" } },
					{ issueKey: "PROJ-2", summary: "Second issue", status: { name: "In Progress" } },
				]);
			return Promise.resolve(null);
		});

		const mod = await import("#commands/issue/status.ts");
		await mod.default.run?.({ args: {} } as never);

		expect(consola.log).toHaveBeenCalledWith(expect.stringContaining("Issues assigned to User"));
		expect(consola.log).toHaveBeenCalledWith(expect.stringContaining("Open (1):"));
		expect(consola.log).toHaveBeenCalledWith(expect.stringContaining("In Progress (1):"));
		expect(consola.log).toHaveBeenCalledWith(expect.stringContaining("PROJ-1"));
		expect(consola.log).toHaveBeenCalledWith(expect.stringContaining("PROJ-2"));
	});

	it("担当課題0件の場合メッセージ表示", async () => {
		const mockClient = setupMockClient(getClient);
		mockClient.mockImplementation((url: string) => {
			if (url === "/users/myself") return Promise.resolve({ id: 1, name: "User" });
			if (url === "/issues") return Promise.resolve([]);
			return Promise.resolve(null);
		});

		const mod = await import("#commands/issue/status.ts");
		await mod.default.run?.({ args: {} } as never);

		expect(consola.info).toHaveBeenCalledWith("No issues assigned to you.");
	});

	it("複数ステータスでグルーピング", async () => {
		const mockClient = setupMockClient(getClient);
		mockClient.mockImplementation((url: string) => {
			if (url === "/users/myself") return Promise.resolve({ id: 1, name: "User" });
			if (url === "/issues")
				return Promise.resolve([
					{ issueKey: "PROJ-1", summary: "Open issue 1", status: { name: "Open" } },
					{ issueKey: "PROJ-2", summary: "Open issue 2", status: { name: "Open" } },
					{ issueKey: "PROJ-3", summary: "Closed issue", status: { name: "Closed" } },
				]);
			return Promise.resolve(null);
		});

		const mod = await import("#commands/issue/status.ts");
		await mod.default.run?.({ args: {} } as never);

		expect(consola.log).toHaveBeenCalledWith(expect.stringContaining("Open (2):"));
		expect(consola.log).toHaveBeenCalledWith(expect.stringContaining("Closed (1):"));
		expect(consola.log).toHaveBeenCalledWith(expect.stringContaining("PROJ-1"));
		expect(consola.log).toHaveBeenCalledWith(expect.stringContaining("PROJ-2"));
		expect(consola.log).toHaveBeenCalledWith(expect.stringContaining("PROJ-3"));
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
			mockClient.mockImplementation((url: string) => {
				if (url === "/users/myself") return Promise.resolve({ id: 1, name: "User" });
				if (url === "/issues")
					return Promise.resolve([{ issueKey: "PROJ-1", summary: "First issue", status: { name: "Open" } }]);
				return Promise.resolve(null);
			});

			const mod = await import("#commands/issue/status.ts");
			await mod.default.run?.({ args: { json: "" } } as never);

			expect(consola.log).not.toHaveBeenCalled();
			const output = JSON.parse(String(writeSpy.mock.calls[0]?.[0]).trim());
			expect(output.user.name).toBe("User");
			expect(output.issues).toHaveLength(1);
			expect(output.issues[0].issueKey).toBe("PROJ-1");
		});

		it("--json で課題0件でも JSON を出力する", async () => {
			const mockClient = setupMockClient(getClient);
			mockClient.mockImplementation((url: string) => {
				if (url === "/users/myself") return Promise.resolve({ id: 1, name: "User" });
				if (url === "/issues") return Promise.resolve([]);
				return Promise.resolve(null);
			});

			const mod = await import("#commands/issue/status.ts");
			await mod.default.run?.({ args: { json: "" } } as never);

			expect(consola.info).not.toHaveBeenCalled();
			const output = JSON.parse(String(writeSpy.mock.calls[0]?.[0]).trim());
			expect(output.user.name).toBe("User");
			expect(output.issues).toHaveLength(0);
		});

		it("--json でフィールドフィルタが動作する", async () => {
			const mockClient = setupMockClient(getClient);
			mockClient.mockImplementation((url: string) => {
				if (url === "/users/myself") return Promise.resolve({ id: 1, name: "User" });
				if (url === "/issues")
					return Promise.resolve([{ issueKey: "PROJ-1", summary: "First issue", status: { name: "Open" } }]);
				return Promise.resolve(null);
			});

			const mod = await import("#commands/issue/status.ts");
			await mod.default.run?.({ args: { json: "issues" } } as never);

			const output = JSON.parse(String(writeSpy.mock.calls[0]?.[0]).trim());
			expect(output.issues).toHaveLength(1);
			expect(output.user).toBeUndefined();
		});
	});
});
