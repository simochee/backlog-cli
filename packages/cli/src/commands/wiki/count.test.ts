import { setupMockClient } from "@repo/test-utils";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("#utils/client.ts", () => ({ getClient: vi.fn() }));
vi.mock("#utils/resolve.ts", () => ({
	resolveProjectArg: vi.fn((v: string) => v),
}));
vi.mock("consola", () => import("@repo/test-utils/mock-consola"));

import { getClient } from "#utils/client.ts";
import consola from "consola";

describe("wiki count", () => {
	it("Wiki ページ数を表示する", async () => {
		const mockClient = setupMockClient(getClient);
		mockClient.mockResolvedValue({ count: 42 });

		const mod = await import("#commands/wiki/count.ts");
		await mod.default.run?.({ args: { project: "PROJ" } } as never);

		expect(mockClient).toHaveBeenCalledWith(
			"/wikis/count",
			expect.objectContaining({ query: { projectIdOrKey: "PROJ" } }),
		);
		expect(consola.log).toHaveBeenCalledWith("42 wiki page(s)");
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
			mockClient.mockResolvedValue({ count: 42 });

			const mod = await import("#commands/wiki/count.ts");
			await mod.default.run?.({ args: { project: "PROJ", json: "" } } as never);

			expect(consola.log).not.toHaveBeenCalled();
			const output = JSON.parse(String(writeSpy.mock.calls[0]?.[0]).trim());
			expect(output).toEqual({ count: 42 });
		});
	});
});
