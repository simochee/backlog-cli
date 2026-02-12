import mockConsola from "@repo/test-utils/mock-consola";
import { describe, expect, it, mock } from "bun:test";

mock.module("@repo/api", () => ({
	createClient: mock(),
	formatResetTime: mock(),
	exchangeAuthorizationCode: mock(),
	refreshAccessToken: mock(),
	DEFAULT_PRIORITY_ID: 3,
	PR_STATUS: { Open: 1, Closed: 2, Merged: 3 },
	PRIORITY: { High: 2, Normal: 3, Low: 4 },
	RESOLUTION: { Fixed: 0, WontFix: 1, Invalid: 2, Duplicate: 3, CannotReproduce: 4 },
}));
mock.module("@repo/config", () => ({
	loadConfig: mock(),
	writeConfig: mock(),
	addSpace: mock(),
	findSpace: mock(),
	removeSpace: mock(),
	resolveSpace: mock(),
	updateSpaceAuth: mock(),
}));
mock.module("consola", () => ({ default: mockConsola }));

const { createClient } = await import("@repo/api");
const { loadConfig } = await import("@repo/config");
const { default: consola } = await import("consola");

describe("auth status", () => {
	it("認証済みスペースのステータスを表示する", async () => {
		(loadConfig as any).mockResolvedValue({
			spaces: [
				{
					host: "example.backlog.com",
					auth: { method: "api-key" as const, apiKey: "key" },
				},
			],
			defaultSpace: "example.backlog.com",
			aliases: {},
		});

		const mockClient = mock().mockResolvedValue({
			name: "Test User",
			userId: "testuser",
		});
		(createClient as any).mockReturnValue(mockClient as never);

		const mod = await import("#commands/auth/status.ts");
		await mod.default.run?.({ args: {} } as never);

		expect(createClient).toHaveBeenCalledWith({
			host: "example.backlog.com",
			apiKey: "key",
		});
		expect(mockClient).toHaveBeenCalledWith("/users/myself");
		expect(consola.log).toHaveBeenCalledWith("  example.backlog.com (default)");
		expect(consola.log).toHaveBeenCalledWith("    Method: api-key");
		expect(consola.log).toHaveBeenCalledWith("    User:   Test User (testuser)");
		expect(consola.log).toHaveBeenCalledWith("    Status: Authenticated");
	});

	it("スペース未登録の場合メッセージを表示する", async () => {
		(loadConfig as any).mockResolvedValue({
			spaces: [],
			defaultSpace: undefined,
			aliases: {},
		});

		const mod = await import("#commands/auth/status.ts");
		await mod.default.run?.({ args: {} } as never);

		expect(consola.info).toHaveBeenCalledWith("No spaces are authenticated. Run `bl auth login` to get started.");
	});

	it("--space でフィルタして該当なしの場合メッセージを表示する", async () => {
		(loadConfig as any).mockResolvedValue({
			spaces: [
				{
					host: "example.backlog.com",
					auth: { method: "api-key" as const, apiKey: "key" },
				},
			],
			defaultSpace: undefined,
			aliases: {},
		});

		const mod = await import("#commands/auth/status.ts");
		await mod.default.run?.({
			args: { space: "other.backlog.com" },
		} as never);

		expect(consola.info).toHaveBeenCalledWith("No authentication configured for other.backlog.com.");
		expect(createClient).not.toHaveBeenCalled();
	});

	it("--show-token でトークンを表示する", async () => {
		(loadConfig as any).mockResolvedValue({
			spaces: [
				{
					host: "example.backlog.com",
					auth: { method: "api-key" as const, apiKey: "my-secret-key" },
				},
			],
			defaultSpace: undefined,
			aliases: {},
		});

		const mockClient = mock().mockResolvedValue({
			name: "Test User",
			userId: "testuser",
		});
		(createClient as any).mockReturnValue(mockClient as never);

		const mod = await import("#commands/auth/status.ts");
		await mod.default.run?.({
			args: { "show-token": true },
		} as never);

		expect(consola.log).toHaveBeenCalledWith("    Token:  my-secret-key");
	});

	it("トークン検証が失敗した場合 Authentication failed を表示する", async () => {
		(loadConfig as any).mockResolvedValue({
			spaces: [
				{
					host: "example.backlog.com",
					auth: { method: "api-key" as const, apiKey: "invalid-key" },
				},
			],
			defaultSpace: undefined,
			aliases: {},
		});

		const mockClient = mock().mockRejectedValue(new Error("Unauthorized"));
		(createClient as any).mockReturnValue(mockClient as never);

		const mod = await import("#commands/auth/status.ts");
		await mod.default.run?.({ args: {} } as never);

		expect(consola.log).toHaveBeenCalledWith("    Status: Authentication failed");
		expect(consola.debug).toHaveBeenCalledWith("Token verification failed:", expect.any(Error));
	});

	it("OAuth 認証のスペースで正しいクライアント設定を使用する", async () => {
		(loadConfig as any).mockResolvedValue({
			spaces: [
				{
					host: "example.backlog.com",
					auth: {
						method: "oauth" as const,
						accessToken: "oauth-access-token",
						refreshToken: "oauth-refresh-token",
					},
				},
			],
			defaultSpace: undefined,
			aliases: {},
		});

		const mockClient = mock().mockResolvedValue({
			name: "OAuth User",
			userId: "oauthuser",
		});
		(createClient as any).mockReturnValue(mockClient as never);

		const mod = await import("#commands/auth/status.ts");
		await mod.default.run?.({ args: {} } as never);

		expect(createClient).toHaveBeenCalledWith({
			host: "example.backlog.com",
			accessToken: "oauth-access-token",
		});
		expect(consola.log).toHaveBeenCalledWith("    Method: oauth");
		expect(consola.log).toHaveBeenCalledWith("    User:   OAuth User (oauthuser)");
	});

	it("--show-token で OAuth トークンを表示する", async () => {
		(loadConfig as any).mockResolvedValue({
			spaces: [
				{
					host: "example.backlog.com",
					auth: {
						method: "oauth" as const,
						accessToken: "oauth-access-token",
						refreshToken: "oauth-refresh-token",
					},
				},
			],
			defaultSpace: undefined,
			aliases: {},
		});

		const mockClient = mock().mockResolvedValue({
			name: "OAuth User",
			userId: "oauthuser",
		});
		(createClient as any).mockReturnValue(mockClient as never);

		const mod = await import("#commands/auth/status.ts");
		await mod.default.run?.({
			args: { "show-token": true },
		} as never);

		expect(consola.log).toHaveBeenCalledWith("    Token:  oauth-access-token");
	});

	it("デフォルトでないスペースはホスト名のみ表示する", async () => {
		(loadConfig as any).mockResolvedValue({
			spaces: [
				{
					host: "example.backlog.com",
					auth: { method: "api-key" as const, apiKey: "key" },
				},
			],
			defaultSpace: "other.backlog.com",
			aliases: {},
		});

		const mockClient = mock().mockResolvedValue({
			name: "Test User",
			userId: "testuser",
		});
		(createClient as any).mockReturnValue(mockClient as never);

		const mod = await import("#commands/auth/status.ts");
		await mod.default.run?.({ args: {} } as never);

		expect(consola.log).toHaveBeenCalledWith("  example.backlog.com");
	});
});
