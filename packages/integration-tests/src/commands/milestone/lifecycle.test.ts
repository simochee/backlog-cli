import { afterAll, describe, expect, it } from "bun:test";

import { expectSuccess, requireDep } from "../../helpers/assertions.ts";
import { getEnv } from "../../helpers/env.ts";
import { ResourceTracker } from "../../helpers/resource.ts";
import { runCliJsonWithRetry, runCliWithRetry } from "../../helpers/retry.ts";

describe("milestone lifecycle", () => {
	const { project } = getEnv();
	const tracker = new ResourceTracker();
	const testName = `integration-test-${Date.now()}`;
	let milestoneId: string;

	afterAll(() => tracker.cleanupAll());

	it("マイルストーン一覧を取得する", async () => {
		const result = await runCliWithRetry(["milestone", "list", "-p", project, "--json"]);
		expectSuccess(result);
	});

	it("マイルストーンを作成する", async () => {
		const result = await runCliWithRetry(["milestone", "create", "-p", project, "-n", testName]);
		expectSuccess(result);
		const listResult = await runCliJsonWithRetry<{ id: number; name: string }[]>(["milestone", "list", "-p", project]);
		const created = listResult.data.find((m) => m.name === testName);
		expect(created).toBeDefined();
		milestoneId = String(created!.id);
		tracker.trackMilestone(project, milestoneId);
	});

	it("マイルストーンを編集する", async () => {
		requireDep(milestoneId, "milestoneId");
		const result = await runCliWithRetry([
			"milestone",
			"edit",
			milestoneId,
			"-p",
			project,
			"-n",
			`${testName}-edited`,
			"-d",
			"test description",
		]);
		expectSuccess(result);
	});

	it("マイルストーンを削除する", async () => {
		requireDep(milestoneId, "milestoneId");
		const result = await runCliWithRetry(["milestone", "delete", milestoneId, "-p", project, "--yes"]);
		expectSuccess(result);
		tracker.cleanupAll();
	});
});
