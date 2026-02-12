import { setupMockClient } from "@repo/test-utils";
import mockConsola from "@repo/test-utils/mock-consola";
import { beforeEach, describe, expect, it, mock } from "bun:test";

mock.module("#utils/client.ts", () => ({ getClient: mock() }));
mock.module("#utils/resolve.ts", () => ({
	resolveProjectArg: mock((v: string) => v),
	resolveProjectId: mock(() => Promise.resolve(100)),
}));
mock.module("#utils/prompt.ts", () => {
	const fn = mock();
	return { default: fn, promptRequired: fn };
});
mock.module("consola", () => ({ default: mockConsola }));

const { getClient } = await import("#utils/client.ts");
const { default: promptRequired } = await import("#utils/prompt.ts");
const { default: consola } = await import("consola");

describe("wiki create", () => {
	beforeEach(() => {
		(promptRequired as any).mockImplementation((_label: string, value?: string) => Promise.resolve(value as string));
	});

	it("Wiki ページを作成する", async () => {
		const mockClient = setupMockClient(getClient);
		mockClient.mockResolvedValue({ id: 1, name: "New Page" });

		const mod = await import("#commands/wiki/create.ts");
		await mod.default.run?.({ args: { project: "PROJ", name: "New Page", body: "Content" } } as never);

		expect(mockClient).toHaveBeenCalledWith(
			"/wikis",
			expect.objectContaining({
				method: "POST",
				body: expect.objectContaining({ projectId: 100, name: "New Page", content: "Content" }),
			}),
		);
		expect(consola.success).toHaveBeenCalledWith("Created wiki page #1: New Page");
	});

	it("--notify でメール通知を含める", async () => {
		const mockClient = setupMockClient(getClient);
		mockClient.mockResolvedValue({ id: 2, name: "Notify Page" });

		const mod = await import("#commands/wiki/create.ts");
		await mod.default.run?.({ args: { project: "PROJ", name: "Notify Page", body: "Content", notify: true } } as never);

		expect(mockClient).toHaveBeenCalledWith(
			"/wikis",
			expect.objectContaining({
				method: "POST",
				body: expect.objectContaining({ mailNotify: true }),
			}),
		);
	});
});
