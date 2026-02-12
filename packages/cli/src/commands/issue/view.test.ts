import { setupMockClient } from "@repo/test-utils";
import mockConsola from "@repo/test-utils/mock-consola";
import { afterEach, beforeEach, describe, expect, it, mock, spyOn } from "bun:test";

mock.module("#utils/client.ts", () => ({ getClient: mock() }));
mock.module("consola", () => ({ default: mockConsola }));
mock.module("#utils/format.ts", () => ({
	formatDate: mock(() => "2024-01-01"),
}));
mock.module("#utils/url.ts", () => ({
	issueUrl: mock(() => "https://example.backlog.com/view/PROJ-1"),
	openUrl: mock(),
}));

const { getClient } = await import("#utils/client.ts");
const { issueUrl, openUrl } = await import("#utils/url.ts");
const { default: consola } = await import("consola");

const mockIssue = {
	issueKey: "PROJ-1",
	summary: "Test issue",
	status: { name: "Open" },
	issueType: { name: "Bug" },
	priority: { name: "High" },
	assignee: { name: "User" },
	createdUser: { name: "Creator" },
	created: "2024-01-01T00:00:00Z",
	updated: "2024-01-02T00:00:00Z",
	startDate: null,
	dueDate: null,
	estimatedHours: null,
	actualHours: null,
	category: [],
	milestone: [],
	versions: [],
	description: "Test description",
};

describe("issue view", () => {
	it("課題の詳細を表示する", async () => {
		const mockClient = setupMockClient(getClient);
		mockClient.mockResolvedValue(mockIssue);

		const mod = await import("#commands/issue/view.ts");
		await mod.default.run?.({ args: { issueKey: "PROJ-1" } } as never);

		expect(mockClient).toHaveBeenCalledWith("/issues/PROJ-1");
		expect(consola.log).toHaveBeenCalledWith(expect.stringContaining("PROJ-1"));
		expect(consola.log).toHaveBeenCalledWith(expect.stringContaining("Test issue"));
		expect(consola.log).toHaveBeenCalledWith(expect.stringContaining("Open"));
		expect(consola.log).toHaveBeenCalledWith(expect.stringContaining("Bug"));
		expect(consola.log).toHaveBeenCalledWith(expect.stringContaining("High"));
	});

	it("--web でブラウザを開く", async () => {
		const mockClient = setupMockClient(getClient);
		mockClient.mockResolvedValue(mockIssue);

		const mod = await import("#commands/issue/view.ts");
		await mod.default.run?.({ args: { issueKey: "PROJ-1", web: true } } as never);

		expect(issueUrl).toHaveBeenCalledWith("example.backlog.com", "PROJ-1");
		expect(openUrl).toHaveBeenCalledWith("https://example.backlog.com/view/PROJ-1");
		expect(consola.info).toHaveBeenCalledWith("Opening https://example.backlog.com/view/PROJ-1");
	});

	it("--comments でコメントを含める", async () => {
		const mockClient = setupMockClient(getClient);
		mockClient.mockResolvedValueOnce(mockIssue).mockResolvedValueOnce([
			{ content: "Comment 1", createdUser: { name: "User1" }, created: "2024-01-03T00:00:00Z" },
			{ content: "Comment 2", createdUser: { name: "User2" }, created: "2024-01-04T00:00:00Z" },
		]);

		const mod = await import("#commands/issue/view.ts");
		await mod.default.run?.({ args: { issueKey: "PROJ-1", comments: true } } as never);

		expect(mockClient).toHaveBeenCalledTimes(2);
		expect(mockClient).toHaveBeenCalledWith("/issues/PROJ-1");
		expect(mockClient).toHaveBeenCalledWith("/issues/PROJ-1/comments");
		expect(consola.log).toHaveBeenCalledWith(expect.stringContaining("Comments:"));
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
			mockClient.mockResolvedValue(mockIssue);

			const mod = await import("#commands/issue/view.ts");
			await mod.default.run?.({ args: { issueKey: "PROJ-1", json: "" } } as never);

			expect(consola.log).not.toHaveBeenCalled();
			const output = JSON.parse(String(writeSpy.mock.calls[0]?.[0]).trim());
			expect(output.issueKey).toBe("PROJ-1");
		});
	});
});
