import { defineCommand } from "citty";

export default defineCommand({
	meta: {
		name: "view",
		description: "View project details",
	},
	args: {
		projectKey: {
			type: "positional",
			description: "Project key",
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
