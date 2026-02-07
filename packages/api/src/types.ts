/** Backlog user object returned from API. */
export interface BacklogUser {
	id: number;
	userId: string;
	name: string;
	roleType: number;
	lang: string | null;
	mailAddress: string;
	lastLoginTime: string | null;
}

/** Backlog project object returned from API. */
export interface BacklogProject {
	id: number;
	projectKey: string;
	name: string;
	chartEnabled: boolean;
	useResolvedForChart: boolean;
	subtaskingEnabled: boolean;
	projectLeaderCanEditProjectLeader: boolean;
	useWiki: boolean;
	useFileSharing: boolean;
	useWikiTreeView: boolean;
	useOriginalImageSizeAtWiki: boolean;
	textFormattingRule: "backlog" | "markdown";
	archived: boolean;
	displayOrder: number;
	useDevAttributes: boolean;
}

/** Backlog issue status. */
export interface BacklogStatus {
	id: number;
	projectId: number;
	name: string;
	color: string;
	displayOrder: number;
}

/** Backlog issue type. */
export interface BacklogIssueType {
	id: number;
	projectId: number;
	name: string;
	color: string;
	displayOrder: number;
	templateSummary: string | null;
	templateDescription: string | null;
}

/** Backlog priority. */
export interface BacklogPriority {
	id: number;
	name: string;
}

/** Backlog issue object returned from API. */
export interface BacklogIssue {
	id: number;
	projectId: number;
	issueKey: string;
	keyId: number;
	issueType: BacklogIssueType;
	summary: string;
	description: string;
	priority: BacklogPriority;
	status: BacklogStatus;
	assignee: BacklogUser | null;
	category: { id: number; name: string }[];
	versions: { id: number; name: string }[];
	milestone: { id: number; name: string }[];
	startDate: string | null;
	dueDate: string | null;
	estimatedHours: number | null;
	actualHours: number | null;
	parentIssueId: number | null;
	createdUser: BacklogUser;
	created: string;
	updatedUser: BacklogUser;
	updated: string;
}

/** Backlog issue comment object. */
export interface BacklogComment {
	id: number;
	content: string;
	changeLog: unknown[];
	createdUser: BacklogUser;
	created: string;
	updated: string;
	stars: unknown[];
	notifications: unknown[];
}

/** Backlog resolution (completion reason). */
export interface BacklogResolution {
	id: number;
	name: string;
}

/** Backlog project activity. */
export interface BacklogActivity {
	id: number;
	project: BacklogProject;
	type: number;
	content: Record<string, unknown>;
	notifications: unknown[];
	createdUser: BacklogUser;
	created: string;
}

/** Backlog space object. */
export interface BacklogSpace {
	spaceKey: string;
	name: string;
	ownerId: number;
	lang: string;
	timezone: string;
	reportSendTime: string;
	textFormattingRule: "backlog" | "markdown";
	created: string;
	updated: string;
}

/** Backlog Git repository object. */
export interface BacklogRepository {
	id: number;
	projectId: number;
	name: string;
	description: string | null;
	hookUrl: string | null;
	httpUrl: string;
	sshUrl: string;
	displayOrder: number;
	pushedAt: string | null;
	createdUser: BacklogUser;
	created: string;
	updatedUser: BacklogUser;
	updated: string;
}

/** Backlog pull request object. */
export interface BacklogPullRequest {
	id: number;
	projectId: number;
	repositoryId: number;
	number: number;
	summary: string;
	description: string;
	base: string;
	branch: string;
	status: BacklogPullRequestStatus;
	assignee: BacklogUser | null;
	issue: BacklogIssue | null;
	baseCommit: string | null;
	branchCommit: string | null;
	mergeCommit: string | null;
	closeAt: string | null;
	mergeAt: string | null;
	createdUser: BacklogUser;
	created: string;
	updatedUser: BacklogUser;
	updated: string;
}

/** Backlog pull request status. */
export interface BacklogPullRequestStatus {
	id: number;
	name: string;
}

/** Backlog pull request comment. */
export interface BacklogPullRequestComment {
	id: number;
	content: string;
	changeLog: unknown[];
	createdUser: BacklogUser;
	created: string;
	updated: string;
	stars: unknown[];
	notifications: unknown[];
}

/** Backlog notification object. */
export interface BacklogNotification {
	id: number;
	alreadyRead: boolean;
	reason: number;
	resourceAlreadyRead: boolean;
	project: BacklogProject;
	issue?: BacklogIssue;
	comment?: BacklogComment;
	pullRequest?: BacklogPullRequest;
	sender: BacklogUser;
	created: string;
}

/** Backlog notification count response. */
export interface BacklogNotificationCount {
	count: number;
}
