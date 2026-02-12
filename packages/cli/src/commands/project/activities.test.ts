import { setupMockClient } from "@repo/test-utils";
import mockConsola from "@repo/test-utils/mock-consola";
import { afterEach, beforeEach, describe, expect, it, mock, spyOn } from "bun:test";

mock.module("#utils/client.ts", () => ({ getClient: mock() }));
mock.module("consola", () => ({ default: mockConsola }));
mock.module("#utils/format.ts", () => ({
	formatDate: mock(() => "2024-01-01"),
	getActivityLabel: mock(() => "Issue Created"),
}));

const { getClient } = await import("#utils/client.ts");
const { default: consola } = await import("consola");

describe("project activities", () => {
	it("アクティビティを表示する", async () => {
		const mockClient = setupMockClient(getClient);
		mockClient.mockResolvedValue([
			{
				type: 1,
				createdUser: { name: "User" },
				content: { summary: "Test issue" },
				project: { projectKey: "PROJ" },
				created: "2024-01-01T00:00:00Z",
			},
		]);

		const mod = await import("#commands/project/activities.ts");
		await mod.default.run?.({ args: { projectKey: "PROJ", limit: "20" } } as never);

		expect(mockClient).toHaveBeenCalledWith(
			"/projects/PROJ/activities",
			expect.objectContaining({ query: { count: 20 } }),
		);
		expect(consola.log).toHaveBeenCalled();
	});

	it("0件の場合メッセージ表示", async () => {
		const mockClient = setupMockClient(getClient);
		mockClient.mockResolvedValue([]);

		const mod = await import("#commands/project/activities.ts");
		await mod.default.run?.({ args: { projectKey: "PROJ", limit: "20" } } as never);

		expect(consola.info).toHaveBeenCalledWith("No activities found.");
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

			const mod = await import("#commands/project/activities.ts");
			await mod.default.run?.({ args: { projectKey: "PROJ", limit: "20", json: "" } } as never);

			expect(consola.log).not.toHaveBeenCalled();
			const output = JSON.parse(String(writeSpy.mock.calls[0]?.[0]).trim());
			expect(output).toEqual(data);
		});
	});
});
