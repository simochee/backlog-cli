import type { BacklogDocument } from "@repo/api";
import type { DocumentsCreateData } from "@repo/openapi-client";

import { getClient } from "#utils/client.ts";
import { resolveProjectArg, resolveProjectId } from "#utils/resolve.ts";
import readStdin from "#utils/stdin.ts";
import { defineCommand } from "citty";
import consola from "consola";

export default defineCommand({
	meta: {
		name: "create",
		description: "Create a document",
	},
	args: {
		project: {
			type: "string",
			alias: "p",
			description: "Project key (env: BACKLOG_PROJECT)",
		},
		title: {
			type: "string",
			alias: "t",
			description: "Document title",
		},
		body: {
			type: "string",
			alias: "b",
			description: "Document content (Markdown)",
		},
		emoji: {
			type: "string",
			description: "Emoji displayed next to the title",
		},
		"parent-id": {
			type: "string",
			description: "Parent document ID",
		},
		"add-last": {
			type: "boolean",
			description: "Add to the end of siblings (default: add to beginning)",
		},
	},
	async run({ args }) {
		const project = resolveProjectArg(args.project);
		const { client } = await getClient();

		const projectId = await resolveProjectId(client, project);

		let content = args.body;
		if (content === "-") {
			content = await readStdin();
		}

		const requestBody: DocumentsCreateData["body"] = {
			projectId,
		};

		if (args.title) {
			requestBody.title = args.title;
		}

		if (content) {
			requestBody.content = content;
		}

		if (args.emoji) {
			requestBody.emoji = args.emoji;
		}

		if (args["parent-id"]) {
			requestBody.parentId = args["parent-id"];
		}

		if (args["add-last"]) {
			requestBody.addLast = true;
		}

		const document = await client<BacklogDocument>("/documents", {
			method: "POST",
			body: requestBody,
		});

		consola.success(`Created document ${document.id}: ${document.title}`);
	},
});
