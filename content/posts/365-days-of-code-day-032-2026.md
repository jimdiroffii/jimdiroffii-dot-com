+++
date = '2026-02-21T00:00:01-05:00'
draft = false
title = '365 Days of Code - Day 032'
summary = ''
+++

## Project Status

Going to start including the project status table moving forward. This should help better track progress over the year.

| Project                 | Language      | Status          | Due Date   | Latest Update                                                                                             |
| :---------------------- | :------------ | :-------------- | :--------- | :-------------------------------------------------------------------------------------------------------- |
| Personal Website        | Hugo          | Ongoing         | None       | The site is live. There are some TODOs. Need to work on categorization, tagging, and layout improvements. |
| Laravel From Scratch    | Laravel (PHP) | In-Progress     | 2026-03-31 | Episode 8                                                                                                 |
| PRM                     | Laravel (PHP) | In-Progress     | 2026-03-31 | Working alongside other Laravel projects.                                                                 |
| Client Website (J.L.)   | Laravel (PHP) | In-Progress     | 2026-03-31 | Working alongside other Laravel projects.                                                                 |
| Project Euler           | C             | Ongoing         | None       | Working on P25 on a best effort basis. Currently building a BigInt library.                               |
| Practice Java           | Java          | Paused          | None       | Installed, need to find a good project.                                                                   |
| Practice Python         | Python        | Paused          | None       | Installed, need to find a good project.                                                                   |
| Learn Go                | Go            | Paused          | None       | Installed, work on LDAP Injector from ippsec.                                                             |
| Learn Rust              | Rust          | Haven't Started | None       | Installed, need a good tutorial project.                                                                  |
| Learn Elixir            | Elixir        | Haven't Started | None       | Installed, need a good tutorial project.                                                                  |
| Learn Haskell           | Haskell       | Haven't Started | None       | Installed, need a good tutorial project.                                                                  |
| Linux+                  | N/A           | In-Progress     | 2026-03-31 | Reading Chapter 4.                                                                                        |
| Cyber Quest 2026        | N/A           | In-Progress     | 2026-02-28 | Finished quiz 1 with 75%. Need to work on ARP poisoning and timestamp adjustments in WireShark.           |
| Operating Systems       | N/A           | In-Progress     | 2026-03-31 | Reading Chapter 4: Abstraction                                                                            |
| Grey-Hat Hacking        | Various       | In-Progress     | 2026-03-31 | Reading Chapter 8: Threat Hunting Lab                                                                     |
| PHP Time Tracker        | PHP           | Beta Finished   | None       | Working on a basic level. Could use a couple more updates to make it fully functional.                    |
| HTTP Status Code Reader | C             | Complete        | 2026-02-18 | Complete. Could potentially upgrade for more advanced functions or follow redirects.                      |
| ZSH Configuration       | bash/zsh      | Complete        | None       | Sort of an ongoing process, but complete for now. Works good.                                             |

## Refactor .zshrc

I completely refactored by zshrc today. I was doing some research on zsh, and found that I was underutilizing several features. Most notably, the way I was checking for the current OS.

I prefer to share the same zsh configuration across my machines, rather than maintaining separate files per machine type. This adds some complexity because I now need to verify the OS type before executing some of the commands and setting aliases. zsh comes with a built in environment variable `$OSTYPE`, which holds the current OS type automatically. Removing the need for me to read files such as `/etc/os-release`.

My old method came over from my original `.bashrc` file. I would run something like this:

```bash
if [[ "$(uname)" == "Darwin" ]]; then
  OS="macos"
elif [[ -f /etc/os-release ]]; then
  . /etc/os-release
  if [[ "$ID" == *debian* ]] || [[ "$ID_LIKE" == *debian* ]]; then
      OS="debian"
  elif [[ "$ID" == *fedora* ]]; then
      OS="fedora"
  else
      OS="$ID_LIKE"
  fi
else
  echo -e "~/.bashrc error. Unknown OS. Some features might not work.\n"
fi
```

Based on the OS detected, I would run a commands within a conditional statement block.

```bash
if [[ "$OS" == "macos" ]]; then
  # MacOS specific settings
  echo
elif [[ "$OS" == "debian" ]]; then
  # Debian/Ubuntu specific settings
  echo
elif [[ "$OS" == "fedora" ]]; then
  # Fedora specific settings
  echo
fi
```

With `zsh`, these `if/else` statements were replaced with `case` blocks.

```bash
case "$OSTYPE" in
  darwin*)
    #do something
    ;;
  linux*)
    #do something
    ;;
  *)
    #do something
    ;;
esac
```

I also had a number of checks to ensure certain software was installed before setting an alias or a path. My old solution would prompt the user to install certain programs every time a shell was launched, and there was no logic to actually install the program through the script. My new solution solves both of those problems. It sets up a directory that stores a small state file for each program. If the user selects to install the program, the script executes the installation. Either way, the user is not prompted again due to the state file.

```bash
prompt_install() {
    local cmd_name="$1"
    local pkg_name="${2:-$1}"
    local marker_dir="${XDG_STATE_HOME:-$HOME/.local/state}/zsh_prompts"
    local marker_file="$marker_dir/${cmd_name}"
    local install_cmd=""

    # 1. Check if the command is missing and we haven't asked yet
    if ! command -v "$cmd_name" &> /dev/null && [[ ! -f "$marker_file" ]]; then

        # 2. Detect the available package manager
        if command -v brew &> /dev/null; then
            install_cmd="brew install $pkg_name"
        elif command -v apt-get &> /dev/null; then
            install_cmd="sudo apt-get install -y $pkg_name"
        elif command -v dnf &> /dev/null; then
            install_cmd="sudo dnf install -y $pkg_name"
        elif command -v pacman &> /dev/null; then
            install_cmd="sudo pacman -S --noconfirm $pkg_name"
        else
            return 1
        fi

        # 3. Prompt the user
        echo ""
        if read -q "REPLY?'$cmd_name' is missing. Run '$install_cmd'? [y/N] "; then
            echo -e "\nInstalling $pkg_name..."
            eval "$install_cmd"
        else
            echo -e "\nSkipping. You won't be asked again."
        fi

        # 4. Ensure the directory exists, then create the marker file
        mkdir -p "$marker_dir"
        touch "$marker_file"
    fi
}
```

Now I can simply call `prompt_install` before setting the aliases to ensure the application is installed before setting the alias.

```bash
prompt_install "git"
if command -v git &> /dev/null; then
    alias gs='git status'
    alias gf='git fetch'
    alias ga='git add .'
    alias gc='git commit -S -m'
    alias gl='git log --graph --pretty=format:"%Cred%h%Creset -%C(yellow)%d%Creset %s %Cgreen(%cr) %C(bold blue)<%an>%Creset" --abbrev-commit'
fi
```

I also reconfigured [zsh4humans](https://github.com/romkatv/zsh4humans/tree/v5) to remove the tmux dependency. I like tmux and use it, but I don't need it on every session and would rather just launch tmux when I need it.

The complete zshrc and p10k.zsh files can be found in my [dotfiles](https://github.com/jimdiroffii/dotfiles) repo on Github.
