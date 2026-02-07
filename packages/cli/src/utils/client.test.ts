import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock<typeof import("@repo/config")>("@repo/config", () => ({
	resolveSpace: vi.fn(),
}));

vi.mock<typeof import("@repo/api")>("@repo/api", () => ({
	createClient: vi.fn(() => (() => {}) as unknown),
}));

vi.mock<typeof import("consola")>("consola", () => ({
	default: { error: vi.fn() },
}));

import { createClient } from "@repo/api";
import { resolveSpace } from "@repo/config";
import { getClient } from "#utils/client.ts";

describe("getClient", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

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
		const mockExit = vi
			.spyOn(process, "exit")
			.mockImplementation(() => undefined as never);

		await getClient();

		expect(mockExit).toHaveBeenCalledWith(1);
		mockExit.mockRestore();
	});
});
