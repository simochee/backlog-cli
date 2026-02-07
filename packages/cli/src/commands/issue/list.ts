import { defineCommand } from "citty";

export default defineCommand({
	meta: {
		name: "list",
		description: "List issues",
	},
	args: {
		project: {
			type: "string",
			alias: "p",
			description: "Project key (multiple allowed, comma-separated)",
		},
		assignee: {
			type: "string",
			alias: "a",
			description: "Assignee (username or @me)",
		},
		status: {
			type: "string",
			alias: "S",
			description: "Status name (multiple allowed, comma-separated)",
		},
		type: {
			type: "string",
			alias: "T",
			description: "Issue type name (multiple allowed, comma-separated)",
		},
		priority: {
			type: "string",
			alias: "P",
			description: "Priority name",
		},
		keyword: {
			type: "string",
			alias: "k",
			description: "Keyword search",
		},
		sort: {
			type: "string",
			description: "Sort key",
			default: "updated",
		},
		order: {
			type: "string",
			description: "Sort order: asc or desc",
			default: "desc",
		},
		limit: {
			type: "string",
			alias: "L",
			description: "Number of results (1-100)",
			default: "20",
		},
		offset: {
			type: "string",
			description: "Offset for pagination",
		},
	},
	run() {
		throw new Error("Not implemented");
	},
});
