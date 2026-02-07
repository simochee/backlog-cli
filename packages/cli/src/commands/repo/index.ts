import { defineCommand } from "citty";

export default defineCommand({
	meta: {
		name: "repo",
		description: "Manage Git repositories",
	},
	subCommands: {
		list: () => import("./list.ts").then((m) => m.default),
		view: () => import("./view.ts").then((m) => m.default),
		clone: () => import("./clone.ts").then((m) => m.default),
	},
});
