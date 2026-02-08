import { setupMockClient } from "@repo/test-utils";
import { describe, expect, it, vi } from "vitest";

vi.mock("#utils/client.ts", () => ({ getClient: vi.fn() }));
vi.mock("consola", () => import("@repo/test-utils/mock-consola"));

import { getClient } from "#utils/client.ts";
import consola from "consola";

describe("space activities run()", () => {
	const mockActivities = [
		{
			id: 1001,
			type: 1,
			created: "2024-06-01T10:00:00Z",
			project: { projectKey: "TEST" },
		},
		{
			id: 1002,
			type: 2,
			created: "2024-06-02T12:00:00Z",
			project: { projectKey: "PROJ" },
		},
	];

	it("アクティビティ一覧を表示する", async () => {
		const mockClient = setupMockClient(getClient);
		mockClient.mockResolvedValue(mockActivities);

		const mod = await import("#commands/space/activities.ts");
		await mod.default.run?.({
			args: { limit: "20" },
		} as never);

		expect(mockClient).toHaveBeenCalledWith("/space/activities", {
			query: { count: 20 },
		});
		expect(consola.log).toHaveBeenCalledWith(expect.stringContaining("ID"));
		expect(consola.log).toHaveBeenCalledWith(expect.stringContaining("TYPE"));
		expect(consola.log).toHaveBeenCalledWith(expect.stringContaining("DATE"));
		expect(consola.log).toHaveBeenCalledWith(expect.stringContaining("PROJECT"));
		expect(consola.log).toHaveBeenCalledWith(expect.stringContaining("1001"));
		expect(consola.log).toHaveBeenCalledWith(expect.stringContaining("TEST"));
		expect(consola.log).toHaveBeenCalledWith(expect.stringContaining("1002"));
		expect(consola.log).toHaveBeenCalledWith(expect.stringContaining("PROJ"));
	});

	it("アクティビティがない場合は 'No activities found.' を表示する", async () => {
		const mockClient = setupMockClient(getClient);
		mockClient.mockResolvedValue([]);

		const mod = await import("#commands/space/activities.ts");
		await mod.default.run?.({
			args: { limit: "20" },
		} as never);

		expect(mockClient).toHaveBeenCalledWith("/space/activities", {
			query: { count: 20 },
		});
		expect(consola.info).toHaveBeenCalledWith("No activities found.");
	});

	it("--activity-type フィルタをクエリに含める", async () => {
		const mockClient = setupMockClient(getClient);
		mockClient.mockResolvedValue(mockActivities);

		const mod = await import("#commands/space/activities.ts");
		await mod.default.run?.({
			args: { limit: "20", "activity-type": "1,2,3" },
		} as never);

		expect(mockClient).toHaveBeenCalledWith("/space/activities", {
			query: {
				count: 20,
				"activityTypeId[]": [1, 2, 3],
			},
		});
	});

	it("--count パラメータをクエリに含める", async () => {
		const mockClient = setupMockClient(getClient);
		mockClient.mockResolvedValue(mockActivities);

		const mod = await import("#commands/space/activities.ts");
		await mod.default.run?.({
			args: { limit: "50" },
		} as never);

		expect(mockClient).toHaveBeenCalledWith("/space/activities", {
			query: { count: 50 },
		});
	});
});
