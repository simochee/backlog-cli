import { defineCommand } from "citty";

export default defineCommand({
	meta: {
		name: "set",
		description: "Set a configuration value",
	},
	args: {
		key: {
			type: "positional",
			description: "Config key",
			required: true,
		},
		value: {
			type: "positional",
			description: "Config value",
			required: true,
		},
		hostname: {
			type: "string",
			description: "Set space-specific config",
		},
	},
	run() {
		throw new Error("Not implemented");
	},
});
