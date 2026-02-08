import { type $Fetch, ofetch } from "ofetch";
import { joinURL } from "ufo";

export interface BacklogClientConfig {
	/** Backlog space hostname (e.g., "example.backlog.com") */
	host: string;
	/** API Key for authentication. Mutually exclusive with accessToken. */
	apiKey?: string;
	/** OAuth access token. Mutually exclusive with apiKey. */
	accessToken?: string;
}

/**
 * Creates a pre-configured HTTP client for the Backlog API v2.
 *
 * Supports both API Key (query parameter) and OAuth 2.0 (Bearer token) authentication.
 */
export function createClient(config: BacklogClientConfig): $Fetch {
	return ofetch.create({
		baseURL: joinURL(`https://${config.host}`, "/api/v2"),
		headers: config.accessToken ? { Authorization: `Bearer ${config.accessToken}` } : {},
		query: config.apiKey ? { apiKey: config.apiKey } : {},
	});
}
