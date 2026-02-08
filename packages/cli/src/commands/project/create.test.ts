import { setupMockClient } from "@repo/test-utils";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("#utils/client.ts", () => ({ getClient: vi.fn() }));
vi.mock("#utils/prompt.ts", () => ({ default: vi.fn() }));
vi.mock("consola", () => import("@repo/test-utils/mock-consola"));

import { getClient } from "#utils/client.ts";
import promptRequired from "#utils/prompt.ts";
import consola from "consola";

describe("project create", () => {
	beforeEach(() => {
		vi.mocked(promptRequired).mockImplementation((_label: string, value?: string) => Promise.resolve(value as string));
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
