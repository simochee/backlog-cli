import { setupMockClient } from "@repo/test-utils";
import mockConsola from "@repo/test-utils/mock-consola";
import { afterEach, beforeEach, describe, expect, it, mock, spyOn } from "bun:test";

mock.module("#utils/client.ts", () => ({ getClient: mock() }));
mock.module("#utils/format.ts", () => ({
	padEnd: mock((s: string, n: number) => s.padEnd(n)),
}));
mock.module("consola", () => ({ default: mockConsola }));

const { getClient } = await import("#utils/client.ts");
const { default: consola } = await import("consola");

describe("project users", () => {
	it("プロジェクトユーザー一覧を表示する", async () => {
		const mockClient = setupMockClient(getClient);
		mockClient.mockResolvedValue([
			{ id: 1, userId: "user1", name: "User One", roleType: 1 },
			{ id: 2, userId: "user2", name: "User Two", roleType: 2 },
		]);

		const mod = await import("#commands/project/users.ts");
		await mod.default.run?.({ args: { "project-key": "PROJ" } } as never);

		expect(mockClient).toHaveBeenCalledWith("/projects/PROJ/users");
		// ヘッダー1回 + ユーザー2回 = 3回
		expect(consola.log).toHaveBeenCalledTimes(3);
	});

	it("0件の場合メッセージ表示", async () => {
		const mockClient = setupMockClient(getClient);
		mockClient.mockResolvedValue([]);

		const mod = await import("#commands/project/users.ts");
		await mod.default.run?.({ args: { "project-key": "PROJ" } } as never);

		expect(consola.info).toHaveBeenCalledWith("No users found.");
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
			const data = [{ id: 1, userId: "user1", name: "User One", roleType: 1 }];
			mockClient.mockResolvedValue(data);

			const mod = await import("#commands/project/users.ts");
			await mod.default.run?.({ args: { "project-key": "PROJ", json: "" } } as never);

			expect(consola.log).not.toHaveBeenCalled();
			const output = JSON.parse(String(writeSpy.mock.calls[0]?.[0]).trim());
			expect(output).toEqual(data);
		});
	});
});
