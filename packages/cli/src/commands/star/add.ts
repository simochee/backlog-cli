import type { StarsAddData } from "@repo/openapi-client";
import { defineCommand } from "citty";
import consola from "consola";
import { getClient } from "#utils/client.ts";

export default defineCommand({
	meta: {
		name: "add",
		description: "Add a star",
	},
	args: {
		issue: {
			type: "string",
			description: "Issue key to star",
		},
		comment: {
			type: "string",
			description: "Comment ID to star",
		},
		wiki: {
			type: "string",
			description: "Wiki ID to star",
		},
		"pr-comment": {
			type: "string",
			description: "Pull request comment ID to star",
		},
	},
	async run({ args }) {
		const { client } = await getClient();

		const body: StarsAddData["body"] = {};

		if (args.issue) {
			const issue = await client<{ id: number }>(`/issues/${args.issue}`);
			body.issueId = issue.id;
		}
		if (args.comment) {
			const commentId = Number.parseInt(args.comment, 10);
			if (Number.isNaN(commentId)) {
				consola.error(`Invalid comment ID: "${args.comment}"`);
				return process.exit(1);
			}
			body.commentId = commentId;
		}
		if (args.wiki) {
			const wikiId = Number.parseInt(args.wiki, 10);
			if (Number.isNaN(wikiId)) {
				consola.error(`Invalid wiki ID: "${args.wiki}"`);
				return process.exit(1);
			}
			body.wikiId = wikiId;
		}
		if (args["pr-comment"]) {
			const prCommentId = Number.parseInt(args["pr-comment"], 10);
			if (Number.isNaN(prCommentId)) {
				consola.error(
					`Invalid pull request comment ID: "${args["pr-comment"]}"`,
				);
				return process.exit(1);
			}
			body.pullRequestCommentId = prCommentId;
		}

		if (Object.keys(body).length === 0) {
			consola.error(
				"Specify a target: --issue, --comment, --wiki, or --pr-comment",
			);
			return process.exit(1);
		}

		await client("/stars", {
			method: "POST",
			body,
		});

		consola.success("Star added.");
	},
});
