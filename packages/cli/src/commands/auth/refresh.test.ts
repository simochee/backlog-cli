import { spyOnProcessExit } from "@repo/test-utils";
import { describe, expect, it, vi } from "vitest";

vi.mock("@repo/config", () => ({
	resolveSpace: vi.fn(),
}));

vi.mock("consola", () => import("@repo/test-utils/mock-consola"));

import { resolveSpace } from "@repo/config";

describe("auth refresh", () => {
	it("スペースが未設定の場合 process.exit(1) を呼ぶ", async () => {
		vi.mocked(resolveSpace).mockResolvedValue(null as never);
		const exitSpy = spyOnProcessExit();

		const mod = await import("#commands/auth/refresh.ts");
		await mod.default.run?.({ args: {} } as never);

		expect(exitSpy).toHaveBeenCalledWith(1);
		exitSpy.mockRestore();
	});

	it("API Key 認証の場合エラーを出す", async () => {
		vi.mocked(resolveSpace).mockResolvedValue({
			host: "example.backlog.com",
			auth: { method: "api-key" as const, apiKey: "key" },
		});
		const exitSpy = spyOnProcessExit();

		const mod = await import("#commands/auth/refresh.ts");
		await mod.default.run?.({ args: {} } as never);

		expect(exitSpy).toHaveBeenCalledWith(1);
		exitSpy.mockRestore();
	});

	it("OAuth 認証でも現在は未実装エラーを返す", async () => {
		vi.mocked(resolveSpace).mockResolvedValue({
			host: "example.backlog.com",
			auth: {
				method: "oauth" as const,
				accessToken: "access",
				refreshToken: "refresh",
			},
		});
		const exitSpy = spyOnProcessExit();

		const mod = await import("#commands/auth/refresh.ts");
		await mod.default.run?.({ args: {} } as never);

		expect(exitSpy).toHaveBeenCalledWith(1);
		exitSpy.mockRestore();
	});
});
