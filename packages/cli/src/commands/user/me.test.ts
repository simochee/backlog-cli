import { setupMockClient } from "@repo/test-utils";
import { describe, expect, it, vi } from "vitest";

vi.mock("#utils/client.ts", () => ({ getClient: vi.fn() }));
vi.mock("#utils/format.ts", () => ({
	formatDate: vi.fn(() => "2024-01-01"),
}));
vi.mock("consola", () => import("@repo/test-utils/mock-consola"));

import { getClient } from "#utils/client.ts";
import consola from "consola";

describe("user me", () => {
	it("自分の情報を表示する", async () => {
		const mockClient = setupMockClient(getClient);
		mockClient.mockResolvedValue({
			id: 1,
			userId: "me",
			name: "My Name",
			mailAddress: "me@example.com",
			roleType: 1,
			lang: "ja",
			lastLoginTime: "2024-01-01",
		});

		const mod = await import("#commands/user/me.ts");
		await mod.default.run?.({ args: {} } as never);

		expect(mockClient).toHaveBeenCalledWith("/users/myself");
		expect(consola.log).toHaveBeenCalledWith(expect.stringContaining("My Name"));
		expect(consola.log).toHaveBeenCalledWith(expect.stringContaining("Admin"));
	});
});
