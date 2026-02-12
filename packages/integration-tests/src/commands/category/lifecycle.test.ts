import { afterAll, describe, it } from "vitest";

import { expectSuccess } from "../../helpers/assertions.ts";
import { getEnv } from "../../helpers/env.ts";
import { ResourceTracker } from "../../helpers/resource.ts";
import { runCliJsonWithRetry, runCliWithRetry } from "../../helpers/retry.ts";

describe("category lifecycle", () => {
	const { project } = getEnv();
	const tracker = new ResourceTracker();
	const testName = `integration-test-${Date.now()}`;
	let categoryId: string;

	afterAll(() => tracker.cleanupAll());

	it("カテゴリ一覧を取得する", async () => {
		const result = await runCliWithRetry(["category", "list", "-p", project, "--json"]);
		expectSuccess(result);
	});

	it("カテゴリを作成する", async () => {
		const result = await runCliWithRetry(["category", "create", "-p", project, "-n", testName]);
		expectSuccess(result);
		// Extract ID from JSON list
		const listResult = await runCliJsonWithRetry<{ id: number; name: string }[]>(["category", "list", "-p", project]);
		const created = listResult.data.find((c) => c.name === testName);
		if (!created) {
			throw new Error(`Expected category "${testName}" to be in list`);
		}
		categoryId = String(created.id);
		tracker.trackCategory(project, categoryId);
	});

	it("カテゴリ名を変更する", async () => {
		const newName = `${testName}-edited`;
		const result = await runCliWithRetry(["category", "edit", categoryId, "-p", project, "-n", newName]);
		expectSuccess(result);
	});

	it("カテゴリを削除する", async () => {
		const result = await runCliWithRetry(["category", "delete", categoryId, "-p", project, "--yes"]);
		expectSuccess(result);
		tracker.cleanupAll();
	});
});
