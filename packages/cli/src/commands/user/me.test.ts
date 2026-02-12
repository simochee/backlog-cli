import { setupMockClient } from "@repo/test-utils";
import mockConsola from "@repo/test-utils/mock-consola";
import { afterEach, beforeEach, describe, expect, it, mock, spyOn } from "bun:test";

mock.module("#utils/client.ts", () => ({ getClient: mock() }));
mock.module("#utils/format.ts", () => ({
	formatDate: mock(() => "2024-01-01"),
}));
mock.module("consola", () => ({ default: mockConsola }));

const { getClient } = await import("#utils/client.ts");
const { default: consola } = await import("consola");

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
		let writeSpy: ReturnType<typeof spyOn>;

		beforeEach(() => {
			writeSpy = spyOn(process.stdout, "write").mockImplementation(() => true);
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
