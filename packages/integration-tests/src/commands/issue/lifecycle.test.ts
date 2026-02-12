import { afterAll, describe, expect, it } from "bun:test";

import { expectSuccess, requireDep } from "../../helpers/assertions.ts";
import { getEnv } from "../../helpers/env.ts";
import { ResourceTracker } from "../../helpers/resource.ts";
import { runCliJsonWithRetry, runCliWithRetry } from "../../helpers/retry.ts";

describe("issue lifecycle", () => {
	const { project } = getEnv();
	const tracker = new ResourceTracker();
	const testTitle = `integration-test-${Date.now()}`;
	let issueKey: string;
	let issueTypeName: string;

	afterAll(() => tracker.cleanupAll());

	it("課題種別一覧から種別名を取得する", async () => {
		const result = await runCliJsonWithRetry<{ id: number; name: string }[]>(["issue-type", "list", "-p", project]);
		expectSuccess(result);
		const firstIssueType = result.data[0];
		if (!firstIssueType) {
			throw new Error("Expected at least one issue type");
		}
		issueTypeName = firstIssueType.name;
	});

	it("課題を作成する", async () => {
		requireDep(issueTypeName, "issueTypeName");
		const result = await runCliJsonWithRetry<{ issueKey: string }>([
			"issue",
			"create",
			"-p",
			project,
			"--title",
			testTitle,
			"--type",
			issueTypeName,
		]);
		expectSuccess(result);
		expect(result.data.issueKey).toBeDefined();
		issueKey = result.data.issueKey;
		tracker.trackIssue(issueKey);
	});

	it("課題詳細を表示する", async () => {
		requireDep(issueKey, "issueKey");
		const result = await runCliJsonWithRetry<{ issueKey: string; summary: string }>(["issue", "view", issueKey]);
		expectSuccess(result);
		expect(result.data.issueKey).toBe(issueKey);
		expect(result.data.summary).toBe(testTitle);
	});

	it("課題を編集する", async () => {
		requireDep(issueKey, "issueKey");
		const result = await runCliWithRetry(["issue", "edit", issueKey, "--title", `${testTitle}-edited`]);
		expectSuccess(result);
	});

	it("課題にコメントする", async () => {
		requireDep(issueKey, "issueKey");
		const result = await runCliWithRetry(["issue", "comment", issueKey, "--body", "integration test comment"]);
		expectSuccess(result);
	});

	it("課題を完了にする", async () => {
		requireDep(issueKey, "issueKey");
		const result = await runCliWithRetry(["issue", "close", issueKey]);
		expectSuccess(result);
	});

	it("課題を再開する", async () => {
		requireDep(issueKey, "issueKey");
		const result = await runCliWithRetry(["issue", "reopen", issueKey]);
		expectSuccess(result);
	});

	it("課題を削除する", async () => {
		requireDep(issueKey, "issueKey");
		const result = await runCliWithRetry(["issue", "delete", issueKey, "--yes"]);
		expectSuccess(result);
		tracker.cleanupAll();
	});
});
