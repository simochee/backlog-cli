import type {
	BacklogIssueType,
	BacklogPriority,
	BacklogProject,
	BacklogResolution,
	BacklogStatus,
	BacklogUser,
} from "@repo/api";
import type { BacklogClient } from "#utils/client.ts";

/**
 * Resolves a project key to a project ID.
 */
export async function resolveProjectId(
	client: BacklogClient,
	projectKey: string,
): Promise<number> {
	const project = await client<BacklogProject>(`/projects/${projectKey}`);
	return project.id;
}

/**
 * Resolves a username to a user ID. Supports `@me` for the current user.
 */
export async function resolveUserId(
	client: BacklogClient,
	username: string,
): Promise<number> {
	if (username === "@me") {
		const me = await client<BacklogUser>("/users/myself");
		return me.id;
	}

	const users = await client<BacklogUser[]>("/users");
	const user = users.find(
		(u: BacklogUser) => u.userId === username || u.name === username,
	);

	if (!user) {
		throw new Error(`User "${username}" not found.`);
	}

	return user.id;
}

/**
 * Resolves a priority name to its ID.
 */
export async function resolvePriorityId(
	client: BacklogClient,
	name: string,
): Promise<number> {
	const priorities = await client<BacklogPriority[]>("/priorities");
	const priority = priorities.find((p: BacklogPriority) => p.name === name);

	if (!priority) {
		const names = priorities.map((p: BacklogPriority) => p.name).join(", ");
		throw new Error(`Priority "${name}" not found. Available: ${names}`);
	}

	return priority.id;
}

/**
 * Resolves a status name to its ID within a project.
 */
export async function resolveStatusId(
	client: BacklogClient,
	projectKey: string,
	name: string,
): Promise<number> {
	const statuses = await client<BacklogStatus[]>(
		`/projects/${projectKey}/statuses`,
	);
	const status = statuses.find((s: BacklogStatus) => s.name === name);

	if (!status) {
		const names = statuses.map((s: BacklogStatus) => s.name).join(", ");
		throw new Error(
			`Status "${name}" not found in project ${projectKey}. Available: ${names}`,
		);
	}

	return status.id;
}

/**
 * Resolves the "completed" status ID for a project.
 */
export async function resolveClosedStatusId(
	client: BacklogClient,
	projectKey: string,
): Promise<number> {
	const statuses = await client<BacklogStatus[]>(
		`/projects/${projectKey}/statuses`,
	);
	const closed =
		statuses.find((s: BacklogStatus) => s.id === 4) ?? statuses.at(-1);

	if (!closed) {
		throw new Error(`No statuses found for project ${projectKey}.`);
	}

	return closed.id;
}

/**
 * Resolves the "open" status ID for a project (first status, typically "未対応").
 */
export async function resolveOpenStatusId(
	client: BacklogClient,
	projectKey: string,
): Promise<number> {
	const statuses = await client<BacklogStatus[]>(
		`/projects/${projectKey}/statuses`,
	);
	const open = statuses.find((s: BacklogStatus) => s.id === 1) ?? statuses[0];

	if (!open) {
		throw new Error(`No statuses found for project ${projectKey}.`);
	}

	return open.id;
}

/**
 * Resolves an issue type name to its ID within a project.
 */
export async function resolveIssueTypeId(
	client: BacklogClient,
	projectKey: string,
	name: string,
): Promise<number> {
	const types = await client<BacklogIssueType[]>(
		`/projects/${projectKey}/issueTypes`,
	);
	const issueType = types.find((t: BacklogIssueType) => t.name === name);

	if (!issueType) {
		const names = types.map((t: BacklogIssueType) => t.name).join(", ");
		throw new Error(
			`Issue type "${name}" not found in project ${projectKey}. Available: ${names}`,
		);
	}

	return issueType.id;
}

/**
 * Resolves a resolution name to its ID.
 */
export async function resolveResolutionId(
	client: BacklogClient,
	name: string,
): Promise<number> {
	const resolutions = await client<BacklogResolution[]>("/resolutions");
	const resolution = resolutions.find(
		(r: BacklogResolution) => r.name === name,
	);

	if (!resolution) {
		const names = resolutions.map((r: BacklogResolution) => r.name).join(", ");
		throw new Error(`Resolution "${name}" not found. Available: ${names}`);
	}

	return resolution.id;
}

/**
 * Extracts the project key from an issue key (e.g., "PROJECT-123" → "PROJECT").
 */
export function extractProjectKey(issueKey: string): string {
	const match = issueKey.match(/^([A-Z][A-Z0-9_]+)-\d+$/);

	if (!match?.[1]) {
		throw new Error(
			`Invalid issue key format: "${issueKey}". Expected format: PROJECT-123`,
		);
	}

	return match[1];
}
