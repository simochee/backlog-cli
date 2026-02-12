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

describe("milestone create", () => {
	beforeEach(() => {
		(promptRequired as any).mockImplementation((_label: string, value?: string) => Promise.resolve(value as string));
	});

	it("マイルストーンを作成する", async () => {
		const mockClient = setupMockClient(getClient);
		mockClient.mockResolvedValue({ id: 1, name: "v1.0" });

		const mod = await import("#commands/milestone/create.ts");
		await mod.default.run?.({ args: { project: "PROJ", name: "v1.0" } } as never);

		expect(mockClient).toHaveBeenCalledWith(
			"/projects/PROJ/versions",
			expect.objectContaining({
				method: "POST",
				body: expect.objectContaining({ name: "v1.0" }),
			}),
		);
		expect(consola.success).toHaveBeenCalledWith("Created milestone #1: v1.0");
	});

	it("日付オプションを含める", async () => {
		const mockClient = setupMockClient(getClient);
		mockClient.mockResolvedValue({ id: 2, name: "v2.0" });

		const mod = await import("#commands/milestone/create.ts");
		await mod.default.run?.({
			args: { project: "PROJ", name: "v2.0", "start-date": "2024-01-01", "release-due-date": "2024-03-01" },
		} as never);

		expect(mockClient).toHaveBeenCalledWith(
			"/projects/PROJ/versions",
			expect.objectContaining({
				method: "POST",
				body: expect.objectContaining({ startDate: "2024-01-01", releaseDueDate: "2024-03-01" }),
			}),
		);
	});
});
