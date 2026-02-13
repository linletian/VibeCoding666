# Release Note - v0.3.0

## Release Date

2026-02-13

## What's New

- **Cross-platform uninstall tools**:
  - Windows installer now supports optional user-data cleanup during uninstall
  - Added `npm run uninstall:mac` for interactive uninstall on macOS
  - Added `npm run uninstall:linux` for interactive uninstall on Linux
- **Updated default key presets**: default key content is now optimized for quick Chinese prompt snippets.
- **Docs update**: `README` now includes clear uninstall instructions for Windows, macOS, and Linux.

## Technical Changes

- Added NSIS custom uninstall macro script: `scripts/nsis-uninstall.nsh`
- Added shell uninstall scripts:
  - `scripts/uninstall-macos.sh`
  - `scripts/uninstall-linux.sh`
- Added npm scripts:
  - `uninstall:mac`
  - `uninstall:linux`

## Notes

- On Linux, system-path cleanup may require `sudo`.
- User-data cleanup is optional and prompted interactively by the uninstall tool.
