+++
date = '2026-03-20T00:00:01-05:00'
draft = false
title = '365 Days of Code - Day 059'
summary = ''
tags = ['365-days-of-code', 'hugo', 'personal-website']
+++

## Project Status

| Project                 | Language      | Status          | Due Date   | Latest Update                                                        |
| :---------------------- | :------------ | :-------------- | :--------- | :------------------------------------------------------------------- |
| Personal Website        | Hugo          | Ongoing         | None       | The site is live. Continuous improvements ongoing.                   |
| Laravel From Scratch    | Laravel (PHP) | In-Progress     | 2026-03-31 | Episode 8                                                            |
| PRM                     | Laravel (PHP) | In-Progress     | 2026-03-31 | Working alongside other Laravel projects.                            |
| Client Website (J.L.)   | Laravel (PHP) | In-Progress     | 2026-03-31 | Working alongside other Laravel projects.                            |
| Project Euler           | C             | Ongoing         | None       | Working on P25. BigInt (AI gen) was a waste of time, need to rewrite |
| Practice Java           | Java          | Paused          | None       | Installed, need to find a good project.                              |
| Practice Python         | Python        | Paused          | None       | Installed, need to find a good project.                              |
| Learn Go                | Go            | Paused          | None       | Installed, work on LDAP Injector from ippsec.                        |
| Learn Rust              | Rust          | Haven't Started | None       | Installed, will try network protocols after finishing in C and Zig.  |
| Learn Elixir            | Elixir        | Haven't Started | None       | Installed, need a good tutorial project.                             |
| Learn Haskell           | Haskell       | Haven't Started | None       | Installed, need a good tutorial project.                             |
| Learn Zig               | Zig           | Haven't Started | None       | Installed, will try network protocols after finishing in C.          |
| Linux+                  | N/A           | In-Progress     | 2026-03-31 | Reading Chapter 4.                                                   |
| Cyber Quest 2026        | N/A           | In-Progress     | 2026-02-28 | Finished quiz 1 with 75%.                                            |
| Operating Systems       | N/A           | In-Progress     | 2026-03-31 | Reading Chapter 4: Abstraction                                       |
| Grey-Hat Hacking        | Various       | In-Progress     | 2026-03-31 | Reading Chapter 8: Threat Hunting Lab                                |
| PHP Time Tracker        | PHP           | Beta Finished   | None       | Working on a basic level.                                            |
| HTTP Status Code Reader | C             | Complete        | 2026-02-18 | Complete.                                                            |
| ZSH Configuration       | bash/zsh      | Complete        | None       | Sort of an ongoing process, but complete for now. Works good.        |
| Network Protocols       | C             | In-Progress     | None       | Working on V3, implementing IPv6.                                    |
| Discinox Website        | HTML, CSS, JS | Complete        | 2026-03-04 | The site is live.                                                    |
| DiroffTech Website      | HTML, CSS, JS | Complete        | 2026-03-05 | The site is live. `git-lfs` needs to be initialized for images.      |
| Automate Backups        | bash          | Complete        | 2026-03-08 | Backups done.                                                        |

## Post Refactoring

In preparation for the new image handling that I'm working on, I refactored all the posts into a dated folder structure. All posts were originally is a giant flat folder at `content/posts/`, and now live in groups separated by year and month, `content/posts/YYYY/MM/`. This provides numerous benefits, most notably the added ability to create page/leaf bundles for all posts. Images that are directly linked to posts will now live with its post inside the folder.

A nice little script was made to make this easy and fast.

```bash
#!/bin/bash

# Loop through all Markdown files in the current directory
for file in *.md; do
  # Skip _index.md or if no .md files exist
  if [[ "$file" == "_index.md" ]] || [[ "$file" == "*.md" ]]; then
    continue
  fi

  # Extract the YYYY-MM string from the 'date =' line in the front matter
  # This matches the first instance of 'date = ' and extracts 'YYYY-MM'
  year_month=$(grep -m 1 "^date[[:space:]]*=" "$file" | grep -oE "[0-9]{4}-[0-9]{2}")

  # Safety check: if no date is found, skip the file
  if [[ -z "$year_month" ]]; then
    echo "⚠️ Warning: Could not parse date in $file. Skipping."
    continue
  fi

  # Split the extracted string into year and month variables
  year="${year_month%-*}"
  month="${year_month#*-}"

  # Get the base filename without the .md extension
  basename="${file%.md}"

  # Define the target directory structure
  target_dir="${year}/${month}/${basename}"

  # Create the directory (-p ensures it creates parent directories if needed and doesn't error if it exists)
  mkdir -p "$target_dir"

  # Move the file to the new directory and rename it to index.md
  mv "$file" "${target_dir}/index.md"

  # Output success message
  echo "✅ Moved: $file -> ${target_dir}/index.md"
done

echo "🎉 Migration complete!"
```
