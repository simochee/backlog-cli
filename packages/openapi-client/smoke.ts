/**
 * Smoke test script: TypeSpec 定義が実際の Backlog API レスポンスと一致するか検証する
 *
 * Usage:
 *   BACKLOG_HOST=xxx.backlog.com BACKLOG_API_KEY=xxx bun run packages/openapi-client/smoke.ts
 *   BACKLOG_HOST=xxx.backlog.jp  BACKLOG_API_KEY=xxx bun run packages/openapi-client/smoke.ts
 *
 * Optional:
 *   BACKLOG_PROJECT_ID=PROJECT_KEY  (プロジェクト固有のテストを実行)
 *   BACKLOG_ISSUE_KEY=PROJECT-1     (課題固有のテストを実行)
 */

import type { ZodType } from "zod";

import { ofetch, type $Fetch } from "ofetch";

import {
	zSpacesGetSpaceResponse,
	zUsersGetMyselfResponse,
	zUsersListResponse,
	zProjectsListResponse,
	zProjectsGetResponse,
	zIssuesListResponse,
	zIssuesGetResponse,
	zIssuesCountResponse,
	zIssueTypesListResponse,
	zStatusesListResponse,
	zCategoriesListResponse,
	zVersionsListResponse,
	zCustomFieldsListResponse,
	zPrioritiesAndResolutionsListPrioritiesResponse,
	zPrioritiesAndResolutionsListResolutionsResponse,
	zSpacesGetDiskUsageResponse,
	zSpacesGetActivitiesResponse,
	zLicenceAndRateLimitGetLicenceResponse,
	zLicenceAndRateLimitGetRateLimitResponse,
	zProjectsGetActivitiesResponse,
	zProjectMembersListResponse,
	zGitRepositoriesListResponse,
	zWebhooksListResponse,
	zWikisListResponse,
	zWikisCountResponse,
	zNotificationsListResponse,
	zNotificationsCountResponse,
	zGroupsListResponse,
	zTeamsListResponse,
	zIssueCommentsListResponse,
	zIssueCommentsCountResponse,
} from "./src/generated/zod.gen";

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

const HOST = process.env["BACKLOG_HOST"];
const API_KEY = process.env["BACKLOG_API_KEY"];
const PROJECT_ID = process.env["BACKLOG_PROJECT_ID"]; // optional
const ISSUE_KEY = process.env["BACKLOG_ISSUE_KEY"]; // optional

if (!HOST || !API_KEY) {
	console.error("Required env vars: BACKLOG_HOST, BACKLOG_API_KEY");
	process.exit(1);
}

const MAX_RETRIES = 5;
const BASE_DELAY_MS = 2000;

// ---------------------------------------------------------------------------
// HTTP client with retry
// ---------------------------------------------------------------------------

const client: $Fetch = ofetch.create({
	baseURL: `https://${HOST}/api/v2`,
	query: { apiKey: API_KEY },
});

async function fetchWithRetry<T>(path: string, query?: Record<string, unknown>): Promise<T> {
	for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
		try {
			return await client<T>(path, { query });
		} catch (err: unknown) {
			const status = err && typeof err === "object" && "status" in err ? (err as { status: number }).status : undefined;

			if (status === 429 && attempt < MAX_RETRIES) {
				const delay = BASE_DELAY_MS * 2 ** attempt;
				console.log(`  ⏳ Rate limited. Retrying in ${delay}ms... (${attempt + 1}/${MAX_RETRIES})`);
				await new Promise((r) => setTimeout(r, delay));
				continue;
			}
			throw err;
		}
	}
	throw new Error("unreachable");
}

// ---------------------------------------------------------------------------
// Test runner
// ---------------------------------------------------------------------------

interface TestCase {
	name: string;
	path: string;
	query?: Record<string, unknown>;
	schema: ZodType;
	skip?: boolean;
}

const results: { name: string; ok: boolean; error?: string }[] = [];

async function runTest(tc: TestCase) {
	if (tc.skip) {
		console.log(`⏭  SKIP  ${tc.name}`);
		return;
	}

	process.stdout.write(`🔍 ${tc.name} ... `);

	try {
		const data = await fetchWithRetry(tc.path, tc.query);
		const result = tc.schema.safeParse(data);

		if (result.success) {
			console.log("✅ OK");
			results.push({ name: tc.name, ok: true });
		} else {
			console.log("❌ VALIDATION FAILED");
			const issues = result.error.issues;
			for (const issue of issues.slice(0, 10)) {
				console.log(`     path: ${issue.path.join(".")} — ${issue.message} (code: ${issue.code})`);
			}
			if (issues.length > 10) {
				console.log(`     ... and ${issues.length - 10} more issues`);
			}
			results.push({
				name: tc.name,
				ok: false,
				error: `${issues.length} validation issue(s)`,
			});
		}
	} catch (err: unknown) {
		const msg = err instanceof Error ? err.message : String(err);
		console.log(`💥 REQUEST FAILED: ${msg}`);
		results.push({ name: tc.name, ok: false, error: msg });
	}
}

// ---------------------------------------------------------------------------
// Test cases
// ---------------------------------------------------------------------------

const tests: TestCase[] = [
	// ---- Space ----
	{
		name: "GET /space",
		path: "/space",
		schema: zSpacesGetSpaceResponse,
	},
	{
		name: "GET /space/diskUsage",
		path: "/space/diskUsage",
		schema: zSpacesGetDiskUsageResponse,
	},
	{
		name: "GET /space/activities",
		path: "/space/activities",
		query: { count: 5 },
		schema: zSpacesGetActivitiesResponse,
	},
	{
		name: "GET /space/licence",
		path: "/space/licence",
		schema: zLicenceAndRateLimitGetLicenceResponse,
	},
	{
		name: "GET /rateLimit",
		path: "/rateLimit",
		schema: zLicenceAndRateLimitGetRateLimitResponse,
	},

	// ---- Users ----
	{
		name: "GET /users/myself",
		path: "/users/myself",
		schema: zUsersGetMyselfResponse,
	},
	{
		name: "GET /users",
		path: "/users",
		schema: zUsersListResponse,
	},

	// ---- Priorities / Resolutions ----
	{
		name: "GET /priorities",
		path: "/priorities",
		schema: zPrioritiesAndResolutionsListPrioritiesResponse,
	},
	{
		name: "GET /resolutions",
		path: "/resolutions",
		schema: zPrioritiesAndResolutionsListResolutionsResponse,
	},

	// ---- Groups / Teams ----
	{
		name: "GET /groups",
		path: "/groups",
		schema: zGroupsListResponse,
		skip: true, // deprecated endpoint, returns 400 on new plans
	},
	{
		name: "GET /teams",
		path: "/teams",
		schema: zTeamsListResponse,
	},

	// ---- Projects ----
	{
		name: "GET /projects",
		path: "/projects",
		schema: zProjectsListResponse,
	},
	{
		name: "GET /projects/:id",
		path: `/projects/${PROJECT_ID}`,
		schema: zProjectsGetResponse,
		skip: !PROJECT_ID,
	},
	{
		name: "GET /projects/:id/activities",
		path: `/projects/${PROJECT_ID}/activities`,
		query: { count: 5 },
		schema: zProjectsGetActivitiesResponse,
		skip: !PROJECT_ID,
	},
	{
		name: "GET /projects/:id/users",
		path: `/projects/${PROJECT_ID}/users`,
		schema: zProjectMembersListResponse,
		skip: !PROJECT_ID,
	},
	{
		name: "GET /projects/:id/issueTypes",
		path: `/projects/${PROJECT_ID}/issueTypes`,
		schema: zIssueTypesListResponse,
		skip: !PROJECT_ID,
	},
	{
		name: "GET /projects/:id/statuses",
		path: `/projects/${PROJECT_ID}/statuses`,
		schema: zStatusesListResponse,
		skip: !PROJECT_ID,
	},
	{
		name: "GET /projects/:id/categories",
		path: `/projects/${PROJECT_ID}/categories`,
		schema: zCategoriesListResponse,
		skip: !PROJECT_ID,
	},
	{
		name: "GET /projects/:id/versions",
		path: `/projects/${PROJECT_ID}/versions`,
		schema: zVersionsListResponse,
		skip: !PROJECT_ID,
	},
	{
		name: "GET /projects/:id/customFields",
		path: `/projects/${PROJECT_ID}/customFields`,
		schema: zCustomFieldsListResponse,
		skip: !PROJECT_ID,
	},
	{
		name: "GET /projects/:id/gitRepositories",
		path: `/projects/${PROJECT_ID}/gitRepositories`,
		schema: zGitRepositoriesListResponse,
		skip: !PROJECT_ID,
	},
	{
		name: "GET /projects/:id/webhooks",
		path: `/projects/${PROJECT_ID}/webhooks`,
		schema: zWebhooksListResponse,
		skip: !PROJECT_ID,
	},

	// ---- Issues ----
	{
		name: "GET /issues (global, count=5)",
		path: "/issues",
		query: { count: 5 },
		schema: zIssuesListResponse,
	},
	{
		name: "GET /issues/count",
		path: "/issues/count",
		schema: zIssuesCountResponse,
	},
	{
		name: "GET /issues/:key",
		path: `/issues/${ISSUE_KEY}`,
		schema: zIssuesGetResponse,
		skip: !ISSUE_KEY,
	},
	{
		name: "GET /issues/:key/comments",
		path: `/issues/${ISSUE_KEY}/comments`,
		query: { count: 5 },
		schema: zIssueCommentsListResponse,
		skip: !ISSUE_KEY,
	},
	{
		name: "GET /issues/:key/comments/count",
		path: `/issues/${ISSUE_KEY}/comments/count`,
		schema: zIssueCommentsCountResponse,
		skip: !ISSUE_KEY,
	},

	// ---- Wiki ----
	{
		name: "GET /wikis",
		path: "/wikis",
		query: PROJECT_ID ? { projectIdOrKey: PROJECT_ID } : undefined,
		schema: zWikisListResponse,
		skip: !PROJECT_ID, // projectIdOrKey is required
	},
	{
		name: "GET /wikis/count",
		path: "/wikis/count",
		query: PROJECT_ID ? { projectIdOrKey: PROJECT_ID } : undefined,
		schema: zWikisCountResponse,
		skip: !PROJECT_ID, // projectIdOrKey is required
	},

	// ---- Notifications ----
	{
		name: "GET /notifications",
		path: "/notifications",
		query: { count: 5 },
		schema: zNotificationsListResponse,
	},
	{
		name: "GET /notifications/count",
		path: "/notifications/count",
		schema: zNotificationsCountResponse,
	},
];

// ---------------------------------------------------------------------------
// Run
// ---------------------------------------------------------------------------

console.log("=".repeat(60));
console.log(`Backlog API Smoke Test`);
console.log(`Host: ${HOST}`);
console.log(`Project: ${PROJECT_ID ?? "(not set)"}`);
console.log(`Issue: ${ISSUE_KEY ?? "(not set)"}`);
console.log("=".repeat(60));
console.log();

for (const tc of tests) {
	await runTest(tc);
}

// ---------------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------------

console.log();
console.log("=".repeat(60));
console.log("Summary");
console.log("=".repeat(60));

const passed = results.filter((r) => r.ok).length;
const failed = results.filter((r) => !r.ok).length;
const skipped = tests.filter((t) => t.skip).length;

console.log(`  ✅ Passed:  ${passed}`);
console.log(`  ❌ Failed:  ${failed}`);
console.log(`  ⏭  Skipped: ${skipped}`);
console.log();

if (failed > 0) {
	console.log("Failed tests:");
	for (const r of results.filter((r) => !r.ok)) {
		console.log(`  - ${r.name}: ${r.error}`);
	}
	process.exit(1);
}

console.log("All tests passed! 🎉");
