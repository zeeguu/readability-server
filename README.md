# readability-server

A Node.js service that uses Mozilla Readability to extract clean article content from web pages.

## Features

- **GET /cleanup?url=...** - Fetch and clean article from URL
- **POST /cleanup** - Clean article from provided HTML content
- Returns cleaned HTML, plain text, and metadata (title, byline, excerpt, site name)

## Release Process

This project uses **automated Docker Hub publishing** - no manual work required!

### 1. Make your changes
```bash
# Edit code, commit as usual
git add <files>
git commit -m "Your changes"
```

### 2. Update CHANGELOG.md
Add your changes under `[Unreleased]` section:
```markdown
## [Unreleased]

### Added
- New feature description

### Changed
- What changed

### Fixed
- Bug fixes
```

### 3. Bump version and release
```bash
# Move [Unreleased] changes to new version section with date
# Edit CHANGELOG.md: ## [2.2.0] - 2025-11-20

# Bump version in package.json
npm version major|minor|patch --no-git-tag-version

# Commit version bump
git add CHANGELOG.md package.json
git commit -m "Release vX.Y.Z"

# Push to main
git push origin main
```

### 4. Automated publishing
GitHub Actions automatically:
- Detects version change in package.json
- Builds Docker image
- Pushes to Docker Hub as:
  - `aecrimus/readability_server:X.Y.Z`
  - `aecrimus/readability_server:latest`

**That's it!** No manual GitHub releases, no Docker commands.

## Versioning

Follows [Semantic Versioning](https://semver.org/):
- **Major (X.0.0)**: Breaking changes
- **Minor (0.X.0)**: New features (backwards compatible)
- **Patch (0.0.X)**: Bug fixes

## Development

```bash
npm install
node server.js
```

Server runs on http://localhost:3456