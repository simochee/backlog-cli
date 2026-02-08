import { createClient } from "@repo/api";
import { resolveSpace } from "@repo/config";
import consola from "consola";

/** The type of the authenticated API client returned by `createClient`. */
export type BacklogClient = ReturnType<typeof createClient>;

/**
 * Resolves the active space and creates an authenticated API client.
 *
 * Authentication is resolved in priority order:
 * 1. Configured space (via --space flag, BACKLOG_SPACE env, or defaultSpace)
 * 2. BACKLOG_API_KEY + BACKLOG_SPACE environment variables (lowest priority fallback)
 *
 * @param hostname - Optional explicit space hostname (--space flag).
 * @returns The authenticated client and host string.
 */
export async function getClient(hostname?: string): Promise<{
	client: BacklogClient;
	host: string;
}> {
	const space = await resolveSpace(hostname);

	if (space) {
		const clientConfig =
			space.auth.method === "api-key"
				? { host: space.host, apiKey: space.auth.apiKey }
				: { host: space.host, accessToken: space.auth.accessToken };

		return {
			client: createClient(clientConfig),
			host: space.host,
		};
	}

	// Fallback: BACKLOG_API_KEY + BACKLOG_SPACE environment variables
	const envApiKey = process.env["BACKLOG_API_KEY"];
	const envHost = hostname ?? process.env["BACKLOG_SPACE"];

	if (envApiKey && envHost) {
		return {
			client: createClient({ host: envHost, apiKey: envApiKey }),
			host: envHost,
		};
	}

	consola.error("No space configured. Run `backlog auth login` to authenticate.");
	return process.exit(1);
}
