# Command Reference

This document shows the actual `--help` output for each command. Run `backlog <command> --help` for up-to-date information.

## Root Command

```
$ backlog --help

Backlog CLI — manage Backlog from the command line (backlog v0.0.0)

USAGE backlog auth|config|issue|project|pr|repo|notification|dashboard|browse|api|wiki|document|user|team|category|milestone|issue-type|status|space|webhook|star|watching|alias|completion

COMMANDS

          auth    Manage authentication
        config    Manage CLI configuration
         issue    Manage issues
       project    Manage projects
            pr    Manage pull requests
          repo    Manage Git repositories
  notification    Manage notifications
     dashboard    Show your dashboard summary
        browse    Open Backlog in the browser
           api    Make an authenticated API request
          wiki    Manage wiki pages
      document    Manage documents
          user    Manage users
          team    Manage teams
      category    Manage issue categories
     milestone    Manage milestones
    issue-type    Manage issue types
        status    Manage issue statuses
         space    Manage Backlog space
       webhook    Manage webhooks
          star    Manage stars
      watching    Manage watchings
         alias    Manage command aliases
    completion    Generate shell completion script

Use backlog <command> --help for more information about a command.
```

## auth

```
$ backlog auth --help

Manage authentication (backlog auth v0.0.0)

USAGE backlog auth login|logout|status|token|refresh|switch

COMMANDS

    login    Authenticate with a Backlog space
   logout    Remove authentication for a Backlog space
   status    Show authentication status
    token    Print the auth token to stdout
  refresh    Refresh OAuth token
   switch    Switch active space

Use backlog auth <command> --help for more information about a command.
```

## config

```
$ backlog config --help

Manage CLI configuration (backlog config v0.0.0)

USAGE backlog config get|set|list

COMMANDS

   get    Get a configuration value
   set    Set a configuration value
  list    List all configuration values

Use backlog config <command> --help for more information about a command.
```

## issue

```
$ backlog issue --help

Manage issues (backlog issue v0.0.0)

USAGE backlog issue list|view|create|edit|close|reopen|delete|comment|status

COMMANDS

     list    List issues
     view    View issue details
   create    Create a new issue
     edit    Edit an existing issue
    close    Close an issue
   reopen    Reopen a closed issue
   delete    Delete an issue
  comment    Add a comment to an issue
   status    Show issue status summary for yourself

Use backlog issue <command> --help for more information about a command.
```

### issue list

```
$ backlog issue list --help

List issues (issue list)

USAGE issue list [OPTIONS]

OPTIONS

            --json    Output as JSON (optionally filter by field names, comma-separated)
     -p, --project    Project key (multiple allowed, comma-separated) (env: BACKLOG_PROJECT)
    -a, --assignee    Assignee (username or @me)
      -S, --status    Status name (multiple allowed, comma-separated)
        -T, --type    Issue type name (multiple allowed, comma-separated)
    -P, --priority    Priority name
     -k, --keyword    Keyword search
   --created-since    Created since (yyyy-MM-dd)
   --created-until    Created until (yyyy-MM-dd)
   --updated-since    Updated since (yyyy-MM-dd)
   --updated-until    Updated until (yyyy-MM-dd)
       --due-since    Due date since (yyyy-MM-dd)
       --due-until    Due date until (yyyy-MM-dd)
  --sort="updated"    Sort key
    --order="desc"    Sort order: asc or desc
  -L, --limit="20"    Number of results (1-100)
          --offset    Offset for pagination
```

### issue view

```
$ backlog issue view --help

View issue details (issue view)

USAGE issue view [OPTIONS] <ISSUEKEY>

ARGUMENTS

  ISSUEKEY    Issue key (e.g., PROJECT-123)

OPTIONS

      --json    Output as JSON (optionally filter by field names, comma-separated)
  --comments    Include comments
       --web    Open in browser
```

### issue create

```
$ backlog issue create --help

Create a new issue (issue create)

USAGE issue create [OPTIONS]

OPTIONS

      -p, --project    Project key (env: BACKLOG_PROJECT)
        -t, --title    Issue summary
  -d, --description    Issue description (use "-" for stdin)
         -T, --type    Issue type name
     -P, --priority    Priority name
     -a, --assignee    Assignee username
       --start-date    Start date (yyyy-MM-dd)
         --due-date    Due date (yyyy-MM-dd)
              --web    Open in browser after creation
```

### issue edit

```
$ backlog issue edit --help

Edit an existing issue (issue edit)

USAGE issue edit [OPTIONS] <ISSUEKEY>

ARGUMENTS

  ISSUEKEY    Issue key (e.g., PROJECT-123)

OPTIONS

        -t, --title    Issue title
  -d, --description    Issue description (use "-" for stdin)
       -S, --status    Status name
         -T, --type    Issue type name
     -P, --priority    Priority name
     -a, --assignee    Assignee (username or @me)
     -c, --comment    Comment to add with the change
```

### issue close

```
$ backlog issue close --help

Close an issue (issue close)

USAGE issue close [OPTIONS] <ISSUEKEY>

ARGUMENTS

  ISSUEKEY    Issue key (e.g., PROJECT-123)

OPTIONS

     -c, --comment    Close comment
  -r, --resolution    Resolution name
```

### issue comment

```
$ backlog issue comment --help

Add a comment to an issue (issue comment)

USAGE issue comment [OPTIONS] <ISSUEKEY>

ARGUMENTS

  ISSUEKEY    Issue key (e.g., PROJECT-123)

OPTIONS

  -b, --body    Comment body (use "-" for stdin)
```

### issue status

```
$ backlog issue status --help

Show issue status summary for yourself (issue status)

USAGE issue status [OPTIONS]

OPTIONS

  --json    Output as JSON (optionally filter by field names, comma-separated)
```

## pr

```
$ backlog pr --help

Manage pull requests (backlog pr v0.0.0)

USAGE backlog pr list|view|create|edit|close|merge|reopen|comment|comments|status

COMMANDS

      list    List pull requests
      view    View pull request details
    create    Create a pull request
      edit    Edit a pull request
     close    Close a pull request
     merge    Merge a pull request
    reopen    Reopen a closed pull request
   comment    Add a comment to a pull request
  comments    List pull request comments
    status    Show pull request status summary for yourself

Use backlog pr <command> --help for more information about a command.
```

### pr list

```
$ backlog pr list --help

List pull requests (pr list)

USAGE pr list [OPTIONS] -R, --repo

OPTIONS

                 --json    Output as JSON (optionally filter by field names, comma-separated)
          -p, --project    Project key (env: BACKLOG_PROJECT)
  -R, --repo (required)    Repository name
    -S, --status="open"    Status: open, closed, merged (comma-separated)
         -a, --assignee    Assignee (username or @me)
           --created-by    Created by (username or @me)
                --issue    Related issue key
       -L, --limit="20"    Number of results (1-100)
               --offset    Offset for pagination
```

### pr create

```
$ backlog pr create --help

Create a pull request (pr create)

USAGE pr create [OPTIONS] -R, --repo

OPTIONS

          -p, --project    Project key (env: BACKLOG_PROJECT)
  -R, --repo (required)    Repository name
            -t, --title    PR title
             -b, --body    PR description
             -B, --base    Base branch (merge target)
               --branch    Source branch
         -a, --assignee    Assignee (username or @me)
                --issue    Related issue key
                  --web    Open in browser after creation
```

## project

```
$ backlog project --help

Manage projects (backlog project v0.0.0)

USAGE backlog project list|view|create|edit|delete|activities|users|add-user|remove-user

COMMANDS

         list    List projects
         view    View project details
       create    Create a project
         edit    Edit a project
       delete    Delete a project
   activities    Show recent project activities
        users    List project users
     add-user    Add a user to a project
  remove-user    Remove a user from a project

Use backlog project <command> --help for more information about a command.
```

## repo

```
$ backlog repo --help

Manage Git repositories (backlog repo v0.0.0)

USAGE backlog repo list|view|clone

COMMANDS

   list    List Git repositories
   view    View Git repository details
  clone    Clone a Git repository

Use backlog repo <command> --help for more information about a command.
```

## notification

```
$ backlog notification --help

Manage notifications (backlog notification v0.0.0)

USAGE backlog notification list|count|read|read-all

COMMANDS

      list    List notifications
     count    Show unread notification count
      read    Mark a notification as read
  read-all    Mark all notifications as read

Use backlog notification <command> --help for more information about a command.
```

## wiki

```
$ backlog wiki --help

Manage wiki pages (backlog wiki v0.0.0)

USAGE backlog wiki list|view|create|edit|delete|count|tags|history|attachments

COMMANDS

         list    List wiki pages
         view    View a wiki page
       create    Create a wiki page
         edit    Edit a wiki page
       delete    Delete a wiki page
        count    Show wiki page count
         tags    List wiki tags
      history    Show wiki page history
  attachments    List wiki page attachments

Use backlog wiki <command> --help for more information about a command.
```

## document

```
$ backlog document --help

Manage documents (backlog document v0.0.0)

USAGE backlog document create|delete

COMMANDS

  create    Create a document
  delete    Delete a document

Use backlog document <command> --help for more information about a command.
```

### document create

```
$ backlog document create --help

Create a document (backlog document create v0.0.0)

USAGE backlog document create [OPTIONS]

OPTIONS

  -p, --project      Project key (env: BACKLOG_PROJECT)
  -t, --title        Document title
  -b, --body         Document content (Markdown)
      --emoji        Emoji displayed next to the title
      --parent-id    Parent document ID
      --add-last     Add to the end of siblings (default: add to beginning)
```

### document delete

```
$ backlog document delete --help

Delete a document (backlog document delete v0.0.0)

USAGE backlog document delete DOCUMENT-ID [OPTIONS]

ARGUMENTS

  DOCUMENT-ID    Document ID (required)

OPTIONS

  -y, --yes    Skip confirmation prompt
```

## user

```
$ backlog user --help

Manage users (backlog user v0.0.0)

USAGE backlog user list|view|me|activities

COMMANDS

        list    List users
        view    View user details
          me    Show current user information
  activities    Show user activities

Use backlog user <command> --help for more information about a command.
```

## status

```
$ backlog status --help

Show your dashboard summary (backlog status v0.0.0)

USAGE backlog status [OPTIONS]

OPTIONS

  --json    Output as JSON (optionally filter by field names, comma-separated)
```

## browse

```
$ backlog browse --help

Open Backlog in the browser (backlog browse v0.0.0)

USAGE backlog browse [OPTIONS] <TARGET>

ARGUMENTS

  TARGET    Issue key or path to open

OPTIONS

  -p, --project    Project key (env: BACKLOG_PROJECT)
       --issues    Open issues list
         --wiki    Open wiki
          --git    Open Git repositories page
     --settings    Open project settings
```

## api

```
$ backlog api --help

Make an authenticated API request (backlog api v0.0.0)

USAGE backlog api [OPTIONS] <ENDPOINT>

ARGUMENTS

  ENDPOINT    API endpoint path (e.g., /api/v2/users/myself)

OPTIONS

  -X, --method="GET"    HTTP method
         -f, --field    Request field (key=value, repeatable)
        -H, --header    Additional header (repeatable)
       -i, --include    Include response headers
          --paginate    Paginate through all results
            --silent    Suppress output
```

## Other Commands

For commands not detailed above (team, category, milestone, issue-type, status, space, webhook, star, watching, alias, completion), run:

```bash
backlog <command> --help
```

To see subcommands:

```bash
backlog <command> <subcommand> --help
```
