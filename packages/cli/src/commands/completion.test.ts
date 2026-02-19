import { spyOnProcessExit } from "@repo/test-utils";
import { describe, expect, it, vi } from "vitest";

vi.mock("consola", () => import("@repo/test-utils/mock-consola"));

import consola from "consola";

describe("completion", () => {
	it("メタデータが正しく設定されている", async () => {
		const mod = await import("#commands/completion.ts");
		const command = mod.default;

		expect((command.meta as Record<string, unknown>)?.["name"]).toBe("completion");
		expect((command.meta as Record<string, unknown>)?.["description"]).toBe("Generate shell completion script");
		expect((command.args as Record<string, unknown>)?.["shell"]).toBeDefined();
	});

	it("run() で bash 補完スクリプトを stdout に出力する", async () => {
		const writeSpy = vi.spyOn(process.stdout, "write").mockImplementation(() => true);

		const mod = await import("#commands/completion.ts");
		await mod.default.run?.({ args: { shell: "bash" } } as never);

		expect(writeSpy).toHaveBeenCalledOnce();
		const output = writeSpy.mock.calls[0]?.[0] as string;
		expect(output).toContain("_bl");
		expect(output).toContain("# bl CLI bash completion");

		writeSpy.mockRestore();
	});

	it("run() で zsh 補完スクリプトを stdout に出力する", async () => {
		const writeSpy = vi.spyOn(process.stdout, "write").mockImplementation(() => true);

		const mod = await import("#commands/completion.ts");
		await mod.default.run?.({ args: { shell: "zsh" } } as never);

		expect(writeSpy).toHaveBeenCalledOnce();
		const output = writeSpy.mock.calls[0]?.[0] as string;
		expect(output).toContain("#compdef bl backlog");

		writeSpy.mockRestore();
	});

	it("run() でサポートされていないシェルの場合 process.exit(1) が呼ばれる", async () => {
		const exitSpy = spyOnProcessExit();

		const mod = await import("#commands/completion.ts");
		await mod.default.run?.({ args: { shell: "powershell" } } as never);

		expect(consola.error).toHaveBeenCalledWith('Unsupported shell: "powershell". Supported: bash, zsh, fish');
		expect(exitSpy).toHaveBeenCalledWith(1);

		exitSpy.mockRestore();
	});
});
