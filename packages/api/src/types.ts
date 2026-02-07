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

/** Backlog change log entry in a comment. */
export interface BacklogChangeLog {
	field: string;
	newValue: string | null;
	originalValue: string | null;
	attachmentInfo: { id: number; name: string } | null;
	attributeInfo: { id: number; typeId: string } | null;
	notificationInfo: { type: string } | null;
}

/** Backlog comment notification. */
export interface BacklogCommentNotification {
	id: number;
	alreadyRead: boolean;
	reason: number;
	user: BacklogUser;
	resourceAlreadyRead: boolean;
}

/** Backlog shared file object. */
export interface BacklogSharedFile {
	id: number;
	type: string;
	dir: string;
	name: string;
	size: number;
	createdUser: BacklogUser;
	created: string;
	updatedUser: BacklogUser;
	updated: string;
}

/** Backlog issue comment object. */
export interface BacklogComment {
	id: number;
	content: string;
	changeLog: BacklogChangeLog[];
	createdUser: BacklogUser;
	created: string;
	updated: string;
	stars: BacklogStar[];
	notifications: BacklogCommentNotification[];
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
	notifications: BacklogCommentNotification[];
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

/** Fixed status IDs for pull requests defined by Backlog API. */
export const PR_STATUS = {
	Open: 1,
	Closed: 2,
	Merged: 3,
} as const;

/** Backlog pull request comment. */
export interface BacklogPullRequestComment {
	id: number;
	content: string;
	changeLog: BacklogChangeLog[];
	createdUser: BacklogUser;
	created: string;
	updated: string;
	stars: BacklogStar[];
	notifications: BacklogCommentNotification[];
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

/** Backlog wiki page object. */
export interface BacklogWiki {
	id: number;
	projectId: number;
	name: string;
	content: string;
	tags: { id: number; name: string }[];
	attachments: BacklogWikiAttachment[];
	sharedFiles: BacklogSharedFile[];
	stars: BacklogStar[];
	createdUser: BacklogUser;
	created: string;
	updatedUser: BacklogUser;
	updated: string;
}

/** Backlog wiki attachment. */
export interface BacklogWikiAttachment {
	id: number;
	name: string;
	size: number;
	createdUser: BacklogUser;
	created: string;
}

/** Backlog wiki tag. */
export interface BacklogWikiTag {
	id: number;
	name: string;
}

/** Backlog wiki history entry. */
export interface BacklogWikiHistory {
	pageId: number;
	version: number;
	name: string;
	content: string;
	createdUser: BacklogUser;
	created: string;
}

/** Backlog wiki count response. */
export interface BacklogWikiCount {
	count: number;
}

/** Backlog team object. */
export interface BacklogTeam {
	id: number;
	name: string;
	members: BacklogUser[];
	displayOrder: number | null;
	createdUser: BacklogUser;
	created: string;
	updatedUser: BacklogUser;
	updated: string;
}

/** Backlog category object. */
export interface BacklogCategory {
	id: number;
	name: string;
	displayOrder: number;
}

/** Backlog milestone (version) object. */
export interface BacklogMilestone {
	id: number;
	projectId: number;
	name: string;
	description: string;
	startDate: string | null;
	releaseDueDate: string | null;
	archived: boolean;
	displayOrder: number;
}

/** Backlog space disk usage response. */
export interface BacklogSpaceDiskUsage {
	capacity: number;
	issue: number;
	wiki: number;
	file: number;
	subversion: number;
	git: number;
	gitLFS: number;
	pullRequest: number;
	details: {
		projectId: number;
		issue: number;
		wiki: number;
		file: number;
		subversion: number;
		git: number;
		gitLFS: number;
		pullRequest: number;
	}[];
}

/** Backlog space notification response. */
export interface BacklogSpaceNotification {
	content: string;
	updated: string;
}

/** Backlog webhook object. */
export interface BacklogWebhook {
	id: number;
	name: string;
	description: string;
	hookUrl: string;
	allEvent: boolean;
	activityTypeIds: number[];
	createdUser: BacklogUser;
	created: string;
	updatedUser: BacklogUser;
	updated: string;
}

/** Backlog star object. */
export interface BacklogStar {
	id: number;
	comment: string | null;
	url: string;
	title: string;
	presenter: BacklogUser;
	created: string;
}

/** Backlog star count response. */
export interface BacklogStarCount {
	count: number;
}

/** Backlog watching object. */
export interface BacklogWatching {
	id: number;
	resourceAlreadyRead: boolean;
	note: string;
	type: string;
	issue?: BacklogIssue;
	lastContentUpdated: string | null;
	created: string;
	updated: string;
}

/** Backlog watching count response. */
export interface BacklogWatchingCount {
	count: number;
}
