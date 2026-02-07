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

		const body: Record<string, unknown> = {};

		if (args.issue) {
			body.issueId = args.issue;
		}
		if (args.comment) {
			body.commentId = Number.parseInt(args.comment, 10);
		}
		if (args.wiki) {
			body.wikiId = Number.parseInt(args.wiki, 10);
		}
		if (args["pr-comment"]) {
			body.pullRequestCommentId = Number.parseInt(args["pr-comment"], 10);
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
