import type { BacklogDocumentDetail } from "@repo/api";
import type { DocumentsListData } from "@repo/openapi-client";

import { getClient } from "#utils/client.ts";
import { formatDate, padEnd } from "#utils/format.ts";
import { outputArgs, outputResult } from "#utils/output.ts";
import { resolveProjectArg, resolveProjectId } from "#utils/resolve.ts";
import { defineCommand } from "citty";
import consola from "consola";

export default defineCommand({
	meta: {
		name: "list",
		description: "List documents",
	},
	args: {
		...outputArgs,
		project: {
			type: "string",
			alias: "p",
			description: "Project key (env: BACKLOG_PROJECT)",
		},
		keyword: {
			type: "string",
			alias: "k",
			description: "Keyword search",
		},
		sort: {
			type: "string",
			description: "Sort key: created or updated",
			default: "updated",
		},
		order: {
			type: "string",
			description: "Sort order: asc or desc",
			default: "desc",
		},
		offset: {
			type: "string",
			description: "Offset for pagination",
		},
		limit: {
			type: "string",
			alias: "L",
			description: "Number of results",
			default: "20",
		},
	},
	async run({ args }) {
		const project = resolveProjectArg(args.project);
		const { client } = await getClient();

		const projectId = await resolveProjectId(client, project);

		const query: NonNullable<DocumentsListData["query"]> & Record<string, unknown> = {
			"projectId[]": [projectId],
			sort: args.sort as "created" | "updated",
			order: args.order as "asc" | "desc",
			count: Number.parseInt(args.limit, 10),
		};

		if (args.keyword) {
			query.keyword = args.keyword;
		}
		if (args.offset) {
			query.offset = Number.parseInt(args.offset, 10);
		}

		const documents = await client<BacklogDocumentDetail[]>("/documents", { query });

		outputResult(documents, args, (data) => {
			if (data.length === 0) {
				consola.info("No documents found.");
				return;
			}

			const header = `${padEnd("ID", 36)}${padEnd("TITLE", 40)}${padEnd("UPDATED", 12)}CREATED BY`;
			consola.log(header);
			for (const doc of data) {
				const id = padEnd(doc.id, 36);
				const title = padEnd(doc.title, 40);
				const updated = padEnd(formatDate(doc.updated), 12);
				const createdBy = doc.createdUser.name;
				consola.log(`${id}${title}${updated}${createdBy}`);
			}
		});
	},
});
