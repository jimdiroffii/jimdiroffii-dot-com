# jimdiroffii-dot-com

An Astro website

## Build Status

[![Netlify Status](https://api.netlify.com/api/v1/badges/63b7ed2f-2996-4d5b-ae9a-628ab9a2f800/deploy-status)](https://app.netlify.com/projects/jimdiroffii-dot-com/deploys)

## Binary File Handling

Ensure binary files are handled through [git lfs](https://git-lfs.com/).

- Install git lfs package: `apt install git-lfs`
- Setup the package: `git lfs install`
- Track files: `git lfs track "*.ext"`
- Commit git attributes: `git add .gitattributes`

### Track previously committed files and rebase with signature

**This is a destructive action that rewrites the commit history**

- Track the file that was not included in `lfs`: `git lfs migrate import --everything --include="favicon.svg"`

The `rebase` operation can be performed from the first commit where the imported file was committed, or from the root commit. Without `rebase`, all GPG signatures of rewritten commits become invalid.

- Rebase from root: `git rebase --exec 'git commit --amend --no-edit -S' --root`
- Rebase from commit: `git rebase --exec 'git commit --amend --no-edit -S' -i <commit hash>`

The next push has to be forced since the commit history changed. Other copies of the repository will need to be cloned or rebased again.

- Force push: `git push --force`

The new commits should have been written, and GPG signatures verified.

## Upgrading Astro and integrations

Upgrade to the latest version of Astro, and upgrade all integrations to their latest versions. 

```
npx @astrojs/upgrade
```
