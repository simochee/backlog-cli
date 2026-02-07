import { defineCommand } from "citty";

export default defineCommand({
	meta: {
		name: "comment",
		description: "Add a comment to an issue",
	},
	args: {
		issueKey: {
			type: "positional",
			description: "Issue key (e.g., PROJECT-123)",
			required: true,
		},
		body: {
			type: "string",
			alias: "b",
			description: 'Comment body (use "-" for stdin)',
		},
	},
	run() {
		throw new Error("Not implemented");
	},
});
