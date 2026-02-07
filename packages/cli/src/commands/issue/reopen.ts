import { defineCommand } from "citty";

export default defineCommand({
	meta: {
		name: "reopen",
		description: "Reopen a closed issue",
	},
	args: {
		issueKey: {
			type: "positional",
			description: "Issue key (e.g., PROJECT-123)",
			required: true,
		},
		comment: {
			type: "string",
			alias: "c",
			description: "Reopen comment",
		},
	},
	run() {
		throw new Error("Not implemented");
	},
});
