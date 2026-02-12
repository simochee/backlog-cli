import { describe, expect, it, mock } from "bun:test";

// Mock ofetch to inspect how client is configured
mock.module("ofetch", () => {
	const mockFetch = mock();
	return {
		ofetch: {
			create: mock((config: Record<string, unknown>) => {
				// Store config on the mock for inspection
				const fn = Object.assign(mockFetch, { _config: config });
				return fn;
			}),
		},
	};
});
const { createClient, formatResetTime } = await import("#client.ts");

describe("createClient", () => {
	it("creates a client with API key authentication", () => {
		const client = createClient({
			host: "example.backlog.com",
			apiKey: "test-api-key",
		});

		expect(typeof client).toBe("function");
	});

	it("creates a client with OAuth authentication", () => {
		const client = createClient({
			host: "example.backlog.com",
			accessToken: "test-access-token",
		});

		expect(typeof client).toBe("function");
	});

	it("creates a client without any auth", () => {
		const client = createClient({
			host: "example.backlog.com",
		});

		expect(typeof client).toBe("function");
	});

	it("sets correct base URL for .backlog.com host", () => {
		const client = createClient({
			host: "my-space.backlog.com",
			apiKey: "key",
		}) as unknown as { _config: Record<string, unknown> };

		expect(client._config["baseURL"]).toBe("https://my-space.backlog.com/api/v2");
	});

	it("sets correct base URL for .backlog.jp host", () => {
		const client = createClient({
			host: "my-space.backlog.jp",
			apiKey: "key",
		}) as unknown as { _config: Record<string, unknown> };

		expect(client._config["baseURL"]).toBe("https://my-space.backlog.jp/api/v2");
	});

	it("passes API key as query parameter", () => {
		const client = createClient({
			host: "example.backlog.com",
			apiKey: "my-secret-key",
		}) as unknown as { _config: Record<string, unknown> };

		expect(client._config["query"]).toEqual({ apiKey: "my-secret-key" });
	});

	it("does not set Authorization header for API key auth", () => {
		const client = createClient({
			host: "example.backlog.com",
			apiKey: "my-secret-key",
		}) as unknown as { _config: Record<string, unknown> };

		expect(client._config["headers"]).toEqual({});
	});

	it("passes OAuth token as Bearer Authorization header", () => {
		const client = createClient({
			host: "example.backlog.com",
			accessToken: "my-oauth-token",
		}) as unknown as { _config: Record<string, unknown> };

		expect(client._config["headers"]).toEqual({
			Authorization: "Bearer my-oauth-token",
		});
	});

	it("does not set API key query for OAuth auth", () => {
		const client = createClient({
			host: "example.backlog.com",
			accessToken: "my-oauth-token",
		}) as unknown as { _config: Record<string, unknown> };

		expect(client._config["query"]).toEqual({});
	});

	it("has empty headers and query when no auth provided", () => {
		const client = createClient({
			host: "example.backlog.com",
		}) as unknown as { _config: Record<string, unknown> };

		expect(client._config["headers"]).toEqual({});
		expect(client._config["query"]).toEqual({});
	});

	it("registers onResponseError interceptor", () => {
		const client = createClient({
			host: "example.backlog.com",
			apiKey: "key",
		}) as unknown as { _config: Record<string, unknown> };

		expect(typeof client._config["onResponseError"]).toBe("function");
	});

	describe("onResponseError", () => {
		function getInterceptor() {
			const client = createClient({
				host: "example.backlog.com",
				apiKey: "key",
			}) as unknown as {
				_config: { onResponseError: (ctx: { response: { status: number; headers: Headers } }) => void };
			};
			return client._config.onResponseError;
		}

		it("429 レスポンスで X-RateLimit-Reset ヘッダーがある場合、リセット日時を含むエラーを投げる", () => {
			const onResponseError = getInterceptor();
			const resetEpoch = Math.floor(Date.now() / 1000) + 3600;
			const headers = new Headers({ "X-RateLimit-Reset": String(resetEpoch) });

			expect(() => onResponseError({ response: { status: 429, headers } })).toThrowError(
				`API rate limit exceeded. Rate limit resets at ${formatResetTime(resetEpoch)}.`,
			);
		});

		it("429 レスポンスで X-RateLimit-Reset ヘッダーがない場合、汎用メッセージのエラーを投げる", () => {
			const onResponseError = getInterceptor();
			const headers = new Headers();

			expect(() => onResponseError({ response: { status: 429, headers } })).toThrowError(
				"API rate limit exceeded. Please wait and try again later.",
			);
		});

		it("429 以外のステータスではエラーを投げない", () => {
			const onResponseError = getInterceptor();
			const headers = new Headers();

			expect(() => onResponseError({ response: { status: 500, headers } })).not.toThrow();
			expect(() => onResponseError({ response: { status: 403, headers } })).not.toThrow();
			expect(() => onResponseError({ response: { status: 404, headers } })).not.toThrow();
		});
	});
});

describe("formatResetTime", () => {
	it("エポック秒をローカライズされた日時文字列に変換する", () => {
		const epochSeconds = 1_700_000_000;
		const result = formatResetTime(epochSeconds);
		const expected = new Date(1_700_000_000 * 1000).toLocaleString();

		expect(result).toBe(expected);
	});
});
