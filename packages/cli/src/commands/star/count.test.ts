import { setupMockClient } from "@repo/test-utils";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("#utils/client.ts", () => ({ getClient: vi.fn() }));
vi.mock("consola", () => import("@repo/test-utils/mock-consola"));

import { getClient } from "#utils/client.ts";
import consola from "consola";

describe("star count", () => {
	it("スター数を表示する", async () => {
		const mockClient = setupMockClient(getClient);
		mockClient.mockResolvedValueOnce({ count: 42 });

		const mod = await import("#commands/star/count.ts");
		await mod.default.run?.({ args: { "user-id": "123" } } as never);

		expect(mockClient).toHaveBeenCalledWith("/users/123/stars/count", expect.objectContaining({ query: {} }));
		expect(consola.log).toHaveBeenCalledWith("42 star(s)");
	});

	it("user-id 省略時に自分の ID を取得する", async () => {
		const mockClient = setupMockClient(getClient);
		// GET /users/myself → GET /users/789/stars/count
		mockClient.mockResolvedValueOnce({ id: 789 }).mockResolvedValueOnce({ count: 10 });

		const mod = await import("#commands/star/count.ts");
		await mod.default.run?.({ args: { "user-id": undefined } } as never);

		expect(mockClient).toHaveBeenCalledWith("/users/myself");
		expect(mockClient).toHaveBeenCalledWith("/users/789/stars/count", expect.objectContaining({ query: {} }));
		expect(consola.log).toHaveBeenCalledWith("10 star(s)");
	});

	it("since と until を指定する", async () => {
		const mockClient = setupMockClient(getClient);
		mockClient.mockResolvedValueOnce({ count: 5 });

		const mod = await import("#commands/star/count.ts");
		await mod.default.run?.({
			args: { "user-id": "123", since: "2025-01-01", until: "2025-12-31" },
		} as never);

		expect(mockClient).toHaveBeenCalledWith(
			"/users/123/stars/count",
			expect.objectContaining({
				query: { since: "2025-01-01", until: "2025-12-31" },
			}),
		);
		expect(consola.log).toHaveBeenCalledWith("5 star(s)");
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
			mockClient.mockResolvedValueOnce({ count: 42 });

			const mod = await import("#commands/star/count.ts");
			await mod.default.run?.({ args: { "user-id": "123", json: "" } } as never);

			expect(consola.log).not.toHaveBeenCalled();
			const output = JSON.parse(String(writeSpy.mock.calls[0]?.[0]).trim());
			expect(output).toEqual({ count: 42 });
		});
	});
});
