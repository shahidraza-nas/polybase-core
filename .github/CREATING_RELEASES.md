# Creating a GitHub Release

This guide explains how to create a professional GitHub release using the release notes.

## Option 1: Using GitHub Web Interface (Recommended)

### Step 1: Navigate to Releases

1. Go to <https://github.com/shahidraza-nas/polybase-core>
2. Click on **"Releases"** in the right sidebar (or go to `/releases`)
3. Click **"Create a new release"** or **"Draft a new release"**

### Step 2: Configure Release Details

1. **Choose a tag**: Select `v1.2.0` from the dropdown (or create it if not exists)
2. **Target**: `main` branch
3. **Release title**: `v1.2.0 - Authentication, Barrel Exports & TypeScript ESM Fixes`

### Step 3: Add Release Notes

Copy the entire content from `.github/RELEASE_NOTES_v1.2.0.md` and paste it into the description field.

### Step 4: Additional Settings

- ✅ Check **"Set as the latest release"**
- ✅ Check **"Create a discussion for this release"** (optional but recommended)
- ⬜ Don't check "Set as a pre-release"

### Step 5: Publish

Click **"Publish release"** button

---

## Option 2: Using GitHub CLI

If you have [GitHub CLI](https://cli.github.com/) installed:

```bash
# Make sure you're on main branch
git checkout main
git pull origin main

# Create release
gh release create v1.2.0 \
  --title "v1.2.0 - Authentication, Barrel Exports & TypeScript ESM Fixes" \
  --notes-file .github/RELEASE_NOTES_v1.2.0.md \
  --latest

# Verify
gh release view v1.2.0
```

---

## Option 3: Using Git Command Line

```bash
# Make sure you're on main branch
git checkout main
git pull origin main

# Create annotated tag (if not exists)
git tag -a v1.2.0 -m "Release v1.2.0: Authentication, Barrel Exports & TypeScript ESM Fixes"

# Push tag
git push origin v1.2.0

# Then manually create release on GitHub using the tag
```

---

## Release Checklist

Before publishing, ensure:

- ✅ Tag `v1.2.0` exists and points to the correct commit
- ✅ CHANGELOG.md is updated
- ✅ README.md reflects new features
- ✅ npm package is published (`npm view polycore-cli@1.2.0`)
- ✅ All tests pass (`npm test`)
- ✅ Build succeeds (`npm run build`)
- ✅ Release notes are comprehensive
- ✅ Migration guide is included (if needed)

---

## After Publishing

1. **Update npm package** - Verify the README appears correctly on npm:
   - Go to <https://www.npmjs.com/package/polycore-cli>
   - Check that the updated README is displayed
   - If not, wait a few minutes (npm caches README)

2. **Announce the release**:
   - Twitter/X
   - Reddit (r/node, r/typescript)
   - Dev.to article
   - LinkedIn post
   - Project discussions

3. **Monitor for issues**:
   - Watch GitHub issues
   - Check npm package downloads
   - Monitor social media mentions

4. **Update project management**:
   - Close completed milestones
   - Create milestone for next version (v1.3.0)
   - Update project board

---

## Release Note Components

### Good Release Notes Include

1. **Summary** - What's new in one paragraph
2. **Features** - Detailed new functionality
3. **Bug Fixes** - What was broken and is now fixed
4. **Breaking Changes** - Clearly marked with migration steps
5. **Installation** - How to get the new version
6. **Migration Guide** - How to upgrade from previous version
7. **Documentation** - Links to relevant docs
8. **Acknowledgments** - Thank contributors
9. **What's Next** - Roadmap preview

### Examples from Major Projects

- **TypeScript**: <https://github.com/microsoft/TypeScript/releases>
- **Next.js**: <https://github.com/vercel/next.js/releases>
- **Vue.js**: <https://github.com/vuejs/core/releases>
- **Vite**: <https://github.com/vitejs/vite/releases>

---

## Automated Releases (Future)

Consider automating releases with GitHub Actions:

```yaml
name: Release
on:
  push:
    tags:
      - 'v*'
jobs:
  release:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Create Release
        uses: softprops/action-gh-release@v1
        with:
          body_path: .github/RELEASE_NOTES_${{ github.ref_name }}.md
          draft: false
          prerelease: false
```

---

## Current Release Status

- **Tag**: v1.2.0 ✅ (created)
- **npm**: v1.2.0 ✅ (published)
- **GitHub Release**: ⏳ (pending - follow steps above)
- **README Update**: ✅ (completed)
- **Release Notes**: ✅ (ready in `.github/RELEASE_NOTES_v1.2.0.md`)

**Next Action**: Create GitHub release using Option 1 or 2 above
