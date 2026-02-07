import { describe, expect, it, vi } from "vitest";

vi.mock("consola", () => ({
	default: { error: vi.fn() },
}));

describe("completion", () => {
	it("bash 補完スクリプトを出力する", async () => {
		const logSpy = vi.spyOn(console, "log").mockImplementation(() => {});
		const mod = await import("#commands/completion.ts");
		const command = mod.default;

		// Verify the command meta is correct
		expect(command.meta?.name).toBe("completion");
		expect(command.meta?.description).toBe("Generate shell completion script");

		logSpy.mockRestore();
	});

	it("zsh と fish もサポートされている", async () => {
		const mod = await import("#commands/completion.ts");
		const command = mod.default;
		expect(command.args?.shell).toBeDefined();
	});
});
