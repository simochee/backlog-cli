import { describe, expect, it } from "bun:test";

// Note: openUrl is not tested here because bun:test runs all files in the same
// process and mock.module leaks across test files. 10+ command test files mock
// "#utils/url.ts", making it impossible to get the real openUrl in this file.
// openUrl is a trivial `await open(url)` wrapper already covered by command tests.
const { buildBacklogUrl, dashboardUrl, documentUrl, issueUrl, projectUrl, pullRequestUrl, repositoryUrl, wikiUrl } =
	await import("#utils/url.ts");

describe("buildBacklogUrl", () => {
	it("ホスト名とパスからURLを構築する", () => {
		expect(buildBacklogUrl("example.backlog.com", "/view/PROJ-1")).toBe("https://example.backlog.com/view/PROJ-1");
	});

	it("パスにクエリパラメータを含む場合もそのまま結合する", () => {
		expect(buildBacklogUrl("example.backlog.com", "/EditProject.action?project.key=PROJ")).toBe(
			"https://example.backlog.com/EditProject.action?project.key=PROJ",
		);
	});
});

describe("issueUrl", () => {
	it("課題キーからURLを構築する", () => {
		expect(issueUrl("example.backlog.com", "PROJ-123")).toBe("https://example.backlog.com/view/PROJ-123");
	});
});

describe("projectUrl", () => {
	it("プロジェクトキーからURLを構築する", () => {
		expect(projectUrl("example.backlog.com", "PROJ")).toBe("https://example.backlog.com/projects/PROJ");
	});
});

describe("pullRequestUrl", () => {
	it("プルリクエストのURLを構築する", () => {
		expect(pullRequestUrl("example.backlog.com", "PROJ", "my-repo", 42)).toBe(
			"https://example.backlog.com/git/PROJ/my-repo/pullRequests/42",
		);
	});
});

describe("repositoryUrl", () => {
	it("リポジトリのURLを構築する", () => {
		expect(repositoryUrl("example.backlog.com", "PROJ", "my-repo")).toBe(
			"https://example.backlog.com/git/PROJ/my-repo",
		);
	});
});

describe("wikiUrl", () => {
	it("WikiページIDからURLを構築する", () => {
		expect(wikiUrl("example.backlog.com", 999)).toBe("https://example.backlog.com/alias/wiki/999");
	});
});

describe("documentUrl", () => {
	it("ドキュメントのURLを構築する", () => {
		expect(documentUrl("example.backlog.com", "PROJ", "abc-123")).toBe(
			"https://example.backlog.com/projects/PROJ/document/abc-123",
		);
	});
});

describe("dashboardUrl", () => {
	it("ダッシュボードのURLを構築する", () => {
		expect(dashboardUrl("example.backlog.com")).toBe("https://example.backlog.com/dashboard");
	});
});
