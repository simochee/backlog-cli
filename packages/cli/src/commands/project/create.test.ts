import { setupMockClient } from "@repo/test-utils";
import mockConsola from "@repo/test-utils/mock-consola";
import { beforeEach, describe, expect, it, mock } from "bun:test";

mock.module("#utils/client.ts", () => ({ getClient: mock() }));
mock.module("#utils/prompt.ts", () => ({ default: mock() }));
mock.module("consola", () => ({ default: mockConsola }));

const { getClient } = await import("#utils/client.ts");
const { default: promptRequired } = await import("#utils/prompt.ts");
const { default: consola } = await import("consola");

describe("project create", () => {
	beforeEach(() => {
		(promptRequired as any).mockImplementation((_label: string, value?: string) => Promise.resolve(value as string));
	});

	it("プロジェクトを作成する", async () => {
		const mockClient = setupMockClient(getClient);
		mockClient.mockResolvedValue({ projectKey: "TEST", name: "Test" });

		const mod = await import("#commands/project/create.ts");
		await mod.default.run?.({ args: { name: "Test", key: "TEST" } } as never);

		expect(mockClient).toHaveBeenCalledWith(
			"/projects",
			expect.objectContaining({
				method: "POST",
				body: expect.objectContaining({ name: "Test", key: "TEST" }),
			}),
		);
		expect(consola.success).toHaveBeenCalledWith("Created project TEST: Test");
	});

	it("オプション引数を含める", async () => {
		const mockClient = setupMockClient(getClient);
		mockClient.mockResolvedValue({ projectKey: "TEST", name: "Test" });

		const mod = await import("#commands/project/create.ts");
		await mod.default.run?.({
			args: {
				name: "Test",
				key: "TEST",
				"chart-enabled": true,
				"text-formatting-rule": "backlog",
			},
		} as never);

		expect(mockClient).toHaveBeenCalledWith(
			"/projects",
			expect.objectContaining({
				method: "POST",
				body: expect.objectContaining({
					name: "Test",
					key: "TEST",
					chartEnabled: true,
					textFormattingRule: "backlog",
				}),
			}),
		);
	});
});
