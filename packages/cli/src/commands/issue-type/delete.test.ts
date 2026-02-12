import { setupMockClient } from "@repo/test-utils";
import mockConsola from "@repo/test-utils/mock-consola";
import { describe, expect, it, mock } from "bun:test";

mock.module("#utils/client.ts", () => ({ getClient: mock() }));
mock.module("#utils/resolve.ts", () => ({
	resolveProjectArg: mock((v: string) => v),
}));
mock.module("consola", () => ({ default: mockConsola }));
mock.module("#utils/prompt.ts", () => ({
	default: mock(async (label: string, existing?: string) => {
		if (existing) return existing;
		const { default: c } = await import("consola");
		return c.prompt(label, { type: "text" });
	}),
	confirmOrExit: mock(async (msg: string, skip?: boolean) => {
		if (skip) return true;
		const { default: c } = await import("consola");
		const confirmed = await c.prompt(msg, { type: "confirm" });
		if (!confirmed) {
			c.info("Cancelled.");
			return false;
		}
		return true;
	}),
}));

const { getClient } = await import("#utils/client.ts");
const { default: consola } = await import("consola");

describe("issue-type delete", () => {
	it("--yes で課題種別を削除する", async () => {
		const mockClient = setupMockClient(getClient);
		mockClient.mockResolvedValue({ id: 1, name: "Old Type" });

		const mod = await import("#commands/issue-type/delete.ts");
		await mod.default.run?.({
			args: { id: "1", project: "PROJ", "substitute-issue-type-id": "2", yes: true },
		} as never);

		expect(mockClient).toHaveBeenCalledWith(
			"/projects/PROJ/issueTypes/1",
			expect.objectContaining({
				method: "DELETE",
				body: { substituteIssueTypeId: 2 },
			}),
		);
		expect(consola.prompt).not.toHaveBeenCalled();
		expect(consola.success).toHaveBeenCalledWith("Deleted issue type #1: Old Type");
	});

	it("確認キャンセルで削除しない", async () => {
		setupMockClient(getClient);
		(consola.prompt as any).mockResolvedValue(false as never);

		const mod = await import("#commands/issue-type/delete.ts");
		await mod.default.run?.({ args: { id: "1", project: "PROJ", "substitute-issue-type-id": "2" } } as never);

		expect(consola.prompt).toHaveBeenCalledOnce();
		expect(consola.info).toHaveBeenCalledWith("Cancelled.");
	});
});
