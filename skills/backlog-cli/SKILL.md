---
name: backlog-cli
description: |
  CLI for Backlog project management (by Nulab). Use this skill when:
  (1) Listing, creating, editing, closing, or commenting on issues
  (2) Creating, listing, merging, or commenting on pull requests
  (3) Viewing, creating, or editing Wiki pages
  (4) Querying project settings (issue types, statuses, categories, milestones, members)
  (5) Checking notifications, stars, or watches
  (6) Making raw API requests via `backlog api`
---

# backlog-cli

CLI tool for managing Backlog projects via the `backlog` command.

## Authentication

Run `backlog auth login` before use. Verify with `backlog auth status`.
Switch between spaces with `--space <hostname>` or `BACKLOG_SPACE` env var.

## Key Concepts

### Avoid Interactive Prompts

Some commands prompt interactively for missing required fields. **Always specify all required flags explicitly** to prevent hanging.

### Name Resolution

The CLI automatically resolves human-readable names to IDs:

- Status names → status ID
- Issue type names → issue type ID
- Priority names (`高`/`中`/`低`) → priority ID
- Usernames → user ID (`@me` refers to the authenticated user)

**Status and issue type names are project-specific.** Query them first if unknown:

```bash
backlog issue-type list -p PROJECT_KEY
backlog status-type list -p PROJECT_KEY
```

### Issue Keys

Format: `PROJECT_KEY-number` (e.g., `PROJ-123`). Since the key embeds the project, `--project` is not needed for `issue view` / `issue edit`.

### Project Key

Specify with `--project` (`-p`) flag or `BACKLOG_PROJECT` env var.

## Common Workflows

### Issues

```bash
# List my open issues
backlog issue list -p PROJ -a @me -S "未対応,処理中"

# View details with comments
backlog issue view PROJ-123 --comments

# Create (required: -p, -t, -T, -P)
backlog issue create -p PROJ -t "Title" -T "タスク" -P "中" -a @me -d "Description"

# Update status with comment
backlog issue edit PROJ-123 -S "処理中" -c "Starting work"

# Close
backlog issue close PROJ-123 -c "Done"

# Add comment
backlog issue comment PROJ-123 -b "Progress update"
```

### Pull Requests

```bash
# Create (required: -p, -R, -t, -B, --branch)
backlog pr create -p PROJ -R repo -t "PR title" -B main --branch feat/xxx --issue PROJ-123

# List open PRs
backlog pr list -p PROJ -R repo

# View with comments
backlog pr view -p PROJ -R repo 42 --comments

# Merge
backlog pr merge -p PROJ -R repo 42
```

### Project Info

```bash
backlog project list                  # List projects
backlog project users PROJECT_KEY     # List members
backlog category list -p PROJ         # List categories
backlog milestone list -p PROJ        # List milestones
```

### Wiki

```bash
backlog wiki list -p PROJ
backlog wiki view <wiki-id>
backlog wiki create -p PROJ -n "Page title" -b "Content"
backlog wiki edit <wiki-id> -b "Updated content"
```

### Raw API

For operations not covered by CLI commands. The `/api/v2` prefix can be omitted.

```bash
backlog api /issues -X POST -f "projectId=123" -f "summary=New issue"
backlog api /issues --paginate -f "projectId[]=123"
```

## References

- **Full command options**: [references/commands.md](./references/commands.md)
- **Data model schemas**: [references/schema.md](./references/schema.md)
