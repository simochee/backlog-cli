import { spyOnProcessExit } from "@repo/test-utils";
import mockConsola from "@repo/test-utils/mock-consola";
import { describe, expect, it, mock, spyOn } from "bun:test";

mock.module("@repo/config", () => ({
	loadConfig: mock(),
	writeConfig: mock(),
	addSpace: mock(),
	findSpace: mock(),
	removeSpace: mock(),
	resolveSpace: mock(),
	updateSpaceAuth: mock(),
}));

mock.module("consola", () => ({ default: mockConsola }));

const { resolveSpace } = await import("@repo/config");
const { default: consola } = await import("consola");

describe("auth token", () => {
	it("API キーを stdout に出力する", async () => {
		(resolveSpace as any).mockResolvedValue({
			host: "example.backlog.com",
			auth: { method: "api-key", apiKey: "my-api-key" },
		});
		const stdoutSpy = spyOn(process.stdout, "write").mockImplementation(() => true);

		try {
			const mod = await import("#commands/auth/token.ts");
			await mod.default.run?.({ args: { space: undefined } } as never);

			expect(resolveSpace).toHaveBeenCalledWith(undefined);
			expect(stdoutSpy).toHaveBeenCalledWith("my-api-key");
		} finally {
			stdoutSpy.mockRestore();
		}
	});

	it("OAuth トークンを stdout に出力する", async () => {
		(resolveSpace as any).mockResolvedValue({
			host: "example.backlog.com",
			auth: { method: "oauth", accessToken: "my-access-token", refreshToken: "my-refresh-token" },
		});
		const stdoutSpy = spyOn(process.stdout, "write").mockImplementation(() => true);

		try {
			const mod = await import("#commands/auth/token.ts");
			await mod.default.run?.({ args: { space: undefined } } as never);

			expect(resolveSpace).toHaveBeenCalledWith(undefined);
			expect(stdoutSpy).toHaveBeenCalledWith("my-access-token");
		} finally {
			stdoutSpy.mockRestore();
		}
	});

	it("スペース未設定で process.exit(1) が呼ばれる", async () => {
		(resolveSpace as any).mockResolvedValue(null as never);
		const exitSpy = spyOnProcessExit();

		try {
			const mod = await import("#commands/auth/token.ts");
			await mod.default.run?.({ args: { space: undefined } } as never);

			expect(resolveSpace).toHaveBeenCalledWith(undefined);
			expect(consola.error).toHaveBeenCalledWith("No space configured. Run `bl auth login` to authenticate.");
			expect(exitSpy).toHaveBeenCalledWith(1);
		} finally {
			exitSpy.mockRestore();
		}
	});
});
