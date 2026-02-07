import { defineCommand } from "citty";

export default defineCommand({
	meta: {
		name: "create",
		description: "Create a new issue",
	},
	args: {
		project: {
			type: "string",
			alias: "p",
			description: "Project key",
		},
		title: {
			type: "string",
			alias: "t",
			description: "Issue summary",
		},
		description: {
			type: "string",
			alias: "d",
			description: 'Issue description (use "-" for stdin)',
		},
		type: {
			type: "string",
			alias: "T",
			description: "Issue type name",
		},
		priority: {
			type: "string",
			alias: "P",
			description: "Priority name",
		},
		assignee: {
			type: "string",
			alias: "a",
			description: "Assignee username",
		},
		"start-date": {
			type: "string",
			description: "Start date (yyyy-MM-dd)",
		},
		"due-date": {
			type: "string",
			description: "Due date (yyyy-MM-dd)",
		},
		web: {
			type: "boolean",
			description: "Open in browser after creation",
		},
	},
	run({ args }) {
		throw new Error("Not implemented");
	},
});
