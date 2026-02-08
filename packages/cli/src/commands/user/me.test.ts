import { setupMockClient } from "@repo/test-utils";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

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
			const data = { id: 1, userId: "me", name: "My Name", roleType: 1 };
			mockClient.mockResolvedValue(data);

			const mod = await import("#commands/user/me.ts");
			await mod.default.run?.({ args: { json: "" } } as never);

			expect(consola.log).not.toHaveBeenCalled();
			const output = JSON.parse(String(writeSpy.mock.calls[0]?.[0]).trim());
			expect(output.name).toBe("My Name");
		});
	});
});
