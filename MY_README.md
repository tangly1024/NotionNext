# My Readme

## Start dev environment

```bash
export NOTION_PAGE_ID=76ea48631d26462d98cbf32656bd3fa4
npm run dev
```

If needed, add breakpoints and run it from a JavaScript Debug Terminal.

## Develop

### Update to match upstream

```bash
# Update main branch to the latest version of upstream
git checkout main
git pull upstream main
git push origin main

# Rebase dev branch to the latest version of main
git checkout dev
git rebase main
```

### Commit small changes

```
git add .
git commit --amend
git push origin dev --force
```

### Commit big changes

Just commit it as usual. However, when update to match upstream, use `git rebase -i` to squash the commits before rebase.
