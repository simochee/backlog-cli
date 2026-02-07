import { defineConfig } from "@hey-api/openapi-ts";

export default defineConfig({
	input: "../backlog-api-typespec/tsp-output/@typespec/openapi3/openapi.yaml",
	output: "src/generated",
	plugins: ["@hey-api/client-fetch", "@hey-api/sdk", "@hey-api/typescript"],
});
