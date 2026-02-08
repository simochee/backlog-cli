vi.mock("#utils/client.ts", () => ({ getClient: vi.fn() }));
vi.mock("consola", () => ({
	default: { log: vi.fn(), info: vi.fn(), success: vi.fn(), error: vi.fn() },
}));

import { getClient } from "#utils/client.ts";
import consola from "consola";
import { beforeEach, describe, expect, it, vi } from "vitest";

describe("project add-user", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("ユーザーを追加する", async () => {
		const mockClient = vi.fn();
		vi.mocked(getClient).mockResolvedValue({ client: mockClient as never, host: "example.backlog.com" });
		mockClient.mockResolvedValue({ id: 12_345, name: "Test User" });

		const mod = await import("#commands/project/add-user.ts");
		await mod.default.run?.({ args: { "project-key": "PROJ", "user-id": "12345" } } as never);

		expect(mockClient).toHaveBeenCalledWith(
			"/projects/PROJ/users",
			expect.objectContaining({
				method: "POST",
				body: { userId: 12_345 },
			}),
		);
		expect(consola.success).toHaveBeenCalledWith("Added user Test User to project PROJ.");
	});

	it("無効な user-id でエラー", async () => {
		const mockClient = vi.fn();
		vi.mocked(getClient).mockResolvedValue({ client: mockClient as never, host: "example.backlog.com" });

		const exitSpy = vi.spyOn(process, "exit").mockImplementation(() => undefined as never);

		const mod = await import("#commands/project/add-user.ts");
		await mod.default.run?.({ args: { "project-key": "PROJ", "user-id": "abc" } } as never);

		expect(consola.error).toHaveBeenCalledWith('Invalid user ID: "abc"');
		expect(exitSpy).toHaveBeenCalledWith(1);
		expect(mockClient).not.toHaveBeenCalled();

		exitSpy.mockRestore();
	});
});
