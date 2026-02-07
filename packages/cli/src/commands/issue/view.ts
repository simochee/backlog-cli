import { defineCommand } from "citty";

export default defineCommand({
	meta: {
		name: "view",
		description: "View issue details",
	},
	args: {
		issueKey: {
			type: "positional",
			description: "Issue key (e.g., PROJECT-123)",
			required: true,
		},
		comments: {
			type: "boolean",
			description: "Include comments",
		},
		web: {
			type: "boolean",
			description: "Open in browser",
		},
	},
	run({ args }) {
		throw new Error("Not implemented");
	},
});
