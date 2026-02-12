import { setupMockClient } from "@repo/test-utils";
import mockConsola from "@repo/test-utils/mock-consola";
import { beforeEach, describe, expect, it, mock } from "bun:test";

mock.module("#utils/client.ts", () => ({ getClient: mock() }));
mock.module("#utils/resolve.ts", () => ({
	resolveProjectArg: mock((v: string) => v),
}));
mock.module("#utils/prompt.ts", () => {
	const fn = mock();
	return { default: fn, promptRequired: fn };
});
mock.module("consola", () => ({ default: mockConsola }));

const { getClient } = await import("#utils/client.ts");
const { default: promptRequired } = await import("#utils/prompt.ts");
const { default: consola } = await import("consola");

describe("issue-type create", () => {
	beforeEach(() => {
		(promptRequired as any).mockImplementation((_label: string, value?: string) => Promise.resolve(value as string));
	});

	it("課題種別を作成する", async () => {
		const mockClient = setupMockClient(getClient);
		mockClient.mockResolvedValue({ id: 1, name: "Bug" });

		const mod = await import("#commands/issue-type/create.ts");
		await mod.default.run?.({ args: { project: "PROJ", name: "Bug", color: "#e30000" } } as never);

		expect(mockClient).toHaveBeenCalledWith(
			"/projects/PROJ/issueTypes",
			expect.objectContaining({
				method: "POST",
				body: { name: "Bug", color: "#e30000" },
			}),
		);
		expect(consola.success).toHaveBeenCalledWith("Created issue type #1: Bug");
	});
});
