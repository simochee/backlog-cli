import { createClient } from "#client.ts";
import { describe, expect, it, vi } from "vitest";

// Mock ofetch to inspect how client is configured
vi.mock("ofetch", () => {
	const mockFetch = vi.fn();
	return {
		ofetch: {
			create: vi.fn((config: Record<string, unknown>) => {
				// Store config on the mock for inspection
				const fn = Object.assign(mockFetch, { _config: config });
				return fn;
			}),
		},
	};
});

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
});
