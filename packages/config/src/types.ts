import { type } from "arktype";

const ApiKeyAuth = type({
	method: "'api-key'",
	apiKey: "string",
});

const OAuthAuth = type({
	method: "'oauth'",
	accessToken: "string",
	refreshToken: "string",
	clientId: type("string").optional(),
	clientSecret: type("string").optional(),
});

export const RcAuth = ApiKeyAuth.or(OAuthAuth);

export const RcSpace = type({
	host: /^[a-z0-9-]+\.backlog\.(com|jp)$/,
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
