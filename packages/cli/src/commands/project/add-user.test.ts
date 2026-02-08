import { setupMockClient, spyOnProcessExit } from "@repo/test-utils";
import { describe, expect, it, vi } from "vitest";

vi.mock("#utils/client.ts", () => ({ getClient: vi.fn() }));
vi.mock("consola", () => import("@repo/test-utils/mock-consola"));

import { getClient } from "#utils/client.ts";
import consola from "consola";

describe("project add-user", () => {
	it("ユーザーを追加する", async () => {
		const mockClient = setupMockClient(getClient);
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
		const mockClient = setupMockClient(getClient);

		const exitSpy = spyOnProcessExit();

		const mod = await import("#commands/project/add-user.ts");
		await mod.default.run?.({ args: { "project-key": "PROJ", "user-id": "abc" } } as never);

		expect(consola.error).toHaveBeenCalledWith('Invalid user ID: "abc"');
		expect(exitSpy).toHaveBeenCalledWith(1);
		expect(mockClient).not.toHaveBeenCalled();

		exitSpy.mockRestore();
	});
});
