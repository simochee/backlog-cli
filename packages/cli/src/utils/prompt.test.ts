import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock<typeof import("consola")>("consola", () => ({
	default: {
		prompt: vi.fn(),
		error: vi.fn(),
	},
}));

import consola from "consola";
import { promptRequired } from "#utils/prompt.ts";

describe("promptRequired", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("既存の値がある場合はそのまま返す", async () => {
		const result = await promptRequired("Label:", "existing-value");
		expect(result).toBe("existing-value");
		expect(consola.prompt).not.toHaveBeenCalled();
	});

	it("既存の値がない場合はプロンプトを表示する", async () => {
		vi.mocked(consola.prompt).mockResolvedValue("user-input" as never);

		const result = await promptRequired("Label:");
		expect(consola.prompt).toHaveBeenCalledWith("Label:", { type: "text" });
		expect(result).toBe("user-input");
	});

	it("既存の値が undefined の場合はプロンプトを表示する", async () => {
		vi.mocked(consola.prompt).mockResolvedValue("prompted" as never);

		const result = await promptRequired("Label:", undefined);
		expect(consola.prompt).toHaveBeenCalled();
		expect(result).toBe("prompted");
	});

	it("プロンプトで空文字が入力された場合は process.exit(1) を呼ぶ", async () => {
		vi.mocked(consola.prompt).mockResolvedValue("" as never);
		const mockExit = vi
			.spyOn(process, "exit")
			.mockImplementation(() => undefined as never);

		await promptRequired("Label:");

		expect(consola.error).toHaveBeenCalledWith("Label is required.");
		expect(mockExit).toHaveBeenCalledWith(1);
		mockExit.mockRestore();
	});

	it("ラベル末尾のコロンを除去してエラーメッセージを生成する", async () => {
		vi.mocked(consola.prompt).mockResolvedValue("" as never);
		const mockExit = vi
			.spyOn(process, "exit")
			.mockImplementation(() => undefined as never);

		await promptRequired("Project key:");

		expect(consola.error).toHaveBeenCalledWith("Project key is required.");
		mockExit.mockRestore();
	});
});
