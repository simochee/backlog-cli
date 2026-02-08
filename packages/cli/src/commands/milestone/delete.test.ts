import { setupMockClient } from "@repo/test-utils";
import { describe, expect, it, vi } from "vitest";

vi.mock("#utils/client.ts", () => ({ getClient: vi.fn() }));
vi.mock("#utils/resolve.ts", () => ({
	resolveProjectArg: vi.fn((v: string) => v),
}));
vi.mock("consola", () => import("@repo/test-utils/mock-consola"));

import { getClient } from "#utils/client.ts";
import consola from "consola";

describe("milestone delete", () => {
	it("--confirm でマイルストーンを削除する", async () => {
		const mockClient = setupMockClient(getClient);
		mockClient.mockResolvedValue({ id: 1, name: "v1.0" });

		const mod = await import("#commands/milestone/delete.ts");
		await mod.default.run?.({ args: { id: "1", project: "PROJ", confirm: true } } as never);

		expect(mockClient).toHaveBeenCalledWith("/projects/PROJ/versions/1", expect.objectContaining({ method: "DELETE" }));
		expect(consola.prompt).not.toHaveBeenCalled();
		expect(consola.success).toHaveBeenCalledWith("Deleted milestone #1: v1.0");
	});

	it("確認キャンセルで削除しない", async () => {
		setupMockClient(getClient);
		vi.mocked(consola.prompt).mockResolvedValue(false as never);

		const mod = await import("#commands/milestone/delete.ts");
		await mod.default.run?.({ args: { id: "1", project: "PROJ" } } as never);

		expect(consola.prompt).toHaveBeenCalledOnce();
		expect(consola.info).toHaveBeenCalledWith("Cancelled.");
	});
});
