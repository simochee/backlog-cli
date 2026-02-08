import { setupMockClient } from "@repo/test-utils";
import { describe, expect, it, vi } from "vitest";

vi.mock("#utils/client.ts", () => ({ getClient: vi.fn() }));
vi.mock("consola", () => import("@repo/test-utils/mock-consola"));

import { getClient } from "#utils/client.ts";
import consola from "consola";

describe("notification count", () => {
	it("未読通知数を表示する", async () => {
		const mockClient = setupMockClient(getClient);
		mockClient.mockResolvedValue({ count: 5 });

		const mod = await import("#commands/notification/count.ts");
		await mod.default.run?.({ args: {} } as never);

		expect(mockClient).toHaveBeenCalledWith("/notifications/count", expect.objectContaining({ query: {} }));
		expect(consola.log).toHaveBeenCalledWith("5 notification(s)");
	});

	it("--already-read クエリを含める", async () => {
		const mockClient = setupMockClient(getClient);
		mockClient.mockResolvedValue({ count: 10 });

		const mod = await import("#commands/notification/count.ts");
		await mod.default.run?.({ args: { "already-read": true } } as never);

		expect(mockClient).toHaveBeenCalledWith(
			"/notifications/count",
			expect.objectContaining({ query: { alreadyRead: true } }),
		);
	});
});
