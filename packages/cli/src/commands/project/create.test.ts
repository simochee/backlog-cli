vi.mock("#utils/client.ts", () => ({ getClient: vi.fn() }));
vi.mock("#utils/prompt.ts", () => {
	const fn = vi.fn();
	return { default: fn, promptRequired: fn };
});
vi.mock("consola", () => ({
	default: { log: vi.fn(), success: vi.fn() },
}));

import { getClient } from "#utils/client.ts";
import { promptRequired } from "#utils/prompt.ts";
import consola from "consola";
import { beforeEach, describe, expect, it, vi } from "vitest";

describe("project create", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		vi.mocked(promptRequired).mockImplementation((_label, value) => Promise.resolve(value as string));
	});

	it("プロジェクトを作成する", async () => {
		const mockClient = vi.fn();
		vi.mocked(getClient).mockResolvedValue({ client: mockClient as never, host: "example.backlog.com" });
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
		const mockClient = vi.fn();
		vi.mocked(getClient).mockResolvedValue({ client: mockClient as never, host: "example.backlog.com" });
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
