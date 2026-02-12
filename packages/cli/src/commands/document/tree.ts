import type { BacklogDocumentTree, BacklogDocumentTreeNode } from "@repo/api";

import { getClient } from "#utils/client.ts";
import { outputArgs, outputResult } from "#utils/output.ts";
import { resolveProjectArg } from "#utils/resolve.ts";
import { defineCommand } from "citty";
import consola from "consola";

function printTree(nodes: BacklogDocumentTreeNode[], prefix: string, isLast: boolean[]): void {
	for (const [i, node] of nodes.entries()) {
		const last = i === nodes.length - 1;
		const connector = last ? "└── " : "├── ";
		const emoji = node.emoji ? `${node.emoji} ` : "";
		consola.log(`${prefix}${connector}${emoji}${node.name}`);

		if (node.children.length > 0) {
			const childPrefix = prefix + (last ? "    " : "│   ");
			printTree(node.children, childPrefix, [...isLast, last]);
		}
	}
}

export default defineCommand({
	meta: {
		name: "tree",
		description: "Show document tree",
	},
	args: {
		...outputArgs,
		project: {
			type: "string",
			alias: "p",
			description: "Project key (env: BACKLOG_PROJECT)",
		},
	},
	async run({ args }) {
		const project = resolveProjectArg(args.project);
		const { client } = await getClient();

		const tree = await client<BacklogDocumentTree>("/documents/tree", {
			query: { projectIdOrKey: project },
		});

		outputResult(tree, args, (data) => {
			if (data.activeTree.children.length === 0) {
				consola.info("No documents found.");
				return;
			}

			printTree(data.activeTree.children, "", []);
		});
	},
});
