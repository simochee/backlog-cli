import { regex } from "arkregex";
import { type } from "arktype";

export const RcSpace = type({
	host: regex("^[a-z0-9-]+\\.backlog\\.(com|jp)$"),
	auth: {
		accessToken: "string",
		refreshToken: "string",
	},
});

export const Rc = type({
	spaces: type
		.scope({ RcSpace })
		.type("RcSpace[]")
		.default(() => []),
});
