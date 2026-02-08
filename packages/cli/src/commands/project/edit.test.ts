import { setupMockClient } from "@repo/test-utils";
import { describe, expect, it, vi } from "vitest";

vi.mock("#utils/client.ts", () => ({ getClient: vi.fn() }));
vi.mock("consola", () => import("@repo/test-utils/mock-consola"));

import { getClient } from "#utils/client.ts";
import consola from "consola";

describe("project edit", () => {
	it("プロジェクトを更新する", async () => {
		const mockClient = setupMockClient(getClient);
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
		const mockClient = setupMockClient(getClient);
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
		const callBody = mockClient.mock.calls[0]?.[1]?.body;
		expect(callBody).not.toHaveProperty("name");
		expect(callBody).not.toHaveProperty("key");
	});
});
