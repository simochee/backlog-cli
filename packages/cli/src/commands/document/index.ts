import { defineCommand } from "citty";

export default defineCommand({
	meta: {
		name: "document",
		description: "Manage documents",
	},
	subCommands: {
		list: () => import("./list.ts").then((m) => m.default),
		view: () => import("./view.ts").then((m) => m.default),
		create: () => import("./create.ts").then((m) => m.default),
		delete: () => import("./delete.ts").then((m) => m.default),
		tree: () => import("./tree.ts").then((m) => m.default),
		attachments: () => import("./attachments.ts").then((m) => m.default),
	},
});
