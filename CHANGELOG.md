# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [2.1.0] - 2025-11-19

### Added
- POST `/cleanup` endpoint that accepts HTML content directly
- Enhanced GET endpoint to return additional metadata (title, byline, excerpt, siteName)

### Changed
- Upgraded Mozilla Readability from 0.4.4 to 0.6.0
- Upgraded Express from 4.18.2 to 5.1.0
- Upgraded axios from 1.6.8 to 1.13.2
- Upgraded dompurify from 3.0.5 to 3.3.0
- Upgraded jsdom from 24.1.0 to 27.2.0
- Upgraded @sentry/node from 7.108.0 to 7.120.4
- Fixed import syntax: `assert { type: "json" }` → `with { type: "json" }`

### Fixed
- All security vulnerabilities (0 vulnerabilities in 175 packages)

## [2.0.0] - 2024-03-29

(No changelog entry for previous versions - to be added if needed)

## [1.3.2] - 2024-03-26

(No changelog entry for previous versions - to be added if needed)

## [1.3.1] - 2024-03-25

(No changelog entry for previous versions - to be added if needed)

## [1.2.0] - 2024-03-22

(No changelog entry for previous versions - to be added if needed)
