import { type CallbackServer, startCallbackServer } from "#utils/oauth-callback.ts";
import { afterEach, describe, expect, it } from "vitest";

const BASE_URL = "http://localhost:5033";

describe("startCallbackServer", () => {
	let server: CallbackServer;

	afterEach(() => {
		server?.stop();
	});

	it("port, waitForCallback, stop を持つオブジェクトを返す", () => {
		server = startCallbackServer();
		expect(server).toHaveProperty("port");
		expect(server).toHaveProperty("waitForCallback");
		expect(server).toHaveProperty("stop");
		expect(typeof server.port).toBe("number");
		expect(typeof server.waitForCallback).toBe("function");
		expect(typeof server.stop).toBe("function");
	});

	it("ポート番号が 5033 である", () => {
		server = startCallbackServer();
		expect(server.port).toBe(5033);
	});

	it("正しい state で OAuth コールバックを受け取ると認可コードを返す", async () => {
		server = startCallbackServer();
		const promise = server.waitForCallback("test-state");

		const res = await fetch(`${BASE_URL}/callback?code=auth-code-123&state=test-state`);
		expect(res.status).toBe(200);
		const html = await res.text();
		expect(html).toContain("Authentication Successful");

		const code = await promise;
		expect(code).toBe("auth-code-123");
	});

	it("state が一致しない場合は CSRF エラーで reject する", async () => {
		server = startCallbackServer();
		const promise = server.waitForCallback("expected-state");
		// Prevent unhandled rejection warning
		promise.catch(() => {});

		await fetch(`${BASE_URL}/callback?code=auth-code-123&state=wrong-state`);

		await expect(promise).rejects.toThrow("OAuth state mismatch — possible CSRF attack");
	});

	it("error クエリパラメータがある場合は OAuth エラーで reject する", async () => {
		server = startCallbackServer();
		const promise = server.waitForCallback("test-state");
		// Prevent unhandled rejection warning
		promise.catch(() => {});

		const res = await fetch(`${BASE_URL}/callback?error=access_denied`);
		expect(res.status).toBe(200);
		const html = await res.text();
		expect(html).toContain("Authentication Failed");

		await expect(promise).rejects.toThrow("OAuth error: access_denied");
	});

	it("code または state が欠落している場合は reject する", async () => {
		server = startCallbackServer();
		const promise = server.waitForCallback("test-state");
		// Prevent unhandled rejection warning
		promise.catch(() => {});

		const res = await fetch(`${BASE_URL}/callback?code=auth-code-123`);
		expect(res.status).toBe(200);
		const html = await res.text();
		expect(html).toContain("Authentication Failed");

		await expect(promise).rejects.toThrow("Missing code or state parameter");
	});

	it("/callback 以外のパスは 404 を返す", async () => {
		server = startCallbackServer();

		const res = await fetch(`${BASE_URL}/other-path`);
		expect(res.status).toBe(404);
	});

	it("stop を呼ぶとサーバーが停止する", async () => {
		server = startCallbackServer();
		server.stop();

		await expect(fetch(`${BASE_URL}/callback?code=abc&state=xyz`)).rejects.toThrow();
	});
});
