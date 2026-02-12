import { describe, expect, it, mock } from "bun:test";

mock.module("ofetch", () => ({
	ofetch: mock(),
}));

const { exchangeAuthorizationCode, refreshAccessToken } = await import("#oauth.ts");
const { ofetch } = await import("ofetch");

describe("exchangeAuthorizationCode", () => {
	it("正しいパラメータで POST リクエストを送信する", async () => {
		const mockResponse = {
			access_token: "new-access-token",
			token_type: "Bearer",
			expires_in: 3600,
			refresh_token: "new-refresh-token",
		};
		(ofetch as any).mockResolvedValue(mockResponse);

		const result = await exchangeAuthorizationCode({
			host: "example.backlog.com",
			code: "auth-code-123",
			clientId: "client-id",
			clientSecret: "client-secret",
			redirectUri: "http://localhost:12345/callback",
		});

		expect(ofetch).toHaveBeenCalledWith("https://example.backlog.com/api/v2/oauth2/token", {
			method: "POST",
			headers: { "Content-Type": "application/x-www-form-urlencoded" },
			body: new URLSearchParams({
				grant_type: "authorization_code",
				code: "auth-code-123",
				client_id: "client-id",
				client_secret: "client-secret",
				redirect_uri: "http://localhost:12345/callback",
			}).toString(),
		});
		expect(result).toEqual(mockResponse);
	});

	it("ofetch がエラーを投げた場合そのまま伝播する", async () => {
		(ofetch as any).mockRejectedValue(new Error("invalid_grant"));

		await expect(
			exchangeAuthorizationCode({
				host: "example.backlog.com",
				code: "bad-code",
				clientId: "client-id",
				clientSecret: "client-secret",
				redirectUri: "http://localhost:12345/callback",
			}),
		).rejects.toThrow("invalid_grant");
	});
});

describe("refreshAccessToken", () => {
	it("正しいパラメータで POST リクエストを送信する", async () => {
		const mockResponse = {
			access_token: "refreshed-access-token",
			token_type: "Bearer",
			expires_in: 3600,
			refresh_token: "refreshed-refresh-token",
		};
		(ofetch as any).mockResolvedValue(mockResponse);

		const result = await refreshAccessToken({
			host: "example.backlog.com",
			refreshToken: "old-refresh-token",
			clientId: "client-id",
			clientSecret: "client-secret",
		});

		expect(ofetch).toHaveBeenCalledWith("https://example.backlog.com/api/v2/oauth2/token", {
			method: "POST",
			headers: { "Content-Type": "application/x-www-form-urlencoded" },
			body: new URLSearchParams({
				grant_type: "refresh_token",
				client_id: "client-id",
				client_secret: "client-secret",
				refresh_token: "old-refresh-token",
			}).toString(),
		});
		expect(result).toEqual(mockResponse);
	});

	it("ofetch がエラーを投げた場合そのまま伝播する", async () => {
		(ofetch as any).mockRejectedValue(new Error("invalid_grant"));

		await expect(
			refreshAccessToken({
				host: "example.backlog.com",
				refreshToken: "expired-token",
				clientId: "client-id",
				clientSecret: "client-secret",
			}),
		).rejects.toThrow("invalid_grant");
	});
});
