import { spyOnProcessExit } from "@repo/test-utils";
import { describe, expect, it, vi } from "vitest";

vi.mock("@repo/config", () => ({
	resolveSpace: vi.fn(),
}));

vi.mock("@repo/api", () => ({
	createClient: vi.fn(() => (() => {}) as unknown),
}));

vi.mock("consola", () => import("@repo/test-utils/mock-consola"));

import { getClient } from "#utils/client.ts";
import { createClient } from "@repo/api";
import { resolveSpace } from "@repo/config";

describe("getClient", () => {
	it("API Key 認証でクライアントを作成する", async () => {
		vi.mocked(resolveSpace).mockResolvedValue({
			host: "example.backlog.com",
			auth: { method: "api-key" as const, apiKey: "test-key" },
		});

		const result = await getClient();

		expect(createClient).toHaveBeenCalledWith({
			host: "example.backlog.com",
			apiKey: "test-key",
		});
		expect(result.host).toBe("example.backlog.com");
	});

	it("OAuth 認証でクライアントを作成する", async () => {
		vi.mocked(resolveSpace).mockResolvedValue({
			host: "example.backlog.com",
			auth: {
				method: "oauth" as const,
				accessToken: "access-token",
				refreshToken: "refresh-token",
			},
		});

		const result = await getClient();

		expect(createClient).toHaveBeenCalledWith({
			host: "example.backlog.com",
			accessToken: "access-token",
		});
		expect(result.host).toBe("example.backlog.com");
	});

	it("明示的なホスト名を resolveSpace に渡す", async () => {
		vi.mocked(resolveSpace).mockResolvedValue({
			host: "custom.backlog.com",
			auth: { method: "api-key" as const, apiKey: "key" },
		});

		await getClient("custom.backlog.com");

		expect(resolveSpace).toHaveBeenCalledWith("custom.backlog.com");
	});

	it("スペースが未設定の場合 process.exit(1) を呼ぶ", async () => {
		vi.mocked(resolveSpace).mockResolvedValue(undefined as never);
		const mockExit = spyOnProcessExit();

		await getClient();

		expect(mockExit).toHaveBeenCalledWith(1);
		mockExit.mockRestore();
	});
});
