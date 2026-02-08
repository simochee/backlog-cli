vi.mock("#utils/client.ts", () => ({ getClient: vi.fn() }));
vi.mock("#utils/url.ts", () => ({
	openUrl: vi.fn(),
	projectUrl: vi.fn(() => "https://example.backlog.com/projects/PROJ"),
}));
vi.mock("consola", () => ({
	default: { log: vi.fn(), info: vi.fn() },
}));

import { getClient } from "#utils/client.ts";
import { openUrl, projectUrl } from "#utils/url.ts";
import consola from "consola";
import { beforeEach, describe, expect, it, vi } from "vitest";

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

	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("プロジェクト詳細を表示する", async () => {
		const mockClient = vi.fn();
		vi.mocked(getClient).mockResolvedValue({ client: mockClient as never, host: "example.backlog.com" });
		mockClient.mockResolvedValue(mockProject);

		const mod = await import("#commands/project/view.ts");
		await mod.default.run?.({ args: { projectKey: "PROJ", web: false } } as never);

		expect(mockClient).toHaveBeenCalledWith("/projects/PROJ");
		expect(consola.log).toHaveBeenCalledWith(expect.stringContaining("Test Project"));
		expect(consola.log).toHaveBeenCalledWith(expect.stringContaining("PROJ"));
	});

	it("--web でブラウザを開く", async () => {
		const mockClient = vi.fn();
		vi.mocked(getClient).mockResolvedValue({ client: mockClient as never, host: "example.backlog.com" });
		mockClient.mockResolvedValue(mockProject);

		const mod = await import("#commands/project/view.ts");
		await mod.default.run?.({ args: { projectKey: "PROJ", web: true } } as never);

		expect(projectUrl).toHaveBeenCalledWith("example.backlog.com", "PROJ");
		expect(openUrl).toHaveBeenCalledWith("https://example.backlog.com/projects/PROJ");
		expect(consola.info).toHaveBeenCalledWith(expect.stringContaining("Opening"));
	});
});
