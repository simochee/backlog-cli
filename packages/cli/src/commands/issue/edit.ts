import { defineCommand } from "citty";

export default defineCommand({
	meta: {
		name: "edit",
		description: "Edit an existing issue",
	},
	args: {
		issueKey: {
			type: "positional",
			description: "Issue key (e.g., PROJECT-123)",
			required: true,
		},
		title: {
			type: "string",
			alias: "t",
			description: "Issue summary",
		},
		description: {
			type: "string",
			alias: "d",
			description: "Issue description",
		},
		status: {
			type: "string",
			alias: "S",
			description: "Status name",
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
		comment: {
			type: "string",
			alias: "c",
			description: "Update comment",
		},
	},
	run() {
		throw new Error("Not implemented");
	},
});
