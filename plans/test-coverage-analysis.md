# Test Coverage Analysis

## Current State

**All tests passing:** 476 tests across 112 test files (3 packages).

### Package-level Coverage

| Package | Stmts | Branch | Funcs | Lines |
| --- | --- | --- | --- | --- |
| `@repo/api` | 100% | 100% | 100% | 100% |
| `@repo/config` | 100% | 100% | 100% | 100% |
| `@simochee/backlog-cli` | 89.69% | 77.67% | 91.66% | 90.44% |

The `api` and `config` packages have full coverage. The CLI package is the only area needing improvement, with an overall **77.67% branch coverage** — meaning roughly 1 in 4 code branches is untested.

---

## High Priority: Files Below 50% Statement Coverage

### 1. `src/commands/api.ts` — 19.67% stmts / 25% branch

The `backlog api` command has the lowest coverage in the codebase. Only the `parseField` helper is tested; the entire `run` function (lines 69–154) is uncovered.

**Untested logic:**
- Endpoint normalization (stripping `/api/v2` prefix, ensuring leading `/`)
- Field parsing from CSV-format `-f` flags into key-value pairs
- Header parsing from `-H` flags
- HTTP method normalization (lowercase → uppercase)
- Query vs body parameter placement based on HTTP method (GET/HEAD → query, others → body)
- Pagination loop for array responses (accumulating pages until count < 100)
- `--silent` flag suppressing output

**Recommended tests:**
- Endpoint normalization: `/api/v2/users` → `/users`, `users` → `/users`
- Field accumulation from multiple `-f` flags with CSV expansion
- Header accumulation from multiple `-H` flags
- GET requests place fields in `query`, POST requests place fields in `body`
- Pagination: mock consecutive API responses, verify accumulation stops when `result.length < 100`
- Silent mode suppresses `consola.log`

### 2. `src/utils/client.ts` — 34.61% stmts / 35.48% branch / 16.66% funcs

The `getClient` utility has basic auth setup tested, but all error-handling and resilience logic is uncovered.

**Untested logic (lines 56–128):**
- OAuth credential validation (missing `clientId`, `clientSecret`, or `refreshToken`)
- Automatic token refresh on 401 responses
- Concurrent token refresh deduplication (single `refreshPromise` shared across requests)
- Token persistence after refresh (`updateSpaceAuth` call)
- Rate limit handling (429 with `X-RateLimit-Reset` header)
- `process.exit(1)` on refresh failure

**Recommended tests:**
- Mock 401 → verify `refreshAccessToken` is called → verify retry with new token
- Mock concurrent 401s → verify only one refresh happens (shared promise)
- Mock 429 with `X-RateLimit-Reset` header → verify error message includes reset time
- Mock refresh failure → verify `process.exit(1)` is called
- Missing OAuth fields → verify error message with re-auth instruction

### 3. `src/commands/auth/switch.ts` — 43.47% stmts / 28.57% branch

**Untested logic (lines 24–42):**
- Zero-spaces error path (`config.spaces.length === 0`)
- Interactive space selection via `consola.prompt`
- No-input mode with missing hostname → error exit

**Recommended tests:**
- No spaces configured → error exit with "Run `bl auth login`" message
- Multiple spaces without `--space` flag → prompt displayed with space list
- `--no-input` mode without `--space` → error exit

---

## Medium Priority: Files Between 50–80% Statement Coverage

### 4. `src/commands/auth/logout.ts` — 63.63% stmts / 56.25% branch

**Untested logic (lines 31–42):**
- Multi-space interactive selection (prompt with space list)
- No-input mode error path when multiple spaces exist

**Recommended tests:**
- Multiple spaces + no `--space` → interactive prompt
- `--no-input` + multiple spaces + no `--space` → error exit

### 5. `src/commands/issue/edit.ts` — 71.42% stmts / 68.75% branch

**Untested logic (lines 79–105):**
- Individual optional field resolution paths: `--status`, `--type`, `--priority`, `--assignee`
- Parallel field resolution via `Promise.all`
- `--description` and `--comment` body fields

**Recommended tests:**
- Update with `--status` → `resolveStatusId` called, `statusId` in PATCH body
- Update with `--type` → `resolveIssueTypeId` called
- Update with `--priority` → `resolvePriorityId` called
- Update with `--assignee @me` → `resolveUserId` called
- Update with `--description` and `--comment` → both included in body
- Update with all fields simultaneously

### 6. `src/commands/issue/list.ts` — 75% stmts / 65.38% branch

**Untested logic (lines 103–127):**
- `--offset` parameter parsing
- `--keyword` search parameter
- Filter resolution for `--status`, `--type`, `--priority`
- Date range filters (`--created-since`, `--updated-since`, `--due-since`, etc.)

**Recommended tests:**
- `--keyword "search term"` included in query params
- `--offset 20` parsed and included in query
- `--status` with comma-separated values resolved to statusId array
- Date range filters passed through to query
- `--sort` and `--order` parameters

### 7. `src/commands/pr/list.ts` — 75% stmts / 60.86% branch

**Untested logic (lines 86–108):**
- Status value validation and error on invalid status
- `--created-by` filter → userId resolution
- `--issue` filter → issue lookup and ID extraction
- Offset parameter handling

**Recommended tests:**
- Invalid `--status` value → error with available options
- `--created-by username` → `resolveUserId` called, `createdUserId[]` in query
- `--issue PROJECT-123` → issue fetched, `issueId[]` in query
- Comma-separated `--status open,closed` → multiple statusId values

### 8. `src/commands/issue/view.ts` — 79.24% stmts / 57.69% branch

**Untested logic (lines 52–74):**
- Optional field display: `startDate`, `dueDate`, `estimatedHours`, `actualHours`
- Array field display: `category`, `milestone`, `versions` (when non-empty)
- Comment filtering (skip comments with no content)

**Recommended tests:**
- Issue with `startDate` and `dueDate` → date lines displayed
- Issue with `estimatedHours` and `actualHours` → hours lines displayed
- Issue with categories/milestones/versions → joined and displayed
- Issue with all fields null → none of the optional lines appear
- Comments with empty `content` field are skipped

---

## Low Priority: Files Between 80–95% With Notable Gaps

| File | Stmts | Untested Logic |
| --- | --- | --- |
| `commands/pr/comment.ts` | 77.77% | Stdin reading path (`--body -`) |
| `commands/issue/comment.ts` | 75% | Stdin reading path (`--body -`) |
| `commands/pr/edit.ts` | 78.57% | Optional field updates (description, assignee) |
| `commands/pr/create.ts` | 82.35% | Optional fields (description, reviewer, label) |
| `commands/repo/clone.ts` | 80% | SSH URL construction, `git clone` subprocess |
| `commands/milestone/edit.ts` | 80% | Optional date fields (startDate, releaseDueDate) |
| `commands/webhook/edit.ts` | 75% | Optional field updates (description, hookUrl, events) |

---

## Structural Observations

### 1. Command tests are shallow

Most command test files have 1–3 tests that verify the "happy path" — a successful API call with minimal arguments. They typically mock `getClient` and assert the correct endpoint was called. What's missing:

- **Error paths:** What happens when the API returns 404, 403, or validation errors?
- **Optional argument combinations:** Most commands have 5–10 optional flags, but tests only cover 0–2 of them.
- **Stdin reading:** Commands with `--body -` support (issue comment, pr comment) don't test the stdin path.
- **Interactive prompt paths:** Commands that fall back to `consola.prompt` when arguments are missing are not testing that branch.

### 2. Branch coverage lags significantly behind statement coverage

The CLI package is at 89.69% statement coverage but only 77.67% branch coverage. This means most `if` conditions are only tested in one direction (usually the truthy/happy path). Systematically adding tests for `else`/falsy branches would close this gap.

### 3. No tests for error message formatting

When name resolution fails (e.g., invalid status name), the error includes a list of available options. None of these error-message formatting paths are tested.

### 4. Commands with 1 test each (10 files)

These commands have only a single happy-path test:

- `category/create.ts`, `category/edit.ts`
- `issue-type/create.ts`
- `notification/read.ts`, `notification/read-all.ts`
- `pr/reopen.ts`
- `project/remove-user.ts`
- `repo/clone.ts`
- `status/create.ts`
- `watching/read.ts`

At minimum, each should also test the `--json` output path and any error/validation paths.

---

## Recommended Action Plan

1. **First:** Cover `utils/client.ts` token refresh & rate limit logic — this is shared infrastructure that every command depends on, and it has the most complex untested error-handling logic.
2. **Second:** Cover `commands/api.ts` — it's a user-facing command with nearly zero functional test coverage.
3. **Third:** Add optional-field tests to the `issue` and `pr` command groups — these are the most commonly used commands and have the most conditional display logic.
4. **Fourth:** Systematically add `--json` output and error-path tests to the 10 single-test commands.
