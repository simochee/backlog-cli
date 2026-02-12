import { setupMockClient } from "@repo/test-utils";
import mockConsola from "@repo/test-utils/mock-consola";
import { beforeEach, describe, expect, it, mock } from "bun:test";

mock.module("#utils/client.ts", () => ({ getClient: mock() }));
mock.module("consola", () => ({ default: mockConsola }));
mock.module("#utils/prompt.ts", () => ({ default: mock() }));
mock.module("#utils/resolve.ts", () => ({
	resolveProjectId: mock(() => 1),
	resolveIssueTypeId: mock(() => 100),
	resolvePriorityId: mock(() => 2),
	resolveUserId: mock(() => 999),
}));
mock.module("#utils/url.ts", () => ({
	issueUrl: mock(() => "https://example.backlog.com/view/PROJ-1"),
	openUrl: mock(),
}));
const { DEFAULT_PRIORITY_ID } = await import("@repo/api");

const { getClient } = await import("#utils/client.ts");
const { default: promptRequired } = await import("#utils/prompt.ts");
const { resolveIssueTypeId, resolvePriorityId, resolveProjectId, resolveUserId } = await import("#utils/resolve.ts");
const { issueUrl, openUrl } = await import("#utils/url.ts");
const { default: consola } = await import("consola");

const mockCreatedIssue = {
	issueKey: "PROJ-1",
	summary: "New Issue",
};

describe("issue create", () => {
	beforeEach(() => {
		(promptRequired as any).mockImplementation((_label: string, value?: string) => Promise.resolve(value as string));
	});

	it("必須引数で課題を作成する", async () => {
		const mockClient = setupMockClient(getClient);
		mockClient.mockResolvedValue(mockCreatedIssue);

		const mod = await import("#commands/issue/create.ts");
		await mod.default.run?.({
			args: { project: "PROJ", title: "New Issue", type: "Bug", priority: "High" },
		} as never);

		expect(resolveProjectId).toHaveBeenCalledWith(mockClient, "PROJ");
		expect(resolveIssueTypeId).toHaveBeenCalledWith(mockClient, "PROJ", "Bug");
		expect(resolvePriorityId).toHaveBeenCalledWith(mockClient, "High");
		expect(mockClient).toHaveBeenCalledWith(
			"/issues",
			expect.objectContaining({
				method: "POST",
				body: expect.objectContaining({
					projectId: 1,
					summary: "New Issue",
					issueTypeId: 100,
					priorityId: 2,
				}),
			}),
		);
		expect(consola.success).toHaveBeenCalledWith("Created PROJ-1: New Issue");
	});

	it("--priority 省略時は DEFAULT_PRIORITY_ID を使う", async () => {
		const mockClient = setupMockClient(getClient);
		mockClient.mockResolvedValue(mockCreatedIssue);

		const mod = await import("#commands/issue/create.ts");
		await mod.default.run?.({
			args: { project: "PROJ", title: "New Issue", type: "Bug" },
		} as never);

		expect(resolvePriorityId).not.toHaveBeenCalled();
		expect(mockClient).toHaveBeenCalledWith(
			"/issues",
			expect.objectContaining({
				method: "POST",
				body: expect.objectContaining({
					projectId: 1,
					summary: "New Issue",
					issueTypeId: 100,
					priorityId: DEFAULT_PRIORITY_ID,
				}),
			}),
		);
	});

	it("オプション引数を含めて課題を作成する", async () => {
		const mockClient = setupMockClient(getClient);
		mockClient.mockResolvedValue(mockCreatedIssue);

		const mod = await import("#commands/issue/create.ts");
		await mod.default.run?.({
			args: {
				project: "PROJ",
				title: "New Issue",
				type: "Bug",
				priority: "High",
				description: "Detailed description",
				assignee: "testuser",
				"start-date": "2024-01-01",
				"due-date": "2024-01-31",
			},
		} as never);

		expect(resolveUserId).toHaveBeenCalledWith(mockClient, "testuser");
		expect(mockClient).toHaveBeenCalledWith(
			"/issues",
			expect.objectContaining({
				method: "POST",
				body: expect.objectContaining({
					projectId: 1,
					summary: "New Issue",
					issueTypeId: 100,
					priorityId: 2,
					description: "Detailed description",
					assigneeId: 999,
					startDate: "2024-01-01",
					dueDate: "2024-01-31",
				}),
			}),
		);
	});

	it("--web で作成後にブラウザを開く", async () => {
		const mockClient = setupMockClient(getClient);
		mockClient.mockResolvedValue(mockCreatedIssue);

		const mod = await import("#commands/issue/create.ts");
		await mod.default.run?.({
			args: { project: "PROJ", title: "New Issue", type: "Bug", priority: "High", web: true },
		} as never);

		expect(issueUrl).toHaveBeenCalledWith("example.backlog.com", "PROJ-1");
		expect(openUrl).toHaveBeenCalledWith("https://example.backlog.com/view/PROJ-1");
		expect(consola.info).toHaveBeenCalledWith("Opening https://example.backlog.com/view/PROJ-1");
	});
});
