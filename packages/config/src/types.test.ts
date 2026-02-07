import { type } from "arktype";
import { describe, expect, it } from "vitest";
import { Rc, RcAuth, RcSpace } from "#types.ts";

describe("RcAuth", () => {
	it("accepts valid api-key auth", () => {
		const result = RcAuth({ method: "api-key", apiKey: "abc123" });
		expect(result).toEqual({ method: "api-key", apiKey: "abc123" });
	});

	it("accepts valid oauth auth", () => {
		const result = RcAuth({
			method: "oauth",
			accessToken: "access",
			refreshToken: "refresh",
		});
		expect(result).toEqual({
			method: "oauth",
			accessToken: "access",
			refreshToken: "refresh",
		});
	});

	it("rejects invalid method", () => {
		const result = RcAuth({ method: "invalid" });
		expect(result).toBeInstanceOf(type.errors);
	});

	it("rejects api-key auth without apiKey", () => {
		const result = RcAuth({ method: "api-key" });
		expect(result).toBeInstanceOf(type.errors);
	});

	it("rejects oauth auth without tokens", () => {
		const result = RcAuth({ method: "oauth" });
		expect(result).toBeInstanceOf(type.errors);
	});
});

describe("RcSpace", () => {
	const validAuth = { method: "api-key" as const, apiKey: "key" };

	it("accepts valid backlog.com host", () => {
		const result = RcSpace({ host: "example.backlog.com", auth: validAuth });
		expect(result).not.toBeInstanceOf(type.errors);
	});

	it("accepts valid backlog.jp host", () => {
		const result = RcSpace({ host: "example.backlog.jp", auth: validAuth });
		expect(result).not.toBeInstanceOf(type.errors);
	});

	it("accepts host with hyphens and numbers", () => {
		const result = RcSpace({
			host: "my-team-01.backlog.com",
			auth: validAuth,
		});
		expect(result).not.toBeInstanceOf(type.errors);
	});

	it("rejects invalid host domain", () => {
		const result = RcSpace({
			host: "example.invalid.com",
			auth: validAuth,
		});
		expect(result).toBeInstanceOf(type.errors);
	});

	it("rejects host with uppercase letters", () => {
		const result = RcSpace({
			host: "Example.backlog.com",
			auth: validAuth,
		});
		expect(result).toBeInstanceOf(type.errors);
	});

	it("rejects empty host", () => {
		const result = RcSpace({ host: "", auth: validAuth });
		expect(result).toBeInstanceOf(type.errors);
	});
});

describe("Rc", () => {
	it("accepts empty config with defaults", () => {
		const result = Rc({});
		expect(result).not.toBeInstanceOf(type.errors);
		if (!(result instanceof type.errors)) {
			expect(result.spaces).toEqual([]);
			expect(result.defaultSpace).toBeUndefined();
		}
	});

	it("accepts config with defaultSpace", () => {
		const result = Rc({ defaultSpace: "example.backlog.com" });
		expect(result).not.toBeInstanceOf(type.errors);
		if (!(result instanceof type.errors)) {
			expect(result.defaultSpace).toBe("example.backlog.com");
		}
	});

	it("accepts config with spaces", () => {
		const result = Rc({
			spaces: [
				{
					host: "example.backlog.com",
					auth: { method: "api-key", apiKey: "key" },
				},
			],
		});
		expect(result).not.toBeInstanceOf(type.errors);
		if (!(result instanceof type.errors)) {
			expect(result.spaces).toHaveLength(1);
		}
	});

	it("rejects invalid space in spaces array", () => {
		const result = Rc({
			spaces: [{ host: "invalid", auth: { method: "api-key", apiKey: "key" } }],
		});
		expect(result).toBeInstanceOf(type.errors);
	});
});
