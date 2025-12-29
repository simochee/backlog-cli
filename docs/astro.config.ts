import starlight from "@astrojs/starlight";
import { defineConfig } from "astro/config";

export default defineConfig({
	base: "backlog-cli",
	integrations: [
		starlight({
			title: "Backlog CLI",
			social: [
				{
					icon: "github",
					label: "GitHub",
					href: "https://github.com/simochee/backlog-cli",
				},
			],
		}),
	],
});
