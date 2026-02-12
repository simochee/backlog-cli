import { afterAll, describe, expect, it } from "bun:test";

import { expectSuccess, requireDep } from "../../helpers/assertions.ts";
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
		expect(result.data.length).toBeGreaterThan(0);
		substituteIssueTypeId = String(result.data[0]!.id);
	});

	it("課題種別を作成する", async () => {
		requireDep(substituteIssueTypeId, "substituteIssueTypeId");
		const result = await runCliWithRetry(["issue-type", "create", "-p", project, "-n", testName, "--color", "#e30000"]);
		expectSuccess(result);
		const listResult = await runCliJsonWithRetry<{ id: number; name: string }[]>(["issue-type", "list", "-p", project]);
		const created = listResult.data.find((t) => t.name === testName);
		expect(created).toBeDefined();
		issueTypeId = String(created!.id);
		tracker.trackIssueType(project, issueTypeId, substituteIssueTypeId);
	});

	it("課題種別を編集する", async () => {
		requireDep(issueTypeId, "issueTypeId");
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
		requireDep(issueTypeId, "issueTypeId");
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
