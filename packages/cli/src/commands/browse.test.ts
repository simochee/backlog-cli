import { setupMockClient } from "@repo/test-utils";
import mockConsola from "@repo/test-utils/mock-consola";
import { describe, expect, it, mock } from "bun:test";

mock.module("#utils/client.ts", () => ({ getClient: mock() }));
mock.module("#utils/url.ts", () => ({
	openUrl: mock(),
	issueUrl: mock((_host: string, key: string) => `https://example.backlog.com/view/${key}`),
	projectUrl: mock((_host: string, key: string) => `https://example.backlog.com/projects/${key}`),
	dashboardUrl: mock(() => "https://example.backlog.com/dashboard"),
	buildBacklogUrl: mock((_host: string, path: string) => `https://example.backlog.com${path}`),
}));
mock.module("consola", () => ({ default: mockConsola }));

const { getClient } = await import("#utils/client.ts");
const { openUrl } = await import("#utils/url.ts");
const { default: consola } = await import("consola");

describe("browse", () => {
	it("課題キーを指定すると課題ページを開く", async () => {
		setupMockClient(getClient);

		const mod = await import("#commands/browse.ts");
		await mod.default.run?.({ args: { target: "PROJ-123" } } as never);

		expect(openUrl).toHaveBeenCalledWith("https://example.backlog.com/view/PROJ-123");
		expect(consola.info).toHaveBeenCalledWith(expect.stringContaining("Opening"));
	});

	it("プロジェクトキーのみでプロジェクトページを開く", async () => {
		setupMockClient(getClient);

		const mod = await import("#commands/browse.ts");
		await mod.default.run?.({ args: { project: "PROJ" } } as never);

		expect(openUrl).toHaveBeenCalledWith("https://example.backlog.com/projects/PROJ");
	});

	it("プロジェクトキーなしでダッシュボードを開く", async () => {
		setupMockClient(getClient);

		const mod = await import("#commands/browse.ts");
		await mod.default.run?.({ args: {} } as never);

		expect(openUrl).toHaveBeenCalledWith("https://example.backlog.com/dashboard");
	});

	it("--issues でプロジェクトの課題一覧を開く", async () => {
		setupMockClient(getClient);

		const mod = await import("#commands/browse.ts");
		await mod.default.run?.({ args: { project: "PROJ", issues: true } } as never);

		expect(openUrl).toHaveBeenCalledWith("https://example.backlog.com/find/PROJ");
	});

	it("--wiki でプロジェクトの Wiki を開く", async () => {
		setupMockClient(getClient);

		const mod = await import("#commands/browse.ts");
		await mod.default.run?.({ args: { project: "PROJ", wiki: true } } as never);

		expect(openUrl).toHaveBeenCalledWith("https://example.backlog.com/wiki/PROJ");
	});

	it("パスを指定するとカスタム URL を開く", async () => {
		setupMockClient(getClient);

		const mod = await import("#commands/browse.ts");
		await mod.default.run?.({ args: { target: "custom/path" } } as never);

		expect(openUrl).toHaveBeenCalledWith("https://example.backlog.com/custom/path");
	});
});
