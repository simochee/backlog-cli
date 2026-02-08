vi.mock("#utils/client.ts", () => ({ getClient: vi.fn() }));
vi.mock("consola", () => ({
	default: { log: vi.fn(), info: vi.fn(), success: vi.fn(), error: vi.fn(), prompt: vi.fn() },
}));

import { getClient } from "#utils/client.ts";
import consola from "consola";
import { beforeEach, describe, expect, it, vi } from "vitest";

describe("project delete", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("--confirm でプロジェクトを削除する", async () => {
		const mockClient = vi.fn();
		vi.mocked(getClient).mockResolvedValue({ client: mockClient as never, host: "example.backlog.com" });
		mockClient.mockResolvedValue({ projectKey: "PROJ", name: "Test Project" });

		const mod = await import("#commands/project/delete.ts");
		await mod.default.run?.({ args: { "project-key": "PROJ", confirm: true } } as never);

		expect(mockClient).toHaveBeenCalledWith("/projects/PROJ", expect.objectContaining({ method: "DELETE" }));
		expect(consola.prompt).not.toHaveBeenCalled();
		expect(consola.success).toHaveBeenCalledWith("Deleted project PROJ: Test Project");
	});

	it("確認キャンセルで削除しない", async () => {
		const mockClient = vi.fn();
		vi.mocked(getClient).mockResolvedValue({ client: mockClient as never, host: "example.backlog.com" });
		vi.mocked(consola.prompt).mockResolvedValue(false as never);

		const mod = await import("#commands/project/delete.ts");
		await mod.default.run?.({ args: { "project-key": "PROJ" } } as never);

		expect(consola.prompt).toHaveBeenCalledOnce();
		expect(consola.info).toHaveBeenCalledWith("Cancelled.");
		// DELETE リクエストが送信されないことを確認
		expect(mockClient).not.toHaveBeenCalledWith("/projects/PROJ", expect.objectContaining({ method: "DELETE" }));
	});
});
