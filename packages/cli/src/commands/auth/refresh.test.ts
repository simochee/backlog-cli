import { spyOnProcessExit } from "@repo/test-utils";
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

const { createClient, refreshAccessToken } = await import("@repo/api");
const { resolveSpace, updateSpaceAuth } = await import("@repo/config");
const { default: consola } = await import("consola");

describe("auth refresh", () => {
	it("スペースが未設定の場合 process.exit(1) を呼ぶ", async () => {
		(resolveSpace as any).mockResolvedValue(null as never);
		const exitSpy = spyOnProcessExit();

		const mod = await import("#commands/auth/refresh.ts");
		await mod.default.run?.({ args: {} } as never);

		expect(consola.error).toHaveBeenCalledWith("No space configured. Run `bl auth login` to authenticate.");
		expect(exitSpy).toHaveBeenCalledWith(1);
		exitSpy.mockRestore();
	});

	it("API Key 認証の場合エラーを出す", async () => {
		(resolveSpace as any).mockResolvedValue({
			host: "example.backlog.com",
			auth: { method: "api-key" as const, apiKey: "key" },
		});
		const exitSpy = spyOnProcessExit();

		const mod = await import("#commands/auth/refresh.ts");
		await mod.default.run?.({ args: {} } as never);

		expect(consola.error).toHaveBeenCalledWith(
			"Token refresh is only available for OAuth authentication. Current space uses API key.",
		);
		expect(exitSpy).toHaveBeenCalledWith(1);
		exitSpy.mockRestore();
	});

	it("clientId/clientSecret が欠落している場合エラーを出す", async () => {
		(resolveSpace as any).mockResolvedValue({
			host: "example.backlog.com",
			auth: {
				method: "oauth" as const,
				accessToken: "access",
				refreshToken: "refresh",
			},
		});
		const exitSpy = spyOnProcessExit();

		const mod = await import("#commands/auth/refresh.ts");
		await mod.default.run?.({ args: {} } as never);

		expect(consola.error).toHaveBeenCalledWith(
			"Client ID and Client Secret are missing from the stored OAuth configuration. Please re-authenticate with `bl auth login -m oauth`.",
		);
		expect(exitSpy).toHaveBeenCalledWith(1);
		exitSpy.mockRestore();
	});

	it("正常にトークンをリフレッシュする", async () => {
		(resolveSpace as any).mockResolvedValue({
			host: "example.backlog.com",
			auth: {
				method: "oauth" as const,
				accessToken: "old-access",
				refreshToken: "old-refresh",
				clientId: "client-id",
				clientSecret: "client-secret",
			},
		});
		(refreshAccessToken as any).mockResolvedValue({
			access_token: "new-access",
			token_type: "Bearer",
			expires_in: 3600,
			refresh_token: "new-refresh",
		});
		const mockClient = mock().mockResolvedValue({
			name: "Test User",
			userId: "testuser",
		});
		(createClient as any).mockReturnValue(mockClient as never);

		const mod = await import("#commands/auth/refresh.ts");
		await mod.default.run?.({ args: {} } as never);

		expect(refreshAccessToken).toHaveBeenCalledWith({
			host: "example.backlog.com",
			refreshToken: "old-refresh",
			clientId: "client-id",
			clientSecret: "client-secret",
		});
		expect(createClient).toHaveBeenCalledWith({
			host: "example.backlog.com",
			accessToken: "new-access",
		});
		expect(mockClient).toHaveBeenCalledWith("/users/myself");
		expect(updateSpaceAuth).toHaveBeenCalledWith("example.backlog.com", {
			method: "oauth",
			accessToken: "new-access",
			refreshToken: "new-refresh",
			clientId: "client-id",
			clientSecret: "client-secret",
		});
		expect(consola.success).toHaveBeenCalledWith("Token refreshed for example.backlog.com (Test User)");
	});

	it("リフレッシュ失敗時にエラーを出す", async () => {
		(resolveSpace as any).mockResolvedValue({
			host: "example.backlog.com",
			auth: {
				method: "oauth" as const,
				accessToken: "old-access",
				refreshToken: "expired-refresh",
				clientId: "client-id",
				clientSecret: "client-secret",
			},
		});
		(refreshAccessToken as any).mockRejectedValue(new Error("invalid_grant"));
		const exitSpy = spyOnProcessExit();

		const mod = await import("#commands/auth/refresh.ts");
		await mod.default.run?.({ args: {} } as never);

		expect(consola.error).toHaveBeenCalledWith(
			"Failed to refresh OAuth token. Please re-authenticate with `bl auth login -m oauth`.",
		);
		expect(exitSpy).toHaveBeenCalledWith(1);
		exitSpy.mockRestore();
	});

	it("トークン検証に失敗した場合エラーを出す", async () => {
		(resolveSpace as any).mockResolvedValue({
			host: "example.backlog.com",
			auth: {
				method: "oauth" as const,
				accessToken: "old-access",
				refreshToken: "old-refresh",
				clientId: "client-id",
				clientSecret: "client-secret",
			},
		});
		(refreshAccessToken as any).mockResolvedValue({
			access_token: "bad-access",
			token_type: "Bearer",
			expires_in: 3600,
			refresh_token: "new-refresh",
		});
		const mockClient = mock().mockRejectedValue(new Error("Unauthorized"));
		(createClient as any).mockReturnValue(mockClient as never);
		const exitSpy = spyOnProcessExit();

		const mod = await import("#commands/auth/refresh.ts");
		await mod.default.run?.({ args: {} } as never);

		expect(consola.error).toHaveBeenCalledWith("Token verification failed after refresh.");
		expect(exitSpy).toHaveBeenCalledWith(1);
		exitSpy.mockRestore();
	});
});
