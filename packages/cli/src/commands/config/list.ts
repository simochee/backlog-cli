import { defineCommand } from "citty";

export default defineCommand({
	meta: {
		name: "list",
		description: "List all configuration values",
	},
	args: {
		hostname: {
			type: "string",
			description: "Filter by space hostname",
		},
	},
	run({ args }) {
		throw new Error("Not implemented");
	},
});
