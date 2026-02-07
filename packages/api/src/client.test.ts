import { describe, expect, it } from "vitest";
import { createClient } from "#client.ts";

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
});
