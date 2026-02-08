import { DEFAULT_PRIORITY_ID } from "@repo/api";
import { setupMockClient } from "@repo/test-utils";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("#utils/client.ts", () => ({ getClient: vi.fn() }));
vi.mock("consola", () => import("@repo/test-utils/mock-consola"));
vi.mock("#utils/prompt.ts", () => ({ default: vi.fn() }));
vi.mock("#utils/resolve.ts", () => ({
	resolveProjectId: vi.fn(() => 1),
	resolveIssueTypeId: vi.fn(() => 100),
	resolvePriorityId: vi.fn(() => 2),
	resolveUserId: vi.fn(() => 999),
}));
vi.mock("#utils/url.ts", () => ({
	issueUrl: vi.fn(() => "https://example.backlog.com/view/PROJ-1"),
	openUrl: vi.fn(),
}));

import { getClient } from "#utils/client.ts";
import promptRequired from "#utils/prompt.ts";
import { resolveIssueTypeId, resolvePriorityId, resolveProjectId, resolveUserId } from "#utils/resolve.ts";
import { issueUrl, openUrl } from "#utils/url.ts";
import consola from "consola";

const mockCreatedIssue = {
	issueKey: "PROJ-1",
	summary: "New Issue",
};

describe("issue create", () => {
	beforeEach(() => {
		vi.mocked(promptRequired).mockImplementation((_label: string, value?: string) => Promise.resolve(value as string));
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
