import { defineCommand } from "citty";

export default defineCommand({
	meta: {
		name: "token",
		description: "Print the auth token to stdout",
	},
	args: {
		hostname: {
			type: "string",
			alias: "h",
			description: "Space hostname",
		},
	},
	run() {
		throw new Error("Not implemented");
	},
});
