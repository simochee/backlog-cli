# Changelog

## [0.2.0](https://github.com/simochee/backlog-cli/compare/backlog-cli-v0.1.0...backlog-cli-v0.2.0) (2026-02-19)


### Miscellaneous Chores

* **backlog-cli:** Synchronize backlog-cli versions

## [0.1.0](https://github.com/simochee/backlog-cli/compare/v0.0.1...v0.1.0) (2026-02-12)


### Features

* add openapi-client package generated from TypeSpec via hey-api ([b90eb2f](https://github.com/simochee/backlog-cli/commit/b90eb2f3ee763520ff9a0894cfb74aba66dd38a4))
* add type-check script to each package ([d81ab71](https://github.com/simochee/backlog-cli/commit/d81ab71d4160bf81e62cfd05d37d85a94b3e640b))
* add TypeScript configuration and Astro setup; update package names and add deployment workflow for documentation ([92ed063](https://github.com/simochee/backlog-cli/commit/92ed063ffedbfe6a405ff542faca26f2b1846454))
* add unit tests and CI pipeline ([d09ac94](https://github.com/simochee/backlog-cli/commit/d09ac94d3a73f87ce2b85d4c4062bc264ca1ed3e))
* add Vitest unit testing infrastructure and documentation ([7bc7d76](https://github.com/simochee/backlog-cli/commit/7bc7d76728c4aa474a91702a76de7eb02abe48a6))
* **auth:** implement OAuth 2.0 login and token refresh ([99977f0](https://github.com/simochee/backlog-cli/commit/99977f0638d120e1e45c7f3fb01b4c10ed9fc686))
* **auth:** implement OAuth 2.0 login and token refresh ([790e622](https://github.com/simochee/backlog-cli/commit/790e622e44256e8901a0b36c483c4a09ddb27de4))
* **auth:** support BACKLOG_API_KEY environment variable ([eb93381](https://github.com/simochee/backlog-cli/commit/eb933818eff4f891b7e237f6aed9f71e327ac9c3))
* **auth:** support BACKLOG_API_KEY environment variable for authentication ([94320b4](https://github.com/simochee/backlog-cli/commit/94320b4b837a4046ef3bfbeae805d189fb1663d3))
* BACKLOG_PROJECT 環境変数によるプロジェクトキーのデフォルト指定をサポート ([32354e9](https://github.com/simochee/backlog-cli/commit/32354e9d6eb557c4d3f5f8c368a4b99ef5762f01))
* BACKLOG_PROJECT 環境変数によるプロジェクトキーのデフォルト指定をサポート ([7d68e5e](https://github.com/simochee/backlog-cli/commit/7d68e5e58bab72661b35806ed2991e10681f951f))
* **cli:** add --json output flag for structured output ([b9e2b13](https://github.com/simochee/backlog-cli/commit/b9e2b13c64d29e57a3fb280406f0c2cbd5ebe851))
* **cli:** add --json output flag for structured output across 38 commands ([a8fc7ec](https://github.com/simochee/backlog-cli/commit/a8fc7ecd27cc3ef816453e41827fc0bcc29327ed))
* **cli:** display version in help output ([898c598](https://github.com/simochee/backlog-cli/commit/898c5985a4ff285ed275d271fdb82fcb88df00ad))
* **document:** add document management commands ([#119](https://github.com/simochee/backlog-cli/issues/119)) ([a2c6257](https://github.com/simochee/backlog-cli/commit/a2c6257b1086e4712ee6e48cc917c7c4eccf67d3))
* enable noPropertyAccessFromIndexSignature and add env.d.ts ([344e49d](https://github.com/simochee/backlog-cli/commit/344e49dcea5a08dd5a90ddc7bdf78e4d98879178))
* implement backlog auth commands (login, logout, status, token) ([ec33932](https://github.com/simochee/backlog-cli/commit/ec339325d26f561baefc9c1dfe2bb457a667f3b6))
* implement backlog config commands (get, set, list) ([bb22cc5](https://github.com/simochee/backlog-cli/commit/bb22cc5406b51a1deab838a26424a05e2fabf878))
* implement Phase 1 commands (issue, project, api) ([422c47c](https://github.com/simochee/backlog-cli/commit/422c47cd7aeb16a969c9ea7536f35cf4d628ae0c))
* implement Phase 2 commands (pr, repo, notification, status, browse) ([af6068d](https://github.com/simochee/backlog-cli/commit/af6068d52e5bcc3daa596b6ce34e1a3084985108))
* implement Phase 2 commands (pr, repo, notification, status, browse) ([0390fb7](https://github.com/simochee/backlog-cli/commit/0390fb759a6dcc71556576b5492769da3121e031))
* implement Phase 3 commands (wiki, user, team, category, milestone, issue-type, status-type) ([85b267e](https://github.com/simochee/backlog-cli/commit/85b267e1bf3af92c5c509f74fdb4b0b744729588))
* implement Phase 3 commands (wiki, user, team, category, milestone, issue-type, status-type) ([f9ff116](https://github.com/simochee/backlog-cli/commit/f9ff11623b32d9fb2a1e2268b745f06cedf26292))
* implement Phase 4 commands (space, webhook, star, watching, alias, auth extensions, completion) ([34c8513](https://github.com/simochee/backlog-cli/commit/34c851347455429e0f58bcc902132b4448c690f3))
* implement Phase 4 commands (space, webhook, star, watching, alias, auth extensions, completion) ([66eb545](https://github.com/simochee/backlog-cli/commit/66eb5454828c9c53b417902432f5bcf3274f8b05))
* **issue:** add --json output support to issue status command ([#103](https://github.com/simochee/backlog-cli/issues/103)) ([2d9b360](https://github.com/simochee/backlog-cli/commit/2d9b360b9984bc0a6ee2f6e120b81e6645155103))
* **issue:** add `issue delete` command ([#57](https://github.com/simochee/backlog-cli/issues/57)) ([265a77b](https://github.com/simochee/backlog-cli/commit/265a77b0d3d9c539d4a7ed832202f0d69884b348))
* OAuth トークンの自動リフレッシュ機能を実装 ([#90](https://github.com/simochee/backlog-cli/issues/90)) ([c66f597](https://github.com/simochee/backlog-cli/commit/c66f59792a672fff78bc4424dd450acc03c04dad))
* reorganize project structure by renaming and consolidating package and source files ([7380a2d](https://github.com/simochee/backlog-cli/commit/7380a2d905e09adf5ee19012e66f54556b7a315e))
* replace Record&lt;string, unknown&gt; with typed SDK types and add tests ([b95cecf](https://github.com/simochee/backlog-cli/commit/b95cecfb07014bbbd25b461e9b96940088b44415))
* replace Record&lt;string, unknown&gt; with typed SDK types and add tests ([7d0aac7](https://github.com/simochee/backlog-cli/commit/7d0aac7fab41442482ab30ae39dee59ca79724c8))
* restructure monorepo with Turborepo pipeline and unjs stack ([765ec97](https://github.com/simochee/backlog-cli/commit/765ec974da6943da7b79ec9436b4ea4bbf7db57a))
* scaffold CLI command structure and API client ([f48b519](https://github.com/simochee/backlog-cli/commit/f48b5190d4cc25c250ea52e513f07aeff7065d65))


### Bug Fixes

* address type safety, error handling, and validation issues from audit ([f398bbf](https://github.com/simochee/backlog-cli/commit/f398bbfffd3129b2f7e0c7474ccaea699ec04347))
* address type safety, error handling, and validation issues from audit ([7619cc5](https://github.com/simochee/backlog-cli/commit/7619cc5e9bafd70d139f8f6b894d81a3ccfcee85))
* **auth:** implement --space global option and improve space resolution ([fdeaf66](https://github.com/simochee/backlog-cli/commit/fdeaf664b35e32c4b572e30fc1cecbc2ab434bef))
* **cli:** implement --space global option ([3297b89](https://github.com/simochee/backlog-cli/commit/3297b89372401513ccc54ef909bb874262e54b57))
* **cli:** replace Bun-specific APIs with Node.js standard library ([4ad112d](https://github.com/simochee/backlog-cli/commit/4ad112dcd17688c2e557fac3b22b0fd14a210aca))
* **cli:** replace Bun-specific APIs with Node.js standard library ([adac7f6](https://github.com/simochee/backlog-cli/commit/adac7f686b3b10a5a79517fab85ecba723b445df))
* **cli:** use cross-platform open package for --web browser opening ([#91](https://github.com/simochee/backlog-cli/issues/91)) ([e0d4d92](https://github.com/simochee/backlog-cli/commit/e0d4d924645d267a376af3a6760622a737f5d90f))
* **integration-tests:** fix multiple test failures unrelated to create timeouts ([#121](https://github.com/simochee/backlog-cli/issues/121)) ([2deb42e](https://github.com/simochee/backlog-cli/commit/2deb42ea3105c3c45befec829e6a6ce50c0cb116))
* remove unused args destructuring from command stubs ([9e16848](https://github.com/simochee/backlog-cli/commit/9e16848d43105b0af62c5cd64ce55756e6379dae))
* resolve all oxlint warnings across the codebase ([5cf6024](https://github.com/simochee/backlog-cli/commit/5cf6024975dedcb3d78806f4dcd0fa4111c10423))
* resolve integration test failures across multiple commands ([#122](https://github.com/simochee/backlog-cli/issues/122)) ([907fdab](https://github.com/simochee/backlog-cli/commit/907fdabde4c2e6dd6459080cd8d3ac5177b6b36a))
* resolve type errors across packages for type-check compliance ([c911020](https://github.com/simochee/backlog-cli/commit/c9110204f665c8e9fa9c2729cf82ef8ca8e990cb))


### Performance Improvements

* **cli:** optimize bundle size with minify and native fetch ([0a2dc0b](https://github.com/simochee/backlog-cli/commit/0a2dc0b7bf5c3be44c4c2d66dc70221d153a1ca5))
* **cli:** optimize bundle size with minify and native fetch ([c796355](https://github.com/simochee/backlog-cli/commit/c7963559831c19de8ffdeb2e7299514013204d7a))
