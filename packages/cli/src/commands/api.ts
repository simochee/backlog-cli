import { getClient } from "#utils/client.ts";
import { defineCommand } from "citty";

/**
 * Parses a `key=value` field string. Values are auto-converted:
 * - `"true"` / `"false"` become booleans
 * - Numeric strings become numbers
 * - Everything else stays as a string
 */
export function parseField(field: string): [string, unknown] {
	const eqIndex = field.indexOf("=");
	if (eqIndex === -1) {
		return [field, true];
	}

	const key = field.slice(0, eqIndex);
	const raw = field.slice(eqIndex + 1);

	if (raw === "true") return [key, true];
	if (raw === "false") return [key, false];
	if (raw !== "" && !Number.isNaN(Number(raw))) return [key, Number(raw)];

	return [key, raw];
}

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
	async run({ args }) {
		const { client } = await getClient();

		// Normalize endpoint — strip /api/v2 prefix if provided
		let endpoint = args.endpoint;
		if (endpoint.startsWith("/api/v2")) {
			endpoint = endpoint.slice("/api/v2".length);
		}
		if (!endpoint.startsWith("/")) {
			endpoint = `/${endpoint}`;
		}

		const method = args.method.toUpperCase();

		// Parse fields
		const fields: Record<string, unknown> = {};
		if (args.field) {
			const fieldStrs = args.field.split(",").map((f) => f.trim());
			for (const fieldStr of fieldStrs) {
				const [key, value] = parseField(fieldStr);
				fields[key] = value;
			}
		}

		// Parse headers
		const headers: Record<string, string> = {};
		if (args.header) {
			const headerStrs = args.header.split(",").map((h) => h.trim());
			for (const headerStr of headerStrs) {
				const colonIndex = headerStr.indexOf(":");
				if (colonIndex !== -1) {
					const key = headerStr.slice(0, colonIndex).trim();
					const value = headerStr.slice(colonIndex + 1).trim();
					headers[key] = value;
				}
			}
		}

		const isReadMethod = method === "GET" || method === "HEAD";
		const fetchOptions: Record<string, unknown> = {
			method,
			headers: Object.keys(headers).length > 0 ? headers : undefined,
		};

		if (Object.keys(fields).length > 0) {
			if (isReadMethod) {
				fetchOptions["query"] = fields;
			} else {
				fetchOptions["body"] = fields;
			}
		}

		if (args.paginate && isReadMethod) {
			// Paginate through all results
			const allResults: unknown[] = [];
			let offset = 0;
			const count = 100;

			while (true) {
				const query = {
					...(fetchOptions["query"] as Record<string, unknown> | undefined),
					count,
					offset,
				};
				const result = await client<unknown>(endpoint, {
					...fetchOptions,
					query,
				});

				if (Array.isArray(result)) {
					allResults.push(...result);
					if (result.length < count) break;
					offset += count;
				} else {
					allResults.push(result);
					break;
				}
			}

			if (!args.silent) {
				const json = process.stdout.isTTY ? JSON.stringify(allResults, null, 2) : JSON.stringify(allResults);
				process.stdout.write(`${json}\n`);
			}
		} else {
			const result = await client<unknown>(endpoint, fetchOptions);

			if (!args.silent) {
				const json = process.stdout.isTTY ? JSON.stringify(result, null, 2) : JSON.stringify(result);
				process.stdout.write(`${json}\n`);
			}
		}
	},
});
