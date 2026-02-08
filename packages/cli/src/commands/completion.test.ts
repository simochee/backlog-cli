import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("consola", () => ({
	default: { error: vi.fn() },
}));

import consola from "consola";

describe("completion", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("メタデータが正しく設定されている", async () => {
		const mod = await import("#commands/completion.ts");
		const command = mod.default;

		expect(command.meta?.name).toBe("completion");
		expect(command.meta?.description).toBe("Generate shell completion script");
		expect(command.args?.shell).toBeDefined();
	});

	it("run() で bash 補完スクリプトを stdout に出力する", async () => {
		const writeSpy = vi.spyOn(process.stdout, "write").mockImplementation(() => true);

		const mod = await import("#commands/completion.ts");
		await mod.default.run?.({ args: { shell: "bash" } } as never);

		expect(writeSpy).toHaveBeenCalledOnce();
		const output = writeSpy.mock.calls[0][0] as string;
		expect(output).toContain("_backlog");
		expect(output).toContain("# backlog CLI bash completion");

		writeSpy.mockRestore();
	});

	it("run() で zsh 補完スクリプトを stdout に出力する", async () => {
		const writeSpy = vi.spyOn(process.stdout, "write").mockImplementation(() => true);

		const mod = await import("#commands/completion.ts");
		await mod.default.run?.({ args: { shell: "zsh" } } as never);

		expect(writeSpy).toHaveBeenCalledOnce();
		const output = writeSpy.mock.calls[0][0] as string;
		expect(output).toContain("#compdef backlog");

		writeSpy.mockRestore();
	});

	it("run() でサポートされていないシェルの場合 process.exit(1) が呼ばれる", async () => {
		const exitSpy = vi.spyOn(process, "exit").mockImplementation(() => undefined as never);

		const mod = await import("#commands/completion.ts");
		await mod.default.run?.({ args: { shell: "powershell" } } as never);

		expect(consola.error).toHaveBeenCalledWith('Unsupported shell: "powershell". Supported: bash, zsh, fish');
		expect(exitSpy).toHaveBeenCalledWith(1);

		exitSpy.mockRestore();
	});
});
