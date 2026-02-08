import { setupMockClient } from "@repo/test-utils";
import { describe, expect, it, vi } from "vitest";

vi.mock("#utils/client.ts", () => ({ getClient: vi.fn() }));
vi.mock("#utils/format.ts", () => ({
	formatDate: vi.fn(() => "2024-01-01"),
}));
vi.mock("consola", () => import("@repo/test-utils/mock-consola"));

import { getClient } from "#utils/client.ts";
import consola from "consola";

describe("user view", () => {
	it("ユーザー詳細を表示する", async () => {
		const mockClient = setupMockClient(getClient);
		mockClient.mockResolvedValue({
			id: 1,
			userId: "user1",
			name: "User One",
			mailAddress: "user1@example.com",
			roleType: 2,
			lang: "ja",
			lastLoginTime: "2024-01-01",
		});

		const mod = await import("#commands/user/view.ts");
		await mod.default.run?.({ args: { "user-id": "1" } } as never);

		expect(mockClient).toHaveBeenCalledWith("/users/1");
		expect(consola.log).toHaveBeenCalledWith(expect.stringContaining("User One"));
		expect(consola.log).toHaveBeenCalledWith(expect.stringContaining("Normal"));
	});
});
