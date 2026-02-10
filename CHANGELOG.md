# Changelog

## 0.1.0 (unreleased)

### Features

- **auth**: Implement OAuth 2.0 login and token refresh
- **auth**: Support `BACKLOG_API_KEY` environment variable for authentication
- **auth**: OAuth token auto-refresh on 401 responses (#90)
- **cli**: Add `--json` output flag for structured output across 38 commands
- **cli**: Add `--space` / `-s` global option for multi-space support
- **cli**: Display version in help output
- **cli**: Generate shell completion script (`backlog completion`)
- **config**: Support shorthand space name without domain suffix
- **issue**: Implement issue commands (list, view, create, edit, close, reopen, delete, comment, status)
- **pr**: Implement pull request commands (list, view, create, edit, close, merge, reopen, comment, comments, status)
- **project**: Implement project commands (list, view, create, edit, delete, users, add-user, remove-user, activities)
- **repo**: Implement repository commands (list, view, clone)
- **wiki**: Implement wiki commands (list, view, create, edit, delete, count, tags, history, attachments)
- **notification**: Implement notification commands (list, count, read, read-all)
- **user**: Implement user commands (list, view, me, activities)
- **team**: Implement team commands (list, view, create, edit, delete)
- **category**: Implement category commands (list, create, edit, delete)
- **milestone**: Implement milestone commands (list, create, edit, delete)
- **issue-type**: Implement issue type commands (list, create, edit, delete)
- **status-type**: Implement status commands (list, create, edit, delete)
- **space**: Implement space commands (info, activities, disk-usage, notification)
- **webhook**: Implement webhook commands (list, view, create, edit, delete)
- **star**: Implement star commands (add, list, count)
- **watching**: Implement watching commands (list, add, view, delete, read)
- **alias**: Implement alias commands (set, list, delete)
- **browse**: Open Backlog pages in browser
- **api**: Generic authenticated API request command
- **status**: Dashboard summary (assigned issues, notifications, recent activity)
- Support `BACKLOG_PROJECT` environment variable for default project key

### Bug Fixes

- **cli**: Use cross-platform `open` package for `--web` browser opening (#91)
- **cli**: Replace Bun-specific APIs with Node.js standard library for portability
- **api**: Display quota limit reset time on 429 rate limit response
- Fix TypeSpec definitions to match real Backlog API responses

### Performance

- **cli**: Optimize bundle size with minification and native fetch
- Lazy-load subcommands for fast startup (~300ms)
