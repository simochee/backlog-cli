import { defineCommand } from "citty";
import consola from "consola";

const BASH_COMPLETION = `# backlog CLI bash completion
_backlog() {
    local cur prev
    COMPREPLY=()
    cur="\${COMP_WORDS[COMP_CWORD]}"
    prev="\${COMP_WORDS[COMP_CWORD-1]}"

    local commands="auth config issue project pr repo notification status browse api wiki user team category milestone issue-type status-type space webhook star watching alias completion"

    if [ "$COMP_CWORD" -eq 1 ]; then
        COMPREPLY=( $(compgen -W "$commands" -- "$cur") )
        return 0
    fi
}
complete -F _backlog backlog`;

const ZSH_COMPLETION = `#compdef backlog

_backlog() {
    local -a commands
    commands=(
        'auth:Manage authentication'
        'config:Manage CLI settings'
        'issue:Manage issues'
        'project:Manage projects'
        'pr:Manage pull requests'
        'repo:Manage Git repositories'
        'notification:Manage notifications'
        'status:Show dashboard summary'
        'browse:Open Backlog in browser'
        'api:Generic API request'
        'wiki:Manage wiki pages'
        'user:Manage users'
        'team:Manage teams'
        'category:Manage categories'
        'milestone:Manage milestones'
        'issue-type:Manage issue types'
        'status-type:Manage status types'
        'space:Manage Backlog space'
        'webhook:Manage webhooks'
        'star:Manage stars'
        'watching:Manage watchings'
        'alias:Manage command aliases'
        'completion:Shell completion setup'
    )

    _describe 'command' commands
}

_backlog "$@"`;

const FISH_COMPLETION = `# backlog CLI fish completion
complete -c backlog -n "__fish_use_subcommand" -a auth -d "Manage authentication"
complete -c backlog -n "__fish_use_subcommand" -a config -d "Manage CLI settings"
complete -c backlog -n "__fish_use_subcommand" -a issue -d "Manage issues"
complete -c backlog -n "__fish_use_subcommand" -a project -d "Manage projects"
complete -c backlog -n "__fish_use_subcommand" -a pr -d "Manage pull requests"
complete -c backlog -n "__fish_use_subcommand" -a repo -d "Manage Git repositories"
complete -c backlog -n "__fish_use_subcommand" -a notification -d "Manage notifications"
complete -c backlog -n "__fish_use_subcommand" -a status -d "Show dashboard summary"
complete -c backlog -n "__fish_use_subcommand" -a browse -d "Open Backlog in browser"
complete -c backlog -n "__fish_use_subcommand" -a api -d "Generic API request"
complete -c backlog -n "__fish_use_subcommand" -a wiki -d "Manage wiki pages"
complete -c backlog -n "__fish_use_subcommand" -a user -d "Manage users"
complete -c backlog -n "__fish_use_subcommand" -a team -d "Manage teams"
complete -c backlog -n "__fish_use_subcommand" -a category -d "Manage categories"
complete -c backlog -n "__fish_use_subcommand" -a milestone -d "Manage milestones"
complete -c backlog -n "__fish_use_subcommand" -a issue-type -d "Manage issue types"
complete -c backlog -n "__fish_use_subcommand" -a status-type -d "Manage status types"
complete -c backlog -n "__fish_use_subcommand" -a space -d "Manage Backlog space"
complete -c backlog -n "__fish_use_subcommand" -a webhook -d "Manage webhooks"
complete -c backlog -n "__fish_use_subcommand" -a star -d "Manage stars"
complete -c backlog -n "__fish_use_subcommand" -a watching -d "Manage watchings"
complete -c backlog -n "__fish_use_subcommand" -a alias -d "Manage command aliases"
complete -c backlog -n "__fish_use_subcommand" -a completion -d "Shell completion setup"`;

const COMPLETIONS: Record<string, string> = {
	bash: BASH_COMPLETION,
	zsh: ZSH_COMPLETION,
	fish: FISH_COMPLETION,
};

export default defineCommand({
	meta: {
		name: "completion",
		description: "Generate shell completion script",
	},
	args: {
		shell: {
			type: "positional",
			description: "Shell type: bash, zsh, or fish",
			required: true,
		},
	},
	run({ args }) {
		const shell = args.shell.toLowerCase();
		const completion = COMPLETIONS[shell];

		if (!completion) {
			consola.error(
				`Unsupported shell: "${args.shell}". Supported: bash, zsh, fish`,
			);
			return process.exit(1);
		}

		// Output the completion script to stdout for eval
		process.stdout.write(`${completion}\n`);
	},
});
