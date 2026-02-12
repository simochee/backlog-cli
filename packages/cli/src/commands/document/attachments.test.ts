import { setupMockClient } from "@repo/test-utils";
import { afterEach, beforeEach, describe, expect, it, mock, spyOn } from "bun:test";

mock.module("#utils/client.ts", () => ({ getClient: mock() }));
mock.module("#utils/format.ts", () => ({
	padEnd: mock((s: string, n: number) => s.padEnd(n)),
}));
mock.module("consola", () => import("@repo/test-utils/mock-consola"));

import { getClient } from "#utils/client.ts";
import consola from "consola";

describe("document attachments", () => {
	it("ドキュメントの添付ファイル一覧を表示する", async () => {
		const mockClient = setupMockClient(getClient);
		mockClient.mockResolvedValue({
			id: "abc-123",
			attachments: [
				{ id: 1, name: "file.txt", size: 1024 },
				{ id: 2, name: "image.png", size: 2048 },
			],
		});

		const mod = await import("#commands/document/attachments.ts");
		await mod.default.run?.({ args: { "document-id": "abc-123" } } as never);

		expect(mockClient).toHaveBeenCalledWith("/documents/abc-123");
		expect(consola.log).toHaveBeenCalledTimes(3);
	});

	it("0件の場合メッセージ表示", async () => {
		const mockClient = setupMockClient(getClient);
		mockClient.mockResolvedValue({ id: "abc-123", attachments: [] });

		const mod = await import("#commands/document/attachments.ts");
		await mod.default.run?.({ args: { "document-id": "abc-123" } } as never);

		expect(consola.info).toHaveBeenCalledWith("No attachments found.");
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
			const attachments = [{ id: 1, name: "file.txt", size: 1024 }];
			mockClient.mockResolvedValue({ id: "abc-123", attachments });

			const mod = await import("#commands/document/attachments.ts");
			await mod.default.run?.({ args: { "document-id": "abc-123", json: "" } } as never);

			expect(consola.log).not.toHaveBeenCalled();
			const output = JSON.parse(String(writeSpy.mock.calls[0]?.[0]).trim());
			expect(output).toEqual(attachments);
		});
	});
});
