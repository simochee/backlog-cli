import { defineCommand } from "citty";

export default defineCommand({
	meta: {
		name: "status",
		description: "Show issue status summary for yourself",
	},
	args: {},
	run() {
		throw new Error("Not implemented");
	},
});
