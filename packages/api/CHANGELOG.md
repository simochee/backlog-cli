# Changelog

## [0.2.0](https://github.com/simochee/backlog-cli/compare/backlog-api-v0.1.0...backlog-api-v0.2.0) (2026-02-19)


### Features

* add type-check script to each package ([d81ab71](https://github.com/simochee/backlog-cli/commit/d81ab71d4160bf81e62cfd05d37d85a94b3e640b))
* add TypeScript configuration and Astro setup; update package names and add deployment workflow for documentation ([92ed063](https://github.com/simochee/backlog-cli/commit/92ed063ffedbfe6a405ff542faca26f2b1846454))
* add unit tests and CI pipeline ([d09ac94](https://github.com/simochee/backlog-cli/commit/d09ac94d3a73f87ce2b85d4c4062bc264ca1ed3e))
* add Vitest unit testing infrastructure and documentation ([7bc7d76](https://github.com/simochee/backlog-cli/commit/7bc7d76728c4aa474a91702a76de7eb02abe48a6))
* **api:** display quota limit reset time on 429 rate limit response ([1897bc6](https://github.com/simochee/backlog-cli/commit/1897bc6e7fcd21e552824954d54f77c211082857))
* **auth:** implement OAuth 2.0 login and token refresh ([99977f0](https://github.com/simochee/backlog-cli/commit/99977f0638d120e1e45c7f3fb01b4c10ed9fc686))
* **auth:** implement OAuth 2.0 login and token refresh ([790e622](https://github.com/simochee/backlog-cli/commit/790e622e44256e8901a0b36c483c4a09ddb27de4))
* **document:** add document management commands ([#119](https://github.com/simochee/backlog-cli/issues/119)) ([a2c6257](https://github.com/simochee/backlog-cli/commit/a2c6257b1086e4712ee6e48cc917c7c4eccf67d3))
* enable noPropertyAccessFromIndexSignature and add env.d.ts ([344e49d](https://github.com/simochee/backlog-cli/commit/344e49dcea5a08dd5a90ddc7bdf78e4d98879178))
* implement Phase 1 commands (issue, project, api) ([422c47c](https://github.com/simochee/backlog-cli/commit/422c47cd7aeb16a969c9ea7536f35cf4d628ae0c))
* implement Phase 2 commands (pr, repo, notification, status, browse) ([af6068d](https://github.com/simochee/backlog-cli/commit/af6068d52e5bcc3daa596b6ce34e1a3084985108))
* implement Phase 2 commands (pr, repo, notification, status, browse) ([0390fb7](https://github.com/simochee/backlog-cli/commit/0390fb759a6dcc71556576b5492769da3121e031))
* implement Phase 3 commands (wiki, user, team, category, milestone, issue-type, status-type) ([85b267e](https://github.com/simochee/backlog-cli/commit/85b267e1bf3af92c5c509f74fdb4b0b744729588))
* implement Phase 3 commands (wiki, user, team, category, milestone, issue-type, status-type) ([f9ff116](https://github.com/simochee/backlog-cli/commit/f9ff11623b32d9fb2a1e2268b745f06cedf26292))
* implement Phase 4 commands (space, webhook, star, watching, alias, auth extensions, completion) ([34c8513](https://github.com/simochee/backlog-cli/commit/34c851347455429e0f58bcc902132b4448c690f3))
* implement Phase 4 commands (space, webhook, star, watching, alias, auth extensions, completion) ([66eb545](https://github.com/simochee/backlog-cli/commit/66eb5454828c9c53b417902432f5bcf3274f8b05))
* OAuth トークンの自動リフレッシュ機能を実装 ([#90](https://github.com/simochee/backlog-cli/issues/90)) ([c66f597](https://github.com/simochee/backlog-cli/commit/c66f59792a672fff78bc4424dd450acc03c04dad))
* reorganize project structure by renaming and consolidating package and source files ([7380a2d](https://github.com/simochee/backlog-cli/commit/7380a2d905e09adf5ee19012e66f54556b7a315e))
* replace Record&lt;string, unknown&gt; with typed SDK types and add tests ([b95cecf](https://github.com/simochee/backlog-cli/commit/b95cecfb07014bbbd25b461e9b96940088b44415))
* replace Record&lt;string, unknown&gt; with typed SDK types and add tests ([7d0aac7](https://github.com/simochee/backlog-cli/commit/7d0aac7fab41442482ab30ae39dee59ca79724c8))
* restructure monorepo with Turborepo pipeline and unjs stack ([765ec97](https://github.com/simochee/backlog-cli/commit/765ec974da6943da7b79ec9436b4ea4bbf7db57a))
* scaffold CLI command structure and API client ([f48b519](https://github.com/simochee/backlog-cli/commit/f48b5190d4cc25c250ea52e513f07aeff7065d65))


### Bug Fixes

* address type safety, error handling, and validation issues from audit ([f398bbf](https://github.com/simochee/backlog-cli/commit/f398bbfffd3129b2f7e0c7474ccaea699ec04347))
* address type safety, error handling, and validation issues from audit ([7619cc5](https://github.com/simochee/backlog-cli/commit/7619cc5e9bafd70d139f8f6b894d81a3ccfcee85))
