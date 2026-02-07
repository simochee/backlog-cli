import { defineCommand } from "citty";

export default defineCommand({
	meta: {
		name: "activities",
		description: "Show recent project activities",
	},
	args: {
		projectKey: {
			type: "positional",
			description: "Project key",
		},
		limit: {
			type: "string",
			alias: "L",
			description: "Number of results",
			default: "20",
		},
	},
	run({ args }) {
		throw new Error("Not implemented");
	},
});
