import { defineCommand } from "citty";

export default defineCommand({
	meta: {
		name: "get",
		description: "Get a configuration value",
	},
	args: {
		key: {
			type: "positional",
			description: "Config key (e.g., default_space, pager)",
			required: true,
		},
		hostname: {
			type: "string",
			description: "Get space-specific config",
		},
	},
	run({ args }) {
		throw new Error("Not implemented");
	},
});
