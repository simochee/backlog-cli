import { defineConfig } from "vitest/config";

export default defineConfig({
	test: {
		name: "integration",
		globalSetup: ["./src/setup.ts"],
		testTimeout: 30_000,
		hookTimeout: 60_000,
		retry: 1,
		sequence: {
			concurrent: false,
		},
		pool: "forks",
		poolOptions: {
			forks: {
				singleFork: true,
			},
		},
	},
});
