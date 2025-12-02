# Git Branch Protection Setup

This document describes how to set up branch protection rules on GitHub to enforce our branching strategy.

## Branch Protection Rules

### For `main` branch

1. Go to: <https://github.com/shahidraza-nas/polybase-core/settings/branches>
2. Click "Add rule" or edit existing rule for `main`
3. Configure:
   - ✅ Require a pull request before merging
   - ✅ Require approvals: 1
   - ✅ Dismiss stale pull request approvals when new commits are pushed
   - ✅ Require status checks to pass before merging
   - ✅ Require branches to be up to date before merging
   - ✅ Require conversation resolution before merging
   - ✅ Include administrators (enforce rules for everyone)
   - ✅ Restrict who can push to matching branches (only release managers)

### For `develop` branch

1. Add rule for `develop`
2. Configure:
   - ✅ Require a pull request before merging
   - ✅ Require approvals: 1 (optional for solo development)
   - ✅ Require status checks to pass before merging
   - ✅ Require branches to be up to date before merging
   - ✅ Include administrators

## Local Enforcement

The pre-commit hook (`.husky/pre-commit`) prevents direct commits to `main` and `develop` locally.

To bypass (NOT recommended):

```bash
git commit --no-verify  # Skips pre-commit hook
```

**Never bypass unless absolutely necessary!**

## Quick Setup Commands

```bash
# Enable GitHub branch protection via CLI
gh api repos/shahidraza-nas/polybase-core/branches/main/protection \
  --method PUT \
  --field required_status_checks='{"strict":true,"contexts":[]}' \
  --field enforce_admins=true \
  --field required_pull_request_reviews='{"required_approving_review_count":1}'

gh api repos/shahidraza-nas/polybase-core/branches/develop/protection \
  --method PUT \
  --field required_status_checks='{"strict":true,"contexts":[]}' \
  --field enforce_admins=true \
  --field required_pull_request_reviews='{"required_approving_review_count":1}'
```

## Emergency Override

If you MUST commit directly to main/develop (extreme emergency only):

1. Temporarily disable the hook:

   ```bash
   mv .husky/pre-commit .husky/pre-commit.disabled
   ```

2. Make your commit:

   ```bash
   git add .
   git commit -m "emergency: critical fix"
   ```

3. Re-enable the hook:

   ```bash
   mv .husky/pre-commit.disabled .husky/pre-commit
   ```

4. Document why you bypassed the workflow in commit message and team chat.

**This should be extremely rare!**
