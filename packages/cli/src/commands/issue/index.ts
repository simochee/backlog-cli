import { defineCommand } from "citty";

export default defineCommand({
	meta: {
		name: "issue",
		description: "Manage issues",
	},
	subCommands: {
		list: () => import("./list.ts").then((m) => m.default),
		view: () => import("./view.ts").then((m) => m.default),
		create: () => import("./create.ts").then((m) => m.default),
		edit: () => import("./edit.ts").then((m) => m.default),
		close: () => import("./close.ts").then((m) => m.default),
		reopen: () => import("./reopen.ts").then((m) => m.default),
		delete: () => import("./delete.ts").then((m) => m.default),
		comment: () => import("./comment.ts").then((m) => m.default),
		status: () => import("./status.ts").then((m) => m.default),
	},
});
