import { spyOnProcessExit } from "@repo/test-utils";
import { describe, expect, it, vi } from "vitest";

vi.mock("@repo/api", () => ({
	createClient: vi.fn(),
	exchangeAuthorizationCode: vi.fn(),
}));

vi.mock("@repo/config", () => ({
	addSpace: vi.fn(),
	loadConfig: vi.fn(),
	resolveSpace: vi.fn(),
	updateSpaceAuth: vi.fn(),
	writeConfig: vi.fn(),
}));

vi.mock("consola", () => import("@repo/test-utils/mock-consola"));

vi.mock("#utils/oauth-callback.ts", () => ({
	startCallbackServer: vi.fn(),
}));

vi.mock("#utils/url.ts", () => ({
	openUrl: vi.fn(),
}));

import { startCallbackServer } from "#utils/oauth-callback.ts";
import { createClient, exchangeAuthorizationCode } from "@repo/api";
import { addSpace, loadConfig, resolveSpace, updateSpaceAuth, writeConfig } from "@repo/config";
import consola from "consola";

describe("auth login", () => {
	describe("api-key", () => {
		it("hostname と API キーで新規スペースを認証する", async () => {
			const mockClient = vi.fn().mockResolvedValue({
				name: "Test User",
				userId: "testuser",
			});
			vi.mocked(createClient).mockReturnValue(mockClient as never);
			vi.mocked(consola.prompt).mockResolvedValue("test-api-key" as never);
			vi.mocked(resolveSpace).mockResolvedValue(null as never);
			vi.mocked(loadConfig).mockResolvedValue({
				spaces: [],
				defaultSpace: undefined,
				aliases: {},
			});

			const mod = await import("#commands/auth/login.ts");
			await mod.default.run?.({
				args: { hostname: "example.backlog.com", method: "api-key" },
			} as never);

			expect(createClient).toHaveBeenCalledWith({
				host: "example.backlog.com",
				apiKey: "test-api-key",
			});
			expect(mockClient).toHaveBeenCalledWith("/users/myself");
			expect(addSpace).toHaveBeenCalledWith({
				host: "example.backlog.com",
				auth: { method: "api-key", apiKey: "test-api-key" },
			});
			expect(updateSpaceAuth).not.toHaveBeenCalled();
			expect(writeConfig).toHaveBeenCalledWith(
				expect.objectContaining({
					defaultSpace: "example.backlog.com",
				}),
			);
			expect(consola.success).toHaveBeenCalledWith("Logged in to example.backlog.com as Test User (testuser)");
		});

		it("既存スペースの認証情報を更新する", async () => {
			const mockClient = vi.fn().mockResolvedValue({
				name: "Test User",
				userId: "testuser",
			});
			vi.mocked(createClient).mockReturnValue(mockClient as never);
			vi.mocked(consola.prompt).mockResolvedValue("new-api-key" as never);
			vi.mocked(resolveSpace).mockResolvedValue({
				host: "example.backlog.com",
				auth: { method: "api-key" as const, apiKey: "old-api-key" },
			});
			vi.mocked(loadConfig).mockResolvedValue({
				spaces: [
					{
						host: "example.backlog.com",
						auth: { method: "api-key" as const, apiKey: "old-api-key" },
					},
				],
				defaultSpace: "example.backlog.com",
				aliases: {},
			});

			const mod = await import("#commands/auth/login.ts");
			await mod.default.run?.({
				args: { hostname: "example.backlog.com", method: "api-key" },
			} as never);

			expect(updateSpaceAuth).toHaveBeenCalledWith("example.backlog.com", {
				method: "api-key",
				apiKey: "new-api-key",
			});
			expect(addSpace).not.toHaveBeenCalled();
			expect(writeConfig).not.toHaveBeenCalled();
			expect(consola.success).toHaveBeenCalledWith("Logged in to example.backlog.com as Test User (testuser)");
		});

		it("認証失敗時にエラーを返す", async () => {
			const mockClient = vi.fn().mockRejectedValue(new Error("Unauthorized"));
			vi.mocked(createClient).mockReturnValue(mockClient as never);
			vi.mocked(consola.prompt).mockResolvedValue("bad-key" as never);
			const exitSpy = spyOnProcessExit();

			const mod = await import("#commands/auth/login.ts");
			await mod.default.run?.({
				args: { hostname: "example.backlog.com", method: "api-key" },
			} as never);

			expect(consola.error).toHaveBeenCalledWith(
				"Authentication failed. Could not connect to example.backlog.com with the provided API key.",
			);
			expect(exitSpy).toHaveBeenCalledWith(1);
			expect(addSpace).not.toHaveBeenCalled();
			expect(updateSpaceAuth).not.toHaveBeenCalled();
			exitSpy.mockRestore();
		});

		it("hostname 未指定時にプロンプトで入力を求める", async () => {
			const mockClient = vi.fn().mockResolvedValue({
				name: "Test User",
				userId: "testuser",
			});
			vi.mocked(createClient).mockReturnValue(mockClient as never);
			vi.mocked(consola.prompt)
				.mockResolvedValueOnce("prompted.backlog.com" as never)
				.mockResolvedValueOnce("test-api-key" as never);
			vi.mocked(resolveSpace).mockResolvedValue(null as never);
			vi.mocked(loadConfig).mockResolvedValue({
				spaces: [],
				defaultSpace: undefined,
				aliases: {},
			});

			const mod = await import("#commands/auth/login.ts");
			await mod.default.run?.({
				args: { method: "api-key" },
			} as never);

			expect(consola.prompt).toHaveBeenCalledWith("Backlog space hostname:", {
				type: "text",
				placeholder: "xxx.backlog.com",
			});
			expect(createClient).toHaveBeenCalledWith({
				host: "prompted.backlog.com",
				apiKey: "test-api-key",
			});
			expect(consola.success).toHaveBeenCalled();
		});

		it("hostname プロンプトで空入力の場合エラーを返す", async () => {
			vi.mocked(consola.prompt).mockResolvedValue("" as never);
			const exitSpy = spyOnProcessExit();

			const mod = await import("#commands/auth/login.ts");
			await mod.default.run?.({
				args: { method: "api-key" },
			} as never);

			expect(consola.error).toHaveBeenCalledWith("Hostname is required.");
			expect(exitSpy).toHaveBeenCalledWith(1);
			exitSpy.mockRestore();
		});

		it("API key プロンプトで空入力の場合エラーを返す", async () => {
			vi.mocked(consola.prompt).mockResolvedValue("" as never);
			const exitSpy = spyOnProcessExit();

			const mod = await import("#commands/auth/login.ts");
			await mod.default.run?.({
				args: { hostname: "example.backlog.com", method: "api-key" },
			} as never);

			expect(consola.error).toHaveBeenCalledWith("API key is required.");
			expect(exitSpy).toHaveBeenCalledWith(1);
			exitSpy.mockRestore();
		});
	});

	describe("invalid method", () => {
		it("無効な method でエラーを返す", async () => {
			const exitSpy = spyOnProcessExit();

			const mod = await import("#commands/auth/login.ts");
			await mod.default.run?.({
				args: { hostname: "example.backlog.com", method: "invalid" },
			} as never);

			expect(consola.error).toHaveBeenCalledWith('Invalid auth method. Use "api-key" or "oauth".');
			expect(exitSpy).toHaveBeenCalledWith(1);
			exitSpy.mockRestore();
		});
	});

	describe("oauth", () => {
		const setupOAuthMocks = () => {
			const mockClient = vi.fn().mockResolvedValue({
				name: "OAuth User",
				userId: "oauthuser",
			});
			vi.mocked(createClient).mockReturnValue(mockClient as never);
			vi.mocked(resolveSpace).mockResolvedValue(null as never);
			vi.mocked(loadConfig).mockResolvedValue({
				spaces: [],
				defaultSpace: undefined,
				aliases: {},
			});
			vi.mocked(exchangeAuthorizationCode).mockResolvedValue({
				access_token: "new-access-token",
				token_type: "Bearer",
				expires_in: 3600,
				refresh_token: "new-refresh-token",
			});

			const mockStop = vi.fn();
			const mockWaitForCallback = vi.fn().mockResolvedValue("auth-code-123");
			vi.mocked(startCallbackServer).mockReturnValue({
				port: 5033,
				waitForCallback: mockWaitForCallback,
				stop: mockStop,
			});

			return { mockClient, mockStop, mockWaitForCallback };
		};

		it("OAuth フローで新規スペースを認証する", async () => {
			const { mockClient } = setupOAuthMocks();

			const mod = await import("#commands/auth/login.ts");
			await mod.default.run?.({
				args: {
					hostname: "example.backlog.com",
					method: "oauth",
					"client-id": "my-client-id",
					"client-secret": "my-client-secret",
				},
			} as never);

			expect(startCallbackServer).toHaveBeenCalled();
			expect(exchangeAuthorizationCode).toHaveBeenCalledWith({
				host: "example.backlog.com",
				code: "auth-code-123",
				clientId: "my-client-id",
				clientSecret: "my-client-secret",
				redirectUri: "http://localhost:5033/callback",
			});
			expect(createClient).toHaveBeenCalledWith({
				host: "example.backlog.com",
				accessToken: "new-access-token",
			});
			expect(mockClient).toHaveBeenCalledWith("/users/myself");
			expect(addSpace).toHaveBeenCalledWith({
				host: "example.backlog.com",
				auth: {
					method: "oauth",
					accessToken: "new-access-token",
					refreshToken: "new-refresh-token",
					clientId: "my-client-id",
					clientSecret: "my-client-secret",
				},
			});
			expect(consola.success).toHaveBeenCalledWith("Logged in to example.backlog.com as OAuth User (oauthuser)");
		});

		it("コールバック待機中にエラーが発生した場合 process.exit(1) を呼ぶ", async () => {
			const mockStop = vi.fn();
			vi.mocked(startCallbackServer).mockReturnValue({
				port: 5033,
				waitForCallback: vi.fn().mockRejectedValue(new Error("OAuth callback timed out after 5 minutes")),
				stop: mockStop,
			});
			const exitSpy = spyOnProcessExit();

			const mod = await import("#commands/auth/login.ts");
			await mod.default.run?.({
				args: {
					hostname: "example.backlog.com",
					method: "oauth",
					"client-id": "my-client-id",
					"client-secret": "my-client-secret",
				},
			} as never);

			expect(consola.error).toHaveBeenCalledWith(
				"OAuth authorization failed: OAuth callback timed out after 5 minutes",
			);
			expect(exitSpy).toHaveBeenCalledWith(1);
			expect(mockStop).toHaveBeenCalled();
			exitSpy.mockRestore();
		});

		it("トークン交換に失敗した場合 process.exit(1) を呼ぶ", async () => {
			setupOAuthMocks();
			vi.mocked(exchangeAuthorizationCode).mockRejectedValue(new Error("invalid_grant"));
			const exitSpy = spyOnProcessExit();

			const mod = await import("#commands/auth/login.ts");
			await mod.default.run?.({
				args: {
					hostname: "example.backlog.com",
					method: "oauth",
					"client-id": "my-client-id",
					"client-secret": "my-client-secret",
				},
			} as never);

			expect(consola.error).toHaveBeenCalledWith("Failed to exchange authorization code for tokens.");
			expect(exitSpy).toHaveBeenCalledWith(1);
			exitSpy.mockRestore();
		});

		it("client-id 未指定時にプロンプトで入力を求める", async () => {
			setupOAuthMocks();
			vi.mocked(consola.prompt).mockResolvedValueOnce("prompted-client-id" as never);

			const mod = await import("#commands/auth/login.ts");
			await mod.default.run?.({
				args: {
					hostname: "example.backlog.com",
					method: "oauth",
					"client-secret": "my-client-secret",
				},
			} as never);

			expect(consola.prompt).toHaveBeenCalledWith("OAuth Client ID:", { type: "text" });
			expect(exchangeAuthorizationCode).toHaveBeenCalledWith(
				expect.objectContaining({ clientId: "prompted-client-id" }),
			);
		});

		it("client-secret 未指定時にプロンプトで入力を求める", async () => {
			setupOAuthMocks();
			vi.mocked(consola.prompt).mockResolvedValueOnce("prompted-client-secret" as never);

			const mod = await import("#commands/auth/login.ts");
			await mod.default.run?.({
				args: {
					hostname: "example.backlog.com",
					method: "oauth",
					"client-id": "my-client-id",
				},
			} as never);

			expect(consola.prompt).toHaveBeenCalledWith("OAuth Client Secret:", { type: "text" });
			expect(exchangeAuthorizationCode).toHaveBeenCalledWith(
				expect.objectContaining({ clientSecret: "prompted-client-secret" }),
			);
		});

		it("client-secret プロンプトで空入力の場合エラーを返す", async () => {
			vi.mocked(consola.prompt).mockResolvedValueOnce("" as never);
			const exitSpy = spyOnProcessExit();

			const mod = await import("#commands/auth/login.ts");
			await mod.default.run?.({
				args: {
					hostname: "example.backlog.com",
					method: "oauth",
					"client-id": "my-client-id",
				},
			} as never);

			expect(consola.error).toHaveBeenCalledWith("Client Secret is required.");
			expect(exitSpy).toHaveBeenCalledWith(1);
			exitSpy.mockRestore();
		});

		it("トークン検証に失敗した場合 process.exit(1) を呼ぶ", async () => {
			setupOAuthMocks();
			const mockClient = vi.fn().mockRejectedValue(new Error("Unauthorized"));
			vi.mocked(createClient).mockReturnValue(mockClient as never);
			const exitSpy = spyOnProcessExit();

			const mod = await import("#commands/auth/login.ts");
			await mod.default.run?.({
				args: {
					hostname: "example.backlog.com",
					method: "oauth",
					"client-id": "my-client-id",
					"client-secret": "my-client-secret",
				},
			} as never);

			expect(consola.error).toHaveBeenCalledWith("Authentication verification failed.");
			expect(exitSpy).toHaveBeenCalledWith(1);
			exitSpy.mockRestore();
		});

		it("既存スペースの OAuth 認証情報を更新する", async () => {
			setupOAuthMocks();
			vi.mocked(resolveSpace).mockResolvedValue({
				host: "example.backlog.com",
				auth: {
					method: "oauth" as const,
					accessToken: "old-access",
					refreshToken: "old-refresh",
					clientId: "old-client-id",
					clientSecret: "old-client-secret",
				},
			});
			vi.mocked(loadConfig).mockResolvedValue({
				spaces: [
					{
						host: "example.backlog.com",
						auth: {
							method: "oauth" as const,
							accessToken: "old-access",
							refreshToken: "old-refresh",
							clientId: "old-client-id",
							clientSecret: "old-client-secret",
						},
					},
				],
				defaultSpace: "example.backlog.com",
				aliases: {},
			});

			const mod = await import("#commands/auth/login.ts");
			await mod.default.run?.({
				args: {
					hostname: "example.backlog.com",
					method: "oauth",
					"client-id": "my-client-id",
					"client-secret": "my-client-secret",
				},
			} as never);

			expect(updateSpaceAuth).toHaveBeenCalledWith("example.backlog.com", {
				method: "oauth",
				accessToken: "new-access-token",
				refreshToken: "new-refresh-token",
				clientId: "my-client-id",
				clientSecret: "my-client-secret",
			});
			expect(addSpace).not.toHaveBeenCalled();
			expect(writeConfig).not.toHaveBeenCalled();
		});

		it("client-id プロンプトで空入力の場合エラーを返す", async () => {
			vi.mocked(consola.prompt).mockResolvedValueOnce("" as never);
			const exitSpy = spyOnProcessExit();

			const mod = await import("#commands/auth/login.ts");
			await mod.default.run?.({
				args: {
					hostname: "example.backlog.com",
					method: "oauth",
				},
			} as never);

			expect(consola.error).toHaveBeenCalledWith("Client ID is required.");
			expect(exitSpy).toHaveBeenCalledWith(1);
			exitSpy.mockRestore();
		});
	});
});
