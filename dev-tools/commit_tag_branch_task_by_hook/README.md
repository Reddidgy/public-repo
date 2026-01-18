
# Commit Tag Task Commit Hook

## What It Is
Automated git commit hook that prepends branch name to commit messages and validates commit formatting.

## Why We Use It
- **Traceability**: Links commits to feature branches/tasks automatically
- **Consistency**: Enforces uniform commit message format
- **Quality**: Prevents duplicate Signed-off-by lines

## Quick Setup

```bash
npm install husky --save-dev
npx husky install
```

Copy `commit-msg` to `.husky/commit-msg` of required repo:
```bash
cp commit-msg .husky/commit-msg
chmod +x .husky/commit-msg
```

## How It Works
1. Detects current branch name
2. Prepends `[branch-name]` to commit message if missing
3. Validates no duplicate Signed-off-by lines
4. Fails commit if validation errors found

## Example
```
Branch: feature/user-auth
Commit: "Add login validation"
Result: "[feature/user-auth] Add login validation"
```