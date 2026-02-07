import { defineCommand } from "citty";

export default defineCommand({
	meta: {
		name: "api",
		description: "Make an authenticated API request",
	},
	args: {
		endpoint: {
			type: "positional",
			description: "API endpoint path (e.g., /api/v2/users/myself)",
			required: true,
		},
		method: {
			type: "string",
			alias: "X",
			description: "HTTP method",
			default: "GET",
		},
		field: {
			type: "string",
			alias: "f",
			description: "Request field (key=value, repeatable)",
		},
		header: {
			type: "string",
			alias: "H",
			description: "Additional header (repeatable)",
		},
		include: {
			type: "boolean",
			alias: "i",
			description: "Include response headers",
		},
		paginate: {
			type: "boolean",
			description: "Paginate through all results",
		},
		silent: {
			type: "boolean",
			description: "Suppress output",
		},
	},
	run({ args }) {
		throw new Error("Not implemented");
	},
});
