# Quick Start Guide for push-with-version.js

## Overview
`push-with-version.js` is a Node.js script that **works exclusively with Husky** as a Git pre-push hook. It automatically bumps your project version before pushing changes.

## Step-by-Step Setup

### 1. Preparation & Install Dependencies

Copy file `package_json_ref/package.json` to the root of your project as `package.json` if you don't have one already.
If you have it - just add proper dependencies and scripts from that file to your existing `package.json`.

Run from project root (where `package.json` is located):
```bash
npm install
```
This installs Husky and dotenv, then auto-configures the pre-push hook.

Copy file `husky-script_ref/pre-push`
This is a wrapper of git-hook that runs our script

create directory `scripts` and place script `scripts/push-with-version.js`

Copy file `.env.sample` to `.env` and place your version relative path (Default: `VERSION`)

### 2. Verify File Structure
Ensure these files copied to your project:
```
ROOT/
├── package.json
├── scripts/
│   ├── push-with-version.js        (pre-push script)
│   ├── .env                        (configuration)
└── .husky/
    └── pre-push
```

## How It Works
When you `git push`:
1. Husky automatically triggers pre-push hook
2. Script checks for non-version commits
3. If found: bumps patch version, creates commit, pushes all
4. If none: normal push proceeds

## Done!
Your project now auto-bumps version on every push (except main branch).

## Notes
- Version bumps excluded on main branch
- Use `git push --no-verify` to skip hook if needed
