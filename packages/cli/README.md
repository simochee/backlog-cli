<div align="center">

# @simochee/backlog-cli

[![npm version](https://img.shields.io/npm/v/@simochee/backlog-cli)](https://www.npmjs.com/package/@simochee/backlog-cli)
[![npm downloads](https://img.shields.io/npm/dm/@simochee/backlog-cli)](https://www.npmjs.com/package/@simochee/backlog-cli)
[![CI](https://github.com/simochee/backlog-cli/actions/workflows/ci.yaml/badge.svg)](https://github.com/simochee/backlog-cli/actions/workflows/ci.yaml)
[![License: MIT](https://img.shields.io/github/license/simochee/backlog-cli)](https://github.com/simochee/backlog-cli/blob/main/LICENSE)

**Backlog on the command line.**

A CLI tool to manage [Backlog](https://backlog.com/) from the terminal — inspired by [GitHub CLI (gh)](https://cli.github.com/).
<br>
Issues, pull requests, wikis, notifications — all from your command line.

[Documentation](https://simochee.github.io/backlog-cli) · [npm](https://www.npmjs.com/package/@simochee/backlog-cli) · [GitHub](https://github.com/simochee/backlog-cli)

</div>

---

```bash
$ backlog issue list --project MYAPP --assignee @me
ID          Type    Priority  Summary
MYAPP-142   Task    High      Investigate API response caching strategy
MYAPP-138   Bug     Medium    Error message not shown on login screen
MYAPP-135   Task    Low       Update dependencies

$ backlog issue view MYAPP-142
MYAPP-142: Investigate API response caching strategy
Status: In Progress  Priority: High  Assignee: @simochee

$ backlog browse MYAPP-142
# => Opens the issue in your browser
```

## Highlights

- **99 commands** — Full coverage of the Backlog API: issues, PRs, wikis, notifications, webhooks, and more
- **Flexible output** — Table (default), `--json`, `--jq`, and `--template` for easy pipeline integration
- **Interactive & non-interactive** — Omit arguments for interactive prompts, or pass flags for CI/scripts
- **Multi-space support** — Switch between Backlog spaces instantly with `backlog auth switch`
- **Shell completions** — Bash, Zsh, and Fish supported

## Installation

```bash
npm install -g @simochee/backlog-cli
```

Or use your preferred package manager:

```bash
yarn global add @simochee/backlog-cli
pnpm add -g @simochee/backlog-cli
bun add -g @simochee/backlog-cli
```

## Quick Start

### Authentication

Log in to your Backlog space:

```bash
backlog auth login
```

An interactive prompt will guide you through selecting your hostname and authentication method. To use an API key directly:

```bash
backlog auth login --hostname your-space.backlog.com --method api-key
```

Verify your setup:

```bash
backlog status
```

If the dashboard appears, you're ready to go.

### Basic Usage

```bash
# List issues
backlog issue list --project YOUR_PROJECT

# Create an issue
backlog issue create --project YOUR_PROJECT --title "New issue" --type Task --priority High

# View issue details
backlog issue view PROJECT-123

# Review and merge a pull request
backlog pr view PROJECT/repo/1
backlog pr merge PROJECT/repo/1

# Check notifications
backlog notification list

# Get JSON output and pipe it
backlog issue list --project YOUR_PROJECT --json key,summary | jq '.[].summary'

# Call the Backlog API directly
backlog api /api/v2/space
```

## Commands

| Command                | Description                |
| ---------------------- | -------------------------- |
| `backlog auth`         | Manage authentication      |
| `backlog config`       | Manage CLI configuration   |
| `backlog issue`        | Manage issues              |
| `backlog pr`           | Manage pull requests       |
| `backlog project`      | Manage projects            |
| `backlog repo`         | Manage Git repositories    |
| `backlog notification` | Manage notifications       |
| `backlog wiki`         | Manage wiki pages          |
| `backlog user`         | Manage users               |
| `backlog team`         | Manage teams               |
| `backlog category`     | Manage categories          |
| `backlog milestone`    | Manage milestones          |
| `backlog issue-type`   | Manage issue types         |
| `backlog status-type`  | Manage statuses            |
| `backlog space`        | Manage space settings      |
| `backlog webhook`      | Manage webhooks            |
| `backlog star`         | Manage stars               |
| `backlog watching`     | Manage watches             |
| `backlog alias`        | Manage command aliases     |
| `backlog status`       | Show dashboard             |
| `backlog browse`       | Open in browser            |
| `backlog api`          | Call Backlog API directly  |
| `backlog completion`   | Generate shell completions |

Run `backlog <command> --help` for details, or visit the [command reference](https://simochee.github.io/backlog-cli/commands/issue/).

## Environment Variables

| Variable          | Description                                               |
| ----------------- | --------------------------------------------------------- |
| `BACKLOG_SPACE`   | Default space hostname (equivalent to the `--space` flag) |
| `BACKLOG_PROJECT` | Default project key (equivalent to the `--project` flag)  |

```bash
export BACKLOG_PROJECT=YOUR_PROJECT

# Now you can omit --project
backlog issue list
backlog milestone list
```

## Output Formats

| Flag                    | Format            | Use case               |
| ----------------------- | ----------------- | ---------------------- |
| _(none)_                | Table             | Human-readable output  |
| `--json`                | JSON              | Programmatic access    |
| `--json field1,field2`  | Filtered JSON     | Select specific fields |
| `--jq '.[]'`            | jq-transformed    | Advanced filtering     |
| `--template '{{.Key}}'` | Go-style template | Custom formatting      |

## Documentation

For full documentation, visit **https://simochee.github.io/backlog-cli**

- [Getting Started](https://simochee.github.io/backlog-cli/getting-started/quickstart/)
- [Authentication Guide](https://simochee.github.io/backlog-cli/guides/authentication/)
- [Output Formatting](https://simochee.github.io/backlog-cli/guides/output-formatting/)
- [Shell Completion](https://simochee.github.io/backlog-cli/guides/shell-completion/)
- [Configuration](https://simochee.github.io/backlog-cli/guides/configuration/)

## License

[MIT](https://github.com/simochee/backlog-cli/blob/main/LICENSE)
