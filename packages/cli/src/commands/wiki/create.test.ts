import { setupMockClient } from "@repo/test-utils";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("#utils/client.ts", () => ({ getClient: vi.fn() }));
vi.mock("#utils/resolve.ts", () => ({
	resolveProjectArg: vi.fn((v: string) => v),
	resolveProjectId: vi.fn(() => Promise.resolve(100)),
}));
vi.mock("#utils/prompt.ts", () => {
	const fn = vi.fn();
	return { default: fn, promptRequired: fn };
});
vi.mock("consola", () => import("@repo/test-utils/mock-consola"));

import { getClient } from "#utils/client.ts";
import promptRequired from "#utils/prompt.ts";
import consola from "consola";

describe("wiki create", () => {
	beforeEach(() => {
		vi.mocked(promptRequired).mockImplementation((_label: string, value?: string) => Promise.resolve(value as string));
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
