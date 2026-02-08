import { setupMockClient } from "@repo/test-utils";
import { describe, expect, it, vi } from "vitest";

vi.mock("#utils/client.ts", () => ({ getClient: vi.fn() }));
vi.mock("#utils/url.ts", () => ({
	openUrl: vi.fn(),
	projectUrl: vi.fn(() => "https://example.backlog.com/projects/PROJ"),
}));
vi.mock("consola", () => import("@repo/test-utils/mock-consola"));

import { getClient } from "#utils/client.ts";
import { openUrl, projectUrl } from "#utils/url.ts";
import consola from "consola";

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
});
