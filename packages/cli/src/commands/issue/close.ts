import { defineCommand } from "citty";

export default defineCommand({
	meta: {
		name: "close",
		description: "Close an issue",
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
			description: "Close comment",
		},
		resolution: {
			type: "string",
			alias: "r",
			description: "Resolution name",
			default: "完了",
		},
	},
	run() {
		throw new Error("Not implemented");
	},
});
