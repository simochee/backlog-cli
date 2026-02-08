import { setupMockClient } from "@repo/test-utils";
import { describe, expect, it, vi } from "vitest";

vi.mock("#utils/client.ts", () => ({ getClient: vi.fn() }));
vi.mock("consola", () => import("@repo/test-utils/mock-consola"));

import { getClient } from "#utils/client.ts";
import consola from "consola";

describe("space info run()", () => {
	it("スペース情報を表示する", async () => {
		const mockClient = setupMockClient(getClient);
		mockClient.mockResolvedValue({
			name: "Test Space",
			spaceKey: "TEST",
			ownerId: 12_345,
			lang: "ja",
			timezone: "Asia/Tokyo",
			textFormattingRule: "markdown",
			reportSendTime: "08:00:00",
			created: "2024-01-01T00:00:00Z",
			updated: "2024-06-01T00:00:00Z",
		});

		const mod = await import("#commands/space/info.ts");
		await mod.default.run?.({} as never);

		expect(mockClient).toHaveBeenCalledWith("/space");
		expect(consola.log).toHaveBeenCalledWith(expect.stringContaining("Test Space"));
		expect(consola.log).toHaveBeenCalledWith(expect.stringContaining("Space Key:"));
		expect(consola.log).toHaveBeenCalledWith(expect.stringContaining("TEST"));
		expect(consola.log).toHaveBeenCalledWith(expect.stringContaining("Owner ID:"));
		expect(consola.log).toHaveBeenCalledWith(expect.stringContaining("12345"));
		expect(consola.log).toHaveBeenCalledWith(expect.stringContaining("Language:"));
		expect(consola.log).toHaveBeenCalledWith(expect.stringContaining("ja"));
		expect(consola.log).toHaveBeenCalledWith(expect.stringContaining("Timezone:"));
		expect(consola.log).toHaveBeenCalledWith(expect.stringContaining("Asia/Tokyo"));
		expect(consola.log).toHaveBeenCalledWith(expect.stringContaining("Text Formatting:"));
		expect(consola.log).toHaveBeenCalledWith(expect.stringContaining("markdown"));
		expect(consola.log).toHaveBeenCalledWith(expect.stringContaining("Report Send Time:"));
		expect(consola.log).toHaveBeenCalledWith(expect.stringContaining("08:00:00"));
		expect(consola.log).toHaveBeenCalledWith(expect.stringContaining("Created:"));
		expect(consola.log).toHaveBeenCalledWith(expect.stringContaining("Updated:"));
	});
});
