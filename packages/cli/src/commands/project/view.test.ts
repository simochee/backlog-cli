import { setupMockClient } from "@repo/test-utils";
import mockConsola from "@repo/test-utils/mock-consola";
import { afterEach, beforeEach, describe, expect, it, mock, spyOn } from "bun:test";

mock.module("#utils/client.ts", () => ({ getClient: mock() }));
mock.module("#utils/url.ts", () => ({
	openUrl: mock(),
	projectUrl: mock(() => "https://example.backlog.com/projects/PROJ"),
}));
mock.module("consola", () => ({ default: mockConsola }));

const { getClient } = await import("#utils/client.ts");
const { openUrl, projectUrl } = await import("#utils/url.ts");
const { default: consola } = await import("consola");

describe("project view", () => {
	const mockProject = {
		id: 1,
		projectKey: "PROJ",
		name: "Test Project",
		archived: false,
		textFormattingRule: "markdown",
		chartEnabled: true,
		subtaskingEnabled: false,
		useWiki: true,
		useFileSharing: true,
		useDevAttributes: false,
	};

	it("プロジェクト詳細を表示する", async () => {
		const mockClient = setupMockClient(getClient);
		mockClient.mockResolvedValue(mockProject);

		const mod = await import("#commands/project/view.ts");
		await mod.default.run?.({ args: { projectKey: "PROJ", web: false } } as never);

		expect(mockClient).toHaveBeenCalledWith("/projects/PROJ");
		expect(consola.log).toHaveBeenCalledWith(expect.stringContaining("Test Project"));
		expect(consola.log).toHaveBeenCalledWith(expect.stringContaining("PROJ"));
	});

	it("--web でブラウザを開く", async () => {
		const mockClient = setupMockClient(getClient);
		mockClient.mockResolvedValue(mockProject);

		const mod = await import("#commands/project/view.ts");
		await mod.default.run?.({ args: { projectKey: "PROJ", web: true } } as never);

		expect(projectUrl).toHaveBeenCalledWith("example.backlog.com", "PROJ");
		expect(openUrl).toHaveBeenCalledWith("https://example.backlog.com/projects/PROJ");
		expect(consola.info).toHaveBeenCalledWith(expect.stringContaining("Opening"));
	});

	describe("--json", () => {
		let writeSpy: ReturnType<typeof spyOn>;

		beforeEach(() => {
			writeSpy = spyOn(process.stdout, "write").mockImplementation(() => true);
		});

		afterEach(() => {
			writeSpy.mockRestore();
		});

		it("--json で JSON を出力する", async () => {
			const mockClient = setupMockClient(getClient);
			mockClient.mockResolvedValue(mockProject);

			const mod = await import("#commands/project/view.ts");
			await mod.default.run?.({ args: { projectKey: "PROJ", web: false, json: "" } } as never);

			expect(consola.log).not.toHaveBeenCalled();
			const output = JSON.parse(String(writeSpy.mock.calls[0]?.[0]).trim());
			expect(output.projectKey).toBe("PROJ");
		});
	});
});
