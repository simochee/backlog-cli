import { defineCommand } from "citty";

export default defineCommand({
	meta: {
		name: "status",
		description: "Show authentication status",
	},
	args: {
		hostname: {
			type: "string",
			alias: "h",
			description: "Filter by space hostname",
		},
		"show-token": {
			type: "boolean",
			description: "Display the auth token",
		},
	},
	run() {
		throw new Error("Not implemented");
	},
});
