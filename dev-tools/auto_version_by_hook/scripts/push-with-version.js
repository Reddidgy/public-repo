#!/usr/bin/env node
/**
 * Wrapper for git push that ensures version is bumped before pushing
 *
 * Usage: node scripts/push-with-version.js [git-push-args...]
 *
 * This script:
 * 1. Consumes stdin (push refs from git)
 * 2. Checks if version needs bumping (non-version commits exist)
 * 3. If yes, bumps version and creates version commit
 * 4. Then executes git push with all the version commits included
 *
 * When called from pre-push hook, consuming stdin signals that the hook
 * is handling the entire push operation, preventing IDEA from trying again.
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

// Load .env file if dotenv is available
try {
  const envPath = path.join(__dirname, '.env');
  require('dotenv').config({ path: envPath });
} catch (e) {
  // dotenv is optional - script will use defaults if not installed
}


function runGit(command) {
  try {
    const stdout = execSync(command, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
    return { ok: true, stdout: (stdout ?? '').trim() };
  } catch (e) {
    const stderr = (e && e.stderr) ? String(e.stderr) : '';
    return { ok: false, stdout: '', stderr: stderr.trim() };
  }
}

function mustGit(command, msg) {
  const r = runGit(command);
  if (!r.ok) throw new Error(msg || `Git command failed: ${command}\n${r.stderr || ''}`);
  return r.stdout;
}

function parseSemver(str) {
  const m = String(str).trim().match(/^(\d+)\.(\d+)\.(\d+)$/);
  if (!m) return null;
  return { major: Number(m[1]), minor: Number(m[2]), patch: Number(m[3]) };
}

function normalizeGitPath(p) {
  return String(p)
    .replace(/\\/g, '/')
    .replace(/^\.\/+/, '')
    .replace(/\/+/g, '/')
    .replace(/\/$/, '');
}

async function consumeStdin() {
  // Consume stdin to signal to git that the hook is handling the push
  // This prevents IDEA from trying to push again
  return new Promise((resolve) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
      terminal: false
    });

    let stdinConsumed = false;

    rl.on('line', (line) => {
      // Silently consume each line (push refs)
      stdinConsumed = true;
    });

    rl.on('close', () => {
      resolve(stdinConsumed);
    });

    // If stdin is not a TTY (not interactive), it might close immediately
    // Set a timeout to ensure we proceed
    setTimeout(() => {
      rl.close();
      resolve(stdinConsumed);
    }, 100);
  });
}

async function main() {
  // Consume stdin to signal we're handling the push operation
  const hadStdin = await consumeStdin();

  // --- CONFIGURATION ---
  // Path to the version file, relative to the repository root.
  const versionFileRelativePath = process.env.VERSION_FILE_PATH || 'frontend/public/version';

  // If we consumed stdin, we're being called from a git hook
  // Signal to git that the hook successfully handled the push
  const fromHook = hadStdin || process.env.GIT_HOOK === 'pre-push';

  if (fromHook) {
    console.log('\n============================================================');
    console.log('[push-with-version] PRE-PUSH HOOK ACTIVATED');
    console.log('============================================================\n');
  }

  console.log('[push-with-version] Preparing push with version check...\n');

  // Verify git repo
  if (!runGit('git rev-parse --is-inside-work-tree').ok) {
    console.log('[push-with-version] Not in a git repository');
    process.exit(1);
  }

  const repoRoot = mustGit('git rev-parse --show-toplevel');
  const versionFilePath = path.join(repoRoot, versionFileRelativePath);

  // Current branch
  const currentBranch = mustGit('git rev-parse --abbrev-ref HEAD');

  if (currentBranch === 'main') {
    console.log('[push-with-version] On main branch, skipping version bump');
    console.log('[push-with-version] Running git push...\n');
    const pushArgs = process.argv.slice(2).join(' ');
    execSync(`git push --no-verify ${pushArgs}`, { stdio: 'inherit' });
    console.log('[push-with-version] Push successful!');
    process.exit(0);
  }

  // Upstream must exist
  const upstreamRes = runGit('git rev-parse --abbrev-ref --symbolic-full-name @{u}');
  if (!upstreamRes.ok || !upstreamRes.stdout) {
    console.log(`[push-with-version] No upstream for '${currentBranch}', proceeding with push`);
    console.log('[push-with-version] Running git push...\n');
    const pushArgs = process.argv.slice(2).join(' ');
    execSync(`git push ${pushArgs}`, { stdio: 'inherit' });
    console.log('[push-with-version] Push successful!');
    process.exit(0);
  }

  const upstream = upstreamRes.stdout;
  const remote = upstream.split('/')[0];
  const remoteRef = upstream.split('/').slice(1).join('/');

  // Fetch latest upstream
  runGit(`git fetch --quiet --no-tags ${remote} ${remoteRef}`);

  // Check if last commit is version bump
  const lastMsg = runGit('git log -1 --pretty=format:%s').stdout;
  if (lastMsg && lastMsg.startsWith('version: ')) {
    console.log('[push-with-version] Last commit is already a version bump, proceeding with push');
    console.log('[push-with-version] Running git push...\n');
    const pushArgs = process.argv.slice(2).join(' ');
    execSync(`git push ${pushArgs}`, { stdio: 'inherit' });
    console.log('[push-with-version] Push successful!');
    process.exit(0);
  }

  // Count non-version commits
  const range = '@{u}..HEAD';
  const cntRes = runGit(`git rev-list --count --extended-regexp --invert-grep --grep="^version: " ${range}`);
  const nonVersionCommits = cntRes.ok ? parseInt(cntRes.stdout, 10) : 0;

  if (!Number.isFinite(nonVersionCommits) || nonVersionCommits <= 0) {
    console.log('[push-with-version] No non-version commits to bump, proceeding with push');
    console.log('[push-with-version] Running git push...\n');
    const pushArgs = process.argv.slice(2).join(' ');
    execSync(`git push ${pushArgs}`, { stdio: 'inherit' });
    console.log('[push-with-version] Push successful!');
    process.exit(0);
  }

  console.log(`[push-with-version] Found ${nonVersionCommits} non-version commit(s) ahead of ${upstream}`);

  // Read current version
  if (!fs.existsSync(versionFilePath)) {
    console.error(`[push-with-version] Version file not found: ${versionFilePath}`);
    process.exit(1);
  }

  const versionContent = fs.readFileSync(versionFilePath, 'utf8').trim();
  const current = parseSemver(versionContent);
  if (!current) {
    console.error(`[push-with-version] Invalid version format: '${versionContent}'. Expected X.Y.Z`);
    process.exit(1);
  }

  const newVersion = {
    major: current.major,
    minor: current.minor,
    patch: current.patch + nonVersionCommits
  };
  const newVersionString = `${newVersion.major}.${newVersion.minor}.${newVersion.patch}`;

  console.log(`[push-with-version] Current version: ${versionContent}`);
  console.log(`[push-with-version] Bumping PATCH by ${nonVersionCommits} -> ${newVersionString}\n`);

  // Update version file
  fs.writeFileSync(versionFilePath, `${newVersionString}\n`, 'utf8');

  // Stage and commit version
  const relativeVersionPath = normalizeGitPath(path.relative(repoRoot, versionFilePath));
  runGit(`git add -- "${relativeVersionPath}"`);
  const commitRes = runGit(`git commit -m "version: ${newVersionString}" --no-verify -- "${relativeVersionPath}"`);

  if (!commitRes.ok) {
    console.error(`[push-with-version] Failed to create version commit`);
    process.exit(1);
  }

  console.log(`[push-with-version] Created version commit: ${newVersionString}`);
  console.log('[push-with-version] Running git push...\n');

  // Now run git push with the version commit included
  // Use --no-verify to prevent infinite loop if called from pre-push hook
  const pushArgs = process.argv.slice(2).join(' ');
  try {
    execSync(`git push --no-verify ${pushArgs}`, { stdio: 'inherit' });
    console.log('\n============================================================');
    console.log('[push-with-version] PUSH SUCCESSFUL!');
    console.log('All commits (including version bump) have been pushed.');
    console.log('============================================================\n');
    process.exit(0);
  } catch (e) {
    console.error('\n[push-with-version] Push failed!');
    process.exit(1);
  }
}

try {
  main().catch(e => {
    console.error(`[push-with-version] Fatal error: ${e.message}`);
    process.exit(1);
  });
} catch (e) {
  console.error(`[push-with-version] Fatal error: ${e.message}`);
  process.exit(1);
}
