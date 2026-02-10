import { spyOnProcessExit } from "@repo/test-utils";
import { describe, expect, it, vi } from "vitest";

vi.mock("@repo/config", () => ({
	resolveSpace: vi.fn(),
}));

vi.mock("consola", () => import("@repo/test-utils/mock-consola"));

import { resolveSpace } from "@repo/config";
import consola from "consola";

describe("auth token", () => {
	it("API キーを stdout に出力する", async () => {
		vi.mocked(resolveSpace).mockResolvedValue({
			host: "example.backlog.com",
			auth: { method: "api-key", apiKey: "my-api-key" },
		});
		const stdoutSpy = vi.spyOn(process.stdout, "write").mockImplementation(() => true);

		try {
			const mod = await import("#commands/auth/token.ts");
			await mod.default.run?.({ args: { hostname: undefined } } as never);

			expect(resolveSpace).toHaveBeenCalledWith(undefined);
			expect(stdoutSpy).toHaveBeenCalledWith("my-api-key");
		} finally {
			stdoutSpy.mockRestore();
		}
	});

	it("OAuth トークンを stdout に出力する", async () => {
		vi.mocked(resolveSpace).mockResolvedValue({
			host: "example.backlog.com",
			auth: { method: "oauth", accessToken: "my-access-token", refreshToken: "my-refresh-token" },
		});
		const stdoutSpy = vi.spyOn(process.stdout, "write").mockImplementation(() => true);

		try {
			const mod = await import("#commands/auth/token.ts");
			await mod.default.run?.({ args: { hostname: undefined } } as never);

			expect(resolveSpace).toHaveBeenCalledWith(undefined);
			expect(stdoutSpy).toHaveBeenCalledWith("my-access-token");
		} finally {
			stdoutSpy.mockRestore();
		}
	});

	it("スペース未設定で process.exit(1) が呼ばれる", async () => {
		vi.mocked(resolveSpace).mockResolvedValue(null as never);
		const exitSpy = spyOnProcessExit();

		try {
			const mod = await import("#commands/auth/token.ts");
			await mod.default.run?.({ args: { hostname: undefined } } as never);

			expect(resolveSpace).toHaveBeenCalledWith(undefined);
			expect(consola.error).toHaveBeenCalledWith("No space configured. Run `bl auth login` to authenticate.");
			expect(exitSpy).toHaveBeenCalledWith(1);
		} finally {
			exitSpy.mockRestore();
		}
	});
});
