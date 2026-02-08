vi.mock("#utils/client.ts", () => ({ getClient: vi.fn() }));
vi.mock("consola", () => ({
	default: { log: vi.fn(), info: vi.fn(), success: vi.fn(), error: vi.fn() },
}));

import { getClient } from "#utils/client.ts";
import consola from "consola";
import { beforeEach, describe, expect, it, vi } from "vitest";

describe("project edit", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("プロジェクトを更新する", async () => {
		const mockClient = vi.fn();
		vi.mocked(getClient).mockResolvedValue({ client: mockClient as never, host: "example.backlog.com" });
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
		const mockClient = vi.fn();
		vi.mocked(getClient).mockResolvedValue({ client: mockClient as never, host: "example.backlog.com" });
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
		const callBody = mockClient.mock.calls[0][1].body;
		expect(callBody).not.toHaveProperty("name");
		expect(callBody).not.toHaveProperty("key");
	});
});
