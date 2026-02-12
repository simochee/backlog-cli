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

mock.module("#utils/oauth-callback.ts", () => ({
	startCallbackServer: mock(),
}));

mock.module("#utils/url.ts", () => ({
	openUrl: mock(),
}));

// Provide real-like promptRequired behavior (delegates to consola.prompt)
// Needed because other test files mock #utils/prompt.ts globally in bun:test
mock.module("#utils/prompt.ts", () => ({
	default: mock(async (label: string, existing?: string, options?: { placeholder?: string }) => {
		if (existing) return existing;
		const { default: c } = await import("consola");
		const value = await c.prompt(label, { type: "text", ...options });
		if (typeof value !== "string" || !value) {
			c.error(`${label.replace(/:$/, "")} is required.`);
			return process.exit(1);
		}
		return value;
	}),
	confirmOrExit: mock(async (_msg: string, skip?: boolean) => {
		if (skip) return true;
		const { default: c } = await import("consola");
		const confirmed = await c.prompt(_msg, { type: "confirm" });
		if (!confirmed) {
			c.info("Cancelled.");
			return false;
		}
		return true;
	}),
}));

const { startCallbackServer } = await import("#utils/oauth-callback.ts");
const { createClient, exchangeAuthorizationCode } = await import("@repo/api");
const { addSpace, loadConfig, resolveSpace, updateSpaceAuth, writeConfig } = await import("@repo/config");
const { default: consola } = await import("consola");

describe("auth login", () => {
	describe("api-key", () => {
		it("--space と API キーで新規スペースを認証する", async () => {
			const mockClient = mock().mockResolvedValue({
				name: "Test User",
				userId: "testuser",
			});
			(createClient as any).mockReturnValue(mockClient as never);
			(consola.prompt as any).mockResolvedValue("test-api-key" as never);
			(resolveSpace as any).mockResolvedValue(null as never);
			(loadConfig as any).mockResolvedValue({
				spaces: [],
				defaultSpace: undefined,
				aliases: {},
			});

			const mod = await import("#commands/auth/login.ts");
			await mod.default.run?.({
				args: { space: "example.backlog.com", method: "api-key" },
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
			const mockClient = mock().mockResolvedValue({
				name: "Test User",
				userId: "testuser",
			});
			(createClient as any).mockReturnValue(mockClient as never);
			(consola.prompt as any).mockResolvedValue("new-api-key" as never);
			(resolveSpace as any).mockResolvedValue({
				host: "example.backlog.com",
				auth: { method: "api-key" as const, apiKey: "old-api-key" },
			});
			(loadConfig as any).mockResolvedValue({
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
				args: { space: "example.backlog.com", method: "api-key" },
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
			const mockClient = mock().mockRejectedValue(new Error("Unauthorized"));
			(createClient as any).mockReturnValue(mockClient as never);
			(consola.prompt as any).mockResolvedValue("bad-key" as never);
			const exitSpy = spyOnProcessExit();

			const mod = await import("#commands/auth/login.ts");
			await mod.default.run?.({
				args: { space: "example.backlog.com", method: "api-key" },
			} as never);

			expect(consola.error).toHaveBeenCalledWith(
				"Authentication failed. Could not connect to example.backlog.com with the provided API key.",
			);
			expect(exitSpy).toHaveBeenCalledWith(1);
			expect(addSpace).not.toHaveBeenCalled();
			expect(updateSpaceAuth).not.toHaveBeenCalled();
			exitSpy.mockRestore();
		});

		it("--space 未指定時にプロンプトで入力を求める", async () => {
			const mockClient = mock().mockResolvedValue({
				name: "Test User",
				userId: "testuser",
			});
			(createClient as any).mockReturnValue(mockClient as never);
			(consola.prompt as any)
				.mockResolvedValueOnce("prompted.backlog.com" as never)
				.mockResolvedValueOnce("test-api-key" as never);
			(resolveSpace as any).mockResolvedValue(null as never);
			(loadConfig as any).mockResolvedValue({
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

		it("--space プロンプトで空入力の場合エラーを返す", async () => {
			(consola.prompt as any).mockResolvedValue("" as never);
			const exitSpy = spyOnProcessExit();

			const mod = await import("#commands/auth/login.ts");
			await mod.default.run?.({
				args: { method: "api-key" },
			} as never);

			expect(consola.error).toHaveBeenCalledWith("Backlog space hostname is required.");
			expect(exitSpy).toHaveBeenCalledWith(1);
			exitSpy.mockRestore();
		});

		it("API key プロンプトで空入力の場合エラーを返す", async () => {
			(consola.prompt as any).mockResolvedValue("" as never);
			const exitSpy = spyOnProcessExit();

			const mod = await import("#commands/auth/login.ts");
			await mod.default.run?.({
				args: { space: "example.backlog.com", method: "api-key" },
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
				args: { space: "example.backlog.com", method: "invalid" },
			} as never);

			expect(consola.error).toHaveBeenCalledWith('Invalid auth method. Use "api-key" or "oauth".');
			expect(exitSpy).toHaveBeenCalledWith(1);
			exitSpy.mockRestore();
		});
	});

	describe("oauth", () => {
		const setupOAuthMocks = () => {
			const mockClient = mock().mockResolvedValue({
				name: "OAuth User",
				userId: "oauthuser",
			});
			(createClient as any).mockReturnValue(mockClient as never);
			(resolveSpace as any).mockResolvedValue(null as never);
			(loadConfig as any).mockResolvedValue({
				spaces: [],
				defaultSpace: undefined,
				aliases: {},
			});
			(exchangeAuthorizationCode as any).mockResolvedValue({
				access_token: "new-access-token",
				token_type: "Bearer",
				expires_in: 3600,
				refresh_token: "new-refresh-token",
			});

			const mockStop = mock();
			const mockWaitForCallback = mock().mockResolvedValue("auth-code-123");
			(startCallbackServer as any).mockReturnValue({
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
					space: "example.backlog.com",
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
			const mockStop = mock();
			(startCallbackServer as any).mockReturnValue({
				port: 5033,
				waitForCallback: mock().mockRejectedValue(new Error("OAuth callback timed out after 5 minutes")),
				stop: mockStop,
			});
			const exitSpy = spyOnProcessExit();

			const mod = await import("#commands/auth/login.ts");
			await mod.default.run?.({
				args: {
					space: "example.backlog.com",
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
			(exchangeAuthorizationCode as any).mockRejectedValue(new Error("invalid_grant"));
			const exitSpy = spyOnProcessExit();

			const mod = await import("#commands/auth/login.ts");
			await mod.default.run?.({
				args: {
					space: "example.backlog.com",
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
			(consola.prompt as any).mockResolvedValueOnce("prompted-client-id" as never);

			const mod = await import("#commands/auth/login.ts");
			await mod.default.run?.({
				args: {
					space: "example.backlog.com",
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
			(consola.prompt as any).mockResolvedValueOnce("prompted-client-secret" as never);

			const mod = await import("#commands/auth/login.ts");
			await mod.default.run?.({
				args: {
					space: "example.backlog.com",
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
			(consola.prompt as any).mockResolvedValueOnce("" as never);
			const exitSpy = spyOnProcessExit();

			const mod = await import("#commands/auth/login.ts");
			await mod.default.run?.({
				args: {
					space: "example.backlog.com",
					method: "oauth",
					"client-id": "my-client-id",
				},
			} as never);

			expect(consola.error).toHaveBeenCalledWith("OAuth Client Secret is required.");
			expect(exitSpy).toHaveBeenCalledWith(1);
			exitSpy.mockRestore();
		});

		it("トークン検証に失敗した場合 process.exit(1) を呼ぶ", async () => {
			setupOAuthMocks();
			const mockClient = mock().mockRejectedValue(new Error("Unauthorized"));
			(createClient as any).mockReturnValue(mockClient as never);
			const exitSpy = spyOnProcessExit();

			const mod = await import("#commands/auth/login.ts");
			await mod.default.run?.({
				args: {
					space: "example.backlog.com",
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
			(resolveSpace as any).mockResolvedValue({
				host: "example.backlog.com",
				auth: {
					method: "oauth" as const,
					accessToken: "old-access",
					refreshToken: "old-refresh",
					clientId: "old-client-id",
					clientSecret: "old-client-secret",
				},
			});
			(loadConfig as any).mockResolvedValue({
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
					space: "example.backlog.com",
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
			(consola.prompt as any).mockResolvedValueOnce("" as never);
			const exitSpy = spyOnProcessExit();

			const mod = await import("#commands/auth/login.ts");
			await mod.default.run?.({
				args: {
					space: "example.backlog.com",
					method: "oauth",
				},
			} as never);

			expect(consola.error).toHaveBeenCalledWith("OAuth Client ID is required.");
			expect(exitSpy).toHaveBeenCalledWith(1);
			exitSpy.mockRestore();
		});
	});
});
