import { regex } from "arkregex";
import { type } from "arktype";

const ApiKeyAuth = type({
	method: "'api-key'",
	apiKey: "string",
});

const OAuthAuth = type({
	method: "'oauth'",
	accessToken: "string",
	refreshToken: "string",
});

export const RcAuth = ApiKeyAuth.or(OAuthAuth);

export const RcSpace = type({
	host: regex(String.raw`^[a-z0-9-]+\.backlog\.(com|jp)$`),
	auth: RcAuth,
});

export const Rc = type({
	defaultSpace: type("string").optional(),
	spaces: type
		.scope({ RcSpace })
		.type("RcSpace[]")
		.default(() => []),
	aliases: type("Record<string, string>").default(() => ({})),
});
