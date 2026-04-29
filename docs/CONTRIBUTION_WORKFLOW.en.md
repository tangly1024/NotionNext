# Contribution Workflow

[中文](./CONTRIBUTION_WORKFLOW.md)

## 1. Branch strategy

- Always branch from latest `main`
- One branch, one change type (feature/fix/docs)
- Naming examples:
  - `fix/...`
  - `feat/...`
  - `chore/...`
  - `docs/...`

## 2. Pre-commit checks

```bash
yarn lint
yarn type-check
yarn test
```

If build-chain changed:

```bash
yarn build
```

## 3. Commit format

Prefer Conventional Commits:

- `feat(scope): ...`
- `fix(scope): ...`
- `docs(scope): ...`
- `chore(scope): ...`

## 4. PR template suggestion

- Background / problem
- Approach (why this way)
- File-level scope
- Risk/compatibility notes
- Verification steps and results

## 5. Forbidden items

- Do not commit personal `.env.local`
- Do not include unrelated personal config changes
- Do not mix unrelated features in one PR
- Do not commit development changes directly to main

## 6. Reviewer-friendly habits

- Keep patch minimal
- Split large changes into smaller PRs
- Clearly mark breaking changes in PR description

