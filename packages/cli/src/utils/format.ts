import type { BacklogIssue, BacklogProject } from "@repo/api";

/**
 * Formats a date string to a short local representation (yyyy-MM-dd).
 */
export function formatDate(dateStr: string | null): string {
	if (!dateStr) return "";
	return dateStr.slice(0, 10);
}

/**
 * Pads or truncates a string to a fixed width.
 */
export function padEnd(str: string, width: number): string {
	if (str.length >= width) {
		return `${str.slice(0, width - 1)}…`;
	}
	return str.padEnd(width);
}

/**
 * Formats an issue for list display as a single line.
 */
export function formatIssueLine(issue: BacklogIssue): string {
	const key = padEnd(issue.issueKey, 16);
	const status = padEnd(issue.status.name, 12);
	const type = padEnd(issue.issueType.name, 12);
	const priority = padEnd(issue.priority.name, 8);
	const assignee = padEnd(issue.assignee?.name ?? "", 14);
	return `${key}${status}${type}${priority}${assignee}${issue.summary}`;
}

/**
 * Formats a project for list display as a single line.
 */
export function formatProjectLine(project: BacklogProject): string {
	const key = padEnd(project.projectKey, 16);
	const name = padEnd(project.name, 30);
	const status = project.archived ? "Archived" : "Active";
	return `${key}${name}${status}`;
}

/** Activity type ID to human-readable label mapping. */
const ACTIVITY_TYPES: Record<number, string> = {
	1: "Issue Created",
	2: "Issue Updated",
	3: "Issue Commented",
	4: "Issue Deleted",
	5: "Wiki Created",
	6: "Wiki Updated",
	7: "Wiki Deleted",
	8: "File Added",
	9: "File Updated",
	10: "File Deleted",
	11: "SVN Committed",
	12: "Git Pushed",
	13: "Git Repo Created",
	14: "Issue Multi-Updated",
	15: "Project User Added",
	16: "Project User Removed",
	17: "Notification Added",
	18: "Pull Request Added",
	19: "Pull Request Updated",
	20: "Pull Request Commented",
	21: "Pull Request Merged",
	22: "Milestone Added",
	23: "Milestone Updated",
	24: "Milestone Deleted",
	25: "Group Added",
	26: "Group Deleted",
};

/**
 * Returns a human-readable label for an activity type ID.
 */
export function getActivityLabel(typeId: number): string {
	return ACTIVITY_TYPES[typeId] ?? `Activity (${typeId})`;
}
