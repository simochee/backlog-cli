import { createClient } from "@repo/api";
import { resolveSpace } from "@repo/config";
import consola from "consola";

/** The type of the authenticated API client returned by `createClient`. */
export type BacklogClient = ReturnType<typeof createClient>;

/**
 * Resolves the active space and creates an authenticated API client.
 *
 * @param hostname - Optional explicit space hostname (--space flag).
 * @returns The authenticated client and host string.
 */
export async function getClient(hostname?: string): Promise<{
	client: BacklogClient;
	host: string;
}> {
	const space = await resolveSpace(hostname);

	if (!space) {
		consola.error(
			"No space configured. Run `backlog auth login` to authenticate.",
		);
		return process.exit(1);
	}

	const clientConfig =
		space.auth.method === "api-key"
			? { host: space.host, apiKey: space.auth.apiKey }
			: { host: space.host, accessToken: space.auth.accessToken };

	return {
		client: createClient(clientConfig),
		host: space.host,
	};
}
