import { defineCommand } from "citty";

export default defineCommand({
	meta: {
		name: "list",
		description: "List projects",
	},
	args: {
		archived: {
			type: "boolean",
			description: "Include archived projects",
		},
		all: {
			type: "boolean",
			description: "Show all projects (admin only)",
		},
		limit: {
			type: "string",
			alias: "L",
			description: "Number of results",
			default: "20",
		},
	},
	run() {
		throw new Error("Not implemented");
	},
});
