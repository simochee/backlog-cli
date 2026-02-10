import { spyOnProcessExit } from "@repo/test-utils";
import { beforeEach, describe, expect, it, vi } from "vitest";

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
	beforeEach(() => {
		vi.clearAllMocks();
		delete process.env["BACKLOG_API_KEY"];
		delete process.env["BACKLOG_SPACE"];
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

		// OAuth の場合は createClient を使わず、ofetch.create を直接使用する
		expect(createClient).not.toHaveBeenCalled();
		expect(result.host).toBe("example.backlog.com");
		expect(result.client).toBeTypeOf("function");
	});

	it("明示的なホスト名を resolveSpace に渡す", async () => {
		vi.mocked(resolveSpace).mockResolvedValue({
			host: "custom.backlog.com",
			auth: { method: "api-key" as const, apiKey: "key" },
		});

		await getClient("custom.backlog.com");

		expect(resolveSpace).toHaveBeenCalledWith("custom.backlog.com");
	});

	it("設定ファイルのスペースが BACKLOG_API_KEY より優先される", async () => {
		vi.mocked(resolveSpace).mockResolvedValue({
			host: "configured.backlog.com",
			auth: { method: "api-key" as const, apiKey: "configured-key" },
		});
		process.env["BACKLOG_API_KEY"] = "env-key";
		process.env["BACKLOG_SPACE"] = "configured.backlog.com";

		const result = await getClient();

		expect(createClient).toHaveBeenCalledWith({
			host: "configured.backlog.com",
			apiKey: "configured-key",
		});
		expect(result.host).toBe("configured.backlog.com");
	});

	it("BACKLOG_API_KEY と BACKLOG_SPACE でフォールバック認証する", async () => {
		vi.mocked(resolveSpace).mockResolvedValue(null);
		process.env["BACKLOG_API_KEY"] = "env-api-key";
		process.env["BACKLOG_SPACE"] = "env.backlog.com";

		const result = await getClient();

		expect(createClient).toHaveBeenCalledWith({
			host: "env.backlog.com",
			apiKey: "env-api-key",
		});
		expect(result.host).toBe("env.backlog.com");
	});

	it("BACKLOG_API_KEY と明示的ホスト名でフォールバック認証する", async () => {
		vi.mocked(resolveSpace).mockResolvedValue(null);
		process.env["BACKLOG_API_KEY"] = "env-api-key";

		const result = await getClient("explicit.backlog.com");

		expect(createClient).toHaveBeenCalledWith({
			host: "explicit.backlog.com",
			apiKey: "env-api-key",
		});
		expect(result.host).toBe("explicit.backlog.com");
	});

	it("BACKLOG_API_KEY のみで BACKLOG_SPACE がない場合 process.exit(1) を呼ぶ", async () => {
		vi.mocked(resolveSpace).mockResolvedValue(null);
		process.env["BACKLOG_API_KEY"] = "env-api-key";
		const mockExit = spyOnProcessExit();

		await getClient();

		expect(mockExit).toHaveBeenCalledWith(1);
		mockExit.mockRestore();
	});

	it("スペースが未設定で環境変数もない場合 process.exit(1) を呼ぶ", async () => {
		vi.mocked(resolveSpace).mockResolvedValue(null);
		const mockExit = spyOnProcessExit();

		await getClient();

		expect(mockExit).toHaveBeenCalledWith(1);
		mockExit.mockRestore();
	});
});
