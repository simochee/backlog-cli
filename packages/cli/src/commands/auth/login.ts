import { defineCommand } from "citty";

export default defineCommand({
	meta: {
		name: "login",
		description: "Authenticate with a Backlog space",
	},
	args: {
		hostname: {
			type: "string",
			alias: "h",
			description: "Space hostname (e.g., xxx.backlog.com)",
		},
		method: {
			type: "string",
			alias: "m",
			description: "Auth method: api-key or oauth",
			default: "api-key",
		},
		"with-token": {
			type: "boolean",
			description: "Read token from stdin",
		},
	},
	run({ args }) {
		throw new Error("Not implemented");
	},
});
