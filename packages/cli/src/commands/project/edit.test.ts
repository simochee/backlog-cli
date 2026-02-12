import { setupMockClient } from "@repo/test-utils";
import mockConsola from "@repo/test-utils/mock-consola";
import { describe, expect, it, mock } from "bun:test";

mock.module("#utils/client.ts", () => ({ getClient: mock() }));
mock.module("consola", () => ({ default: mockConsola }));

const { getClient } = await import("#utils/client.ts");
const { default: consola } = await import("consola");

describe("project edit", () => {
	it("プロジェクトを更新する", async () => {
		const mockClient = setupMockClient(getClient);
		mockClient.mockResolvedValue({ projectKey: "PROJ", name: "New Name" });

		const mod = await import("#commands/project/edit.ts");
		await mod.default.run?.({ args: { "project-key": "PROJ", name: "New Name" } } as never);

		expect(mockClient).toHaveBeenCalledWith(
			"/projects/PROJ",
			expect.objectContaining({
				method: "PATCH",
				body: { name: "New Name" },
			}),
		);
		expect(consola.success).toHaveBeenCalledWith("Updated project PROJ: New Name");
	});

	it("指定フィールドのみ PATCH ボディに含める", async () => {
		const mockClient = setupMockClient(getClient);
		mockClient.mockResolvedValue({ projectKey: "PROJ", name: "Project" });

		const mod = await import("#commands/project/edit.ts");
		await mod.default.run?.({ args: { "project-key": "PROJ", archived: true } } as never);

		expect(mockClient).toHaveBeenCalledWith(
			"/projects/PROJ",
			expect.objectContaining({
				method: "PATCH",
				body: { archived: true },
			}),
		);
		// Name と key が body に含まれないことを確認
		const callBody = mockClient.mock.calls[0]?.[1]?.body;
		expect(callBody).not.toHaveProperty("name");
		expect(callBody).not.toHaveProperty("key");
	});
});
