import { runCli } from "./cli.ts";

type CleanupFn = () => Promise<void>;

export class ResourceTracker {
	private cleanups: CleanupFn[] = [];

	track(cleanup: CleanupFn): void {
		this.cleanups.push(cleanup);
	}

	trackIssue(issueKey: string): void {
		this.track(async () => {
			await runCli(["issue", "delete", issueKey, "--yes"]);
		});
	}

	trackCategory(project: string, id: string): void {
		this.track(async () => {
			await runCli(["category", "delete", id, "-p", project, "--yes"]);
		});
	}

	trackMilestone(project: string, id: string): void {
		this.track(async () => {
			await runCli(["milestone", "delete", id, "-p", project, "--yes"]);
		});
	}

	trackIssueType(project: string, id: string, substituteId: string): void {
		this.track(async () => {
			await runCli(["issue-type", "delete", id, "-p", project, "--substitute-issue-type-id", substituteId, "--yes"]);
		});
	}

	trackStatus(project: string, id: string, substituteId: string): void {
		this.track(async () => {
			await runCli(["status", "delete", id, "-p", project, "--substitute-status-id", substituteId, "--yes"]);
		});
	}

	trackWiki(wikiId: string): void {
		this.track(async () => {
			await runCli(["wiki", "delete", wikiId, "--yes"]);
		});
	}

	trackTeam(teamId: string): void {
		this.track(async () => {
			await runCli(["team", "delete", teamId, "--yes"]);
		});
	}

	trackWebhook(project: string, id: string): void {
		this.track(async () => {
			await runCli(["webhook", "delete", id, "-p", project, "--yes"]);
		});
	}

	async cleanupAll(): Promise<void> {
		// Execute in LIFO order for proper dependency handling
		const reversed = this.cleanups.toReversed();
		for (const cleanup of reversed) {
			try {
				await cleanup();
			} catch (error) {
				console.warn("[ResourceTracker] Cleanup failed:", error);
			}
		}
		this.cleanups = [];
	}
}
