
# Commit Tag Task Commit Hook

Automated git commit hook that prepends branch name to commit messages and validates commit formatting.

## Features

- **Auto-prepend branch name**: Links commits to feature branches/tasks automatically
- **Format validation**: Enforces uniform commit message structure
- **Duplicate detection**: Prevents duplicate Signed-off-by lines in commit messages

## Prerequisites

- Node.js (v14+)
- Git

## Installation

1. **Set up package.json** in your project root:
   - Option A: Copy the provided `package_json_ref/package.json` to your project root
   - Option B: Add Husky to your existing `package.json`:

2. Install Husky:
```bash
npm install husky --save-dev
npx husky install
```

3. Copy the hook to your project's `.husky` directory:
```bash
cp commit-msg .husky/commit-msg
chmod +x .husky/commit-msg
```

3. Verify setup:
```bash
git commit --allow-empty -m "Test commit"
```

## How It Works

1. **Branch Detection**: Extracts current branch name from git
2. **Message Prepending**: Adds `[branch-name]` prefix if not already present
3. **Validation**: Checks for and rejects duplicate Signed-off-by lines
4. **Enforcement**: Prevents commits with validation errors

## Example

```
Branch: feature/user-auth
Input: "Add login validation"
Output: "[feature/user-auth] Add login validation"
```

## Troubleshooting

**Hook not executing?**
- Ensure `.husky/commit-msg` has execute permissions: `chmod +x .husky/commit-msg`
- Verify Husky is installed: `npx husky install`

**Duplicate Signed-off-by error?**
- Remove duplicate entries from your commit message and try again

## References

- [Husky Documentation](https://typicode.github.io/husky/)
- [Git Hooks Guide](https://git-scm.com/book/en/v2/Customizing-Git-Git-Hooks)

