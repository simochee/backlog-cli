import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@repo/api", () => ({
	createClient: vi.fn(),
}));

vi.mock("@repo/config", () => ({
	addSpace: vi.fn(),
	loadConfig: vi.fn(),
	resolveSpace: vi.fn(),
	updateSpaceAuth: vi.fn(),
	writeConfig: vi.fn(),
}));

vi.mock("consola", () => ({
	default: {
		error: vi.fn(),
		start: vi.fn(),
		success: vi.fn(),
		prompt: vi.fn(),
	},
}));

import { createClient } from "@repo/api";
import { addSpace, loadConfig, resolveSpace, updateSpaceAuth, writeConfig } from "@repo/config";
import consola from "consola";

describe("auth login", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

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
		const exitSpy = vi.spyOn(process, "exit").mockImplementation(() => undefined as never);

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

	it("api-key 以外の method でエラーを返す", async () => {
		const exitSpy = vi.spyOn(process, "exit").mockImplementation(() => undefined as never);

		const mod = await import("#commands/auth/login.ts");
		await mod.default.run?.({
			args: { hostname: "example.backlog.com", method: "oauth" },
		} as never);

		expect(consola.error).toHaveBeenCalledWith("Only api-key authentication is currently supported.");
		expect(exitSpy).toHaveBeenCalledWith(1);
		expect(createClient).not.toHaveBeenCalled();
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
		const exitSpy = vi.spyOn(process, "exit").mockImplementation(() => undefined as never);

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
		const exitSpy = vi.spyOn(process, "exit").mockImplementation(() => undefined as never);

		const mod = await import("#commands/auth/login.ts");
		await mod.default.run?.({
			args: { hostname: "example.backlog.com", method: "api-key" },
		} as never);

		expect(consola.error).toHaveBeenCalledWith("API key is required.");
		expect(exitSpy).toHaveBeenCalledWith(1);
		exitSpy.mockRestore();
	});
});
