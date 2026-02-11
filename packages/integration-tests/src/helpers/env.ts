const REQUIRED_VARS = ["BACKLOG_SPACE", "BACKLOG_API_KEY", "BACKLOG_PROJECT"] as const;

const OPTIONAL_VARS = ["BACKLOG_REPO", "BACKLOG_PR_BASE_BRANCH", "BACKLOG_PR_SOURCE_BRANCH"] as const;

export function validateEnv(): void {
	const missing = REQUIRED_VARS.filter((key) => !process.env[key]);
	if (missing.length > 0) {
		throw new Error(
			`Missing required environment variables for integration tests:\n${missing.map((v) => `  - ${v}`).join("\n")}\n\nSet them before running integration tests.`,
		);
	}
}

export interface Env {
	space: string;
	apiKey: string;
	project: string;
	repo: string | undefined;
	prBaseBranch: string | undefined;
	prSourceBranch: string | undefined;
}

export function getEnv(): Env {
	return {
		space: process.env.BACKLOG_SPACE!,
		apiKey: process.env.BACKLOG_API_KEY!,
		project: process.env.BACKLOG_PROJECT!,
		repo: process.env.BACKLOG_REPO,
		prBaseBranch: process.env.BACKLOG_PR_BASE_BRANCH,
		prSourceBranch: process.env.BACKLOG_PR_SOURCE_BRANCH,
	};
}

export function requirePrEnv(): Env & { repo: string; prBaseBranch: string; prSourceBranch: string } {
	const env = getEnv();
	const missing = OPTIONAL_VARS.filter((key) => !process.env[key]);
	if (missing.length > 0) {
		throw new Error(`Missing environment variables for PR tests:\n${missing.map((v) => `  - ${v}`).join("\n")}`);
	}
	return env as Env & { repo: string; prBaseBranch: string; prSourceBranch: string };
}
