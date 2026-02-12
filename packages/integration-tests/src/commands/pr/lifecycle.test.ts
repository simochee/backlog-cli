import { afterAll, describe, expect, it } from "bun:test";

import { expectSuccess, requireDep } from "../../helpers/assertions.ts";
import { requirePrEnv } from "../../helpers/env.ts";
import { ResourceTracker } from "../../helpers/resource.ts";
import { runCliJsonWithRetry, runCliWithRetry } from "../../helpers/retry.ts";

const canRunPrTests = Boolean(
	process.env["BACKLOG_REPO"] && process.env["BACKLOG_PR_BASE_BRANCH"] && process.env["BACKLOG_PR_SOURCE_BRANCH"],
);

describe.skipIf(!canRunPrTests)("pr lifecycle", () => {
	const env = requirePrEnv();
	const tracker = new ResourceTracker();
	const testTitle = `integration-test-${Date.now()}`;
	let prNumber: string;

	afterAll(() => tracker.cleanupAll());

	it("PR を作成する", async () => {
		const result = await runCliJsonWithRetry<{ number: number }>([
			"pr",
			"create",
			"-p",
			env.project,
			"--repo",
			env.repo,
			"--title",
			testTitle,
			"--base",
			env.prBaseBranch,
			"--branch",
			env.prSourceBranch,
		]);
		expectSuccess(result);
		expect(result.data.number).toBeDefined();
		prNumber = String(result.data.number);
		// PRs can't be easily deleted, we'll close them at the end
	});

	it("PR 詳細を表示する", async () => {
		requireDep(prNumber, "prNumber");
		const result = await runCliJsonWithRetry<{ number: number; summary: string }>([
			"pr",
			"view",
			prNumber,
			"-p",
			env.project,
			"--repo",
			env.repo,
		]);
		expectSuccess(result);
		expect(result.data.number).toBe(Number(prNumber));
	});

	it("PR を編集する", async () => {
		requireDep(prNumber, "prNumber");
		const result = await runCliWithRetry([
			"pr",
			"edit",
			prNumber,
			"-p",
			env.project,
			"--repo",
			env.repo,
			"--title",
			`${testTitle}-edited`,
		]);
		expectSuccess(result);
	});

	it("PR にコメントする", async () => {
		requireDep(prNumber, "prNumber");
		const result = await runCliWithRetry([
			"pr",
			"comment",
			prNumber,
			"-p",
			env.project,
			"--repo",
			env.repo,
			"--body",
			"integration test comment",
		]);
		expectSuccess(result);
	});

	it("PR のコメント一覧を取得する", async () => {
		requireDep(prNumber, "prNumber");
		const result = await runCliWithRetry(["pr", "comments", prNumber, "-p", env.project, "--repo", env.repo, "--json"]);
		expectSuccess(result);
	});

	it("PR をクローズする", async () => {
		requireDep(prNumber, "prNumber");
		const result = await runCliWithRetry(["pr", "close", prNumber, "-p", env.project, "--repo", env.repo]);
		expectSuccess(result);
	});

	it("PR をリオープンする", async () => {
		requireDep(prNumber, "prNumber");
		const result = await runCliWithRetry(["pr", "reopen", prNumber, "-p", env.project, "--repo", env.repo]);
		expectSuccess(result);
	});

	it("PR を再度クローズする", async () => {
		requireDep(prNumber, "prNumber");
		const result = await runCliWithRetry(["pr", "close", prNumber, "-p", env.project, "--repo", env.repo]);
		expectSuccess(result);
	});
});
