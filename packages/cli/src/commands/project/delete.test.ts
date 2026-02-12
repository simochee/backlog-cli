import { setupMockClient } from "@repo/test-utils";
import mockConsola from "@repo/test-utils/mock-consola";
import { describe, expect, it, mock } from "bun:test";

mock.module("#utils/client.ts", () => ({ getClient: mock() }));
mock.module("consola", () => ({ default: mockConsola }));

const { getClient } = await import("#utils/client.ts");
const { default: consola } = await import("consola");

describe("project delete", () => {
	it("--yes でプロジェクトを削除する", async () => {
		const mockClient = setupMockClient(getClient);
		mockClient.mockResolvedValue({ projectKey: "PROJ", name: "Test Project" });

		const mod = await import("#commands/project/delete.ts");
		await mod.default.run?.({ args: { "project-key": "PROJ", yes: true } } as never);

		expect(mockClient).toHaveBeenCalledWith("/projects/PROJ", expect.objectContaining({ method: "DELETE" }));
		expect(consola.prompt).not.toHaveBeenCalled();
		expect(consola.success).toHaveBeenCalledWith("Deleted project PROJ: Test Project");
	});

	it("確認キャンセルで削除しない", async () => {
		const mockClient = setupMockClient(getClient);
		(consola.prompt as any).mockResolvedValue(false as never);

		const mod = await import("#commands/project/delete.ts");
		await mod.default.run?.({ args: { "project-key": "PROJ" } } as never);

		expect(consola.prompt).toHaveBeenCalledOnce();
		expect(consola.info).toHaveBeenCalledWith("Cancelled.");
		// DELETE リクエストが送信されないことを確認
		expect(mockClient).not.toHaveBeenCalledWith("/projects/PROJ", expect.objectContaining({ method: "DELETE" }));
	});
});
