import { setupMockClient } from "@repo/test-utils";
import mockConsola from "@repo/test-utils/mock-consola";
import { afterEach, beforeEach, describe, expect, it, mock, spyOn } from "bun:test";

mock.module("#utils/client.ts", () => ({ getClient: mock() }));
mock.module("#utils/format.ts", () => ({
	formatDate: mock(() => "2024-01-01"),
	getActivityLabel: mock(() => "Issue Created"),
	padEnd: mock((s: string, n: number) => s.padEnd(n)),
}));
mock.module("consola", () => ({ default: mockConsola }));

const { getClient } = await import("#utils/client.ts");
const { default: consola } = await import("consola");

describe("user activities", () => {
	it("ユーザーのアクティビティ一覧を表示する", async () => {
		const mockClient = setupMockClient(getClient);
		mockClient.mockResolvedValue([
			{ id: 1, type: 1, created: "2024-01-01", project: { projectKey: "PROJ" } },
			{ id: 2, type: 2, created: "2024-01-02", project: { projectKey: "PROJ" } },
		]);

		const mod = await import("#commands/user/activities.ts");
		await mod.default.run?.({ args: { "user-id": "1", limit: "20" } } as never);

		expect(mockClient).toHaveBeenCalledWith("/users/1/activities", expect.objectContaining({ query: { count: 20 } }));
		expect(consola.log).toHaveBeenCalledTimes(3);
	});

	it("0件の場合メッセージ表示", async () => {
		const mockClient = setupMockClient(getClient);
		mockClient.mockResolvedValue([]);

		const mod = await import("#commands/user/activities.ts");
		await mod.default.run?.({ args: { "user-id": "1", limit: "20" } } as never);

		expect(consola.info).toHaveBeenCalledWith("No activities found.");
	});

	it("--activity-type クエリを含める", async () => {
		const mockClient = setupMockClient(getClient);
		mockClient.mockResolvedValue([]);

		const mod = await import("#commands/user/activities.ts");
		await mod.default.run?.({ args: { "user-id": "1", limit: "20", "activity-type": "1,2" } } as never);

		expect(mockClient).toHaveBeenCalledWith(
			"/users/1/activities",
			expect.objectContaining({ query: expect.objectContaining({ "activityTypeId[]": [1, 2] }) }),
		);
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
			const data = [{ id: 1, type: 1, created: "2024-01-01", project: { projectKey: "PROJ" } }];
			mockClient.mockResolvedValue(data);

			const mod = await import("#commands/user/activities.ts");
			await mod.default.run?.({ args: { "user-id": "1", limit: "20", json: "" } } as never);

			expect(consola.log).not.toHaveBeenCalled();
			const output = JSON.parse(String(writeSpy.mock.calls[0]?.[0]).trim());
			expect(output).toEqual(data);
		});
	});
});
