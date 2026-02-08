import { spyOnProcessExit } from "@repo/test-utils";
import { describe, expect, it, vi } from "vitest";

vi.mock("@repo/config", () => ({
	loadConfig: vi.fn(),
	removeSpace: vi.fn(),
}));

vi.mock("consola", () => import("@repo/test-utils/mock-consola"));

import { loadConfig, removeSpace } from "@repo/config";
import consola from "consola";

describe("auth logout", () => {
	it("指定ホストをログアウトする", async () => {
		vi.mocked(loadConfig).mockResolvedValue({
			spaces: [
				{
					host: "example.backlog.com",
					auth: { method: "api-key" as const, apiKey: "key" },
				},
			],
			defaultSpace: undefined,
			aliases: {},
		});
		vi.mocked(removeSpace).mockResolvedValue(undefined as never);

		const mod = await import("#commands/auth/logout.ts");
		await mod.default.run?.({
			args: { hostname: "example.backlog.com" },
		} as never);

		expect(removeSpace).toHaveBeenCalledWith("example.backlog.com");
		expect(consola.success).toHaveBeenCalledWith("Logged out of example.backlog.com.");
	});

	it("スペースが0件の場合メッセージを表示する", async () => {
		vi.mocked(loadConfig).mockResolvedValue({
			spaces: [],
			defaultSpace: undefined,
			aliases: {},
		});

		const mod = await import("#commands/auth/logout.ts");
		await mod.default.run?.({
			args: {},
		} as never);

		expect(consola.info).toHaveBeenCalledWith("No spaces are currently authenticated.");
		expect(removeSpace).not.toHaveBeenCalled();
	});

	it("存在しないスペースでエラーを出す", async () => {
		vi.mocked(loadConfig).mockResolvedValue({
			spaces: [],
			defaultSpace: undefined,
			aliases: {},
		});
		vi.mocked(removeSpace).mockRejectedValue(new Error("not found"));

		const exitSpy = spyOnProcessExit();

		const mod = await import("#commands/auth/logout.ts");
		await mod.default.run?.({
			args: { hostname: "nonexistent.backlog.com" },
		} as never);

		expect(consola.error).toHaveBeenCalledWith('Space "nonexistent.backlog.com" is not configured.');
		expect(exitSpy).toHaveBeenCalledWith(1);
		exitSpy.mockRestore();
	});

	it("hostname 省略で1件の場合、自動選択してログアウトする", async () => {
		vi.mocked(loadConfig).mockResolvedValue({
			spaces: [
				{
					host: "only.backlog.com",
					auth: { method: "api-key" as const, apiKey: "key" },
				},
			],
			defaultSpace: undefined,
			aliases: {},
		});
		vi.mocked(removeSpace).mockResolvedValue(undefined as never);

		const mod = await import("#commands/auth/logout.ts");
		await mod.default.run?.({
			args: {},
		} as never);

		expect(removeSpace).toHaveBeenCalledWith("only.backlog.com");
		expect(consola.success).toHaveBeenCalledWith("Logged out of only.backlog.com.");
	});
});
