import { afterAll, describe, it } from "vitest";

import { expectSuccess } from "../../helpers/assertions.ts";
import { getEnv } from "../../helpers/env.ts";
import { ResourceTracker } from "../../helpers/resource.ts";
import { runCliJsonWithRetry, runCliWithRetry } from "../../helpers/retry.ts";

describe("issue-type lifecycle", () => {
	const { project } = getEnv();
	const tracker = new ResourceTracker();
	const testName = `integration-test-${Date.now()}`;
	let issueTypeId: string;
	let substituteIssueTypeId: string;

	afterAll(() => tracker.cleanupAll());

	it("課題種別一覧を取得する", async () => {
		const result = await runCliJsonWithRetry<{ id: number; name: string }[]>(["issue-type", "list", "-p", project]);
		expectSuccess(result);
		// Save first existing issue type as substitute for delete
		const firstIssueType = result.data[0];
		if (!firstIssueType) {
			throw new Error("Expected at least one issue type");
		}
		substituteIssueTypeId = String(firstIssueType.id);
	});

	it("課題種別を作成する", async () => {
		const result = await runCliWithRetry(["issue-type", "create", "-p", project, "-n", testName, "--color", "#e30000"]);
		expectSuccess(result);
		const listResult = await runCliJsonWithRetry<{ id: number; name: string }[]>(["issue-type", "list", "-p", project]);
		const created = listResult.data.find((t) => t.name === testName);
		if (!created) {
			throw new Error(`Expected issue type "${testName}" to be in list`);
		}
		issueTypeId = String(created.id);
		tracker.trackIssueType(project, issueTypeId, substituteIssueTypeId);
	});

	it("課題種別を編集する", async () => {
		const result = await runCliWithRetry([
			"issue-type",
			"edit",
			issueTypeId,
			"-p",
			project,
			"-n",
			`${testName}-edited`,
		]);
		expectSuccess(result);
	});

	it("課題種別を削除する", async () => {
		const result = await runCliWithRetry([
			"issue-type",
			"delete",
			issueTypeId,
			"-p",
			project,
			"--substitute-issue-type-id",
			substituteIssueTypeId,
			"--yes",
		]);
		expectSuccess(result);
		tracker.cleanupAll();
	});
});
