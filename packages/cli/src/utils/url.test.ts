import { describe, expect, it } from "vitest";
import {
	buildBacklogUrl,
	dashboardUrl,
	issueUrl,
	projectUrl,
	pullRequestUrl,
	repositoryUrl,
	wikiUrl,
} from "#utils/url.ts";

describe("buildBacklogUrl", () => {
	it("ホスト名とパスからURLを構築する", () => {
		expect(buildBacklogUrl("example.backlog.com", "/view/PROJ-1")).toBe(
			"https://example.backlog.com/view/PROJ-1",
		);
	});

	it("パスにクエリパラメータを含む場合もそのまま結合する", () => {
		expect(
			buildBacklogUrl(
				"example.backlog.com",
				"/EditProject.action?project.key=PROJ",
			),
		).toBe("https://example.backlog.com/EditProject.action?project.key=PROJ");
	});
});

describe("issueUrl", () => {
	it("課題キーからURLを構築する", () => {
		expect(issueUrl("example.backlog.com", "PROJ-123")).toBe(
			"https://example.backlog.com/view/PROJ-123",
		);
	});
});

describe("projectUrl", () => {
	it("プロジェクトキーからURLを構築する", () => {
		expect(projectUrl("example.backlog.com", "PROJ")).toBe(
			"https://example.backlog.com/projects/PROJ",
		);
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
		expect(wikiUrl("example.backlog.com", 999)).toBe(
			"https://example.backlog.com/alias/wiki/999",
		);
	});
});

describe("dashboardUrl", () => {
	it("ダッシュボードのURLを構築する", () => {
		expect(dashboardUrl("example.backlog.com")).toBe(
			"https://example.backlog.com/dashboard",
		);
	});
});
