import { defineCommand } from "citty";

export default defineCommand({
	meta: {
		name: "logout",
		description: "Remove authentication for a Backlog space",
	},
	args: {
		hostname: {
			type: "string",
			alias: "h",
			description: "Space hostname to log out from",
		},
	},
	run() {
		throw new Error("Not implemented");
	},
});
