import { setupMockClient } from "@repo/test-utils";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

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

	describe("--json", () => {
		let writeSpy: ReturnType<typeof vi.spyOn>;

		beforeEach(() => {
			writeSpy = vi.spyOn(process.stdout, "write").mockImplementation(() => true);
		});

		afterEach(() => {
			writeSpy.mockRestore();
		});

		it("--json で JSON を出力する", async () => {
			const mockClient = setupMockClient(getClient);
			const data = { id: 1, userId: "user1", name: "User One", roleType: 2 };
			mockClient.mockResolvedValue(data);

			const mod = await import("#commands/user/view.ts");
			await mod.default.run?.({ args: { "user-id": "1", json: "" } } as never);

			expect(consola.log).not.toHaveBeenCalled();
			const output = JSON.parse(String(writeSpy.mock.calls[0]?.[0]).trim());
			expect(output.name).toBe("User One");
		});
	});
});
