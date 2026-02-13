# Release v0.3.1

**Release Date:** February 13, 2026

## What's New

### Visual Position Picker
The settings window now features an intuitive visual display position picker. Instead of selecting from a dropdown, you can now click directly on screen edges (top, bottom, left, right) to position your keyboard. This makes it much easier to visualize where your keyboard will appear.

### Open Source Community Files
We've added comprehensive open source community documentation:
- **LICENSE**: MIT License
- **CODE_OF_CONDUCT.md**: Community guidelines
- **CONTRIBUTING.md**: How to contribute to the project
- **SECURITY.md**: Security policies and reporting
- **Issue templates**: Bug reports and feature requests
- **Pull request template**: Standardized PR format

## Improvements

### UI Enhancements
- **Vertical layout buttons** now auto-adjust their height to accommodate longer text
- Text is limited to a maximum of 3 lines with ellipsis (...) for overflow
- Removed the Layout dropdown from settings - the layout is now automatically determined by the position you select:
  - Top/Bottom positions → Horizontal layout
  - Left/Right positions → Vertical layout

## Bug Fixes
- Fixed text overflow in vertical layout buttons - long text now properly truncates with ellipsis after 3 lines

## Contributors
- Ultraworked with [Sisyphus](https://github.com/code-yeongyu/oh-my-opencode)

## Installation

### macOS
Download the `.dmg` file and drag VibeCoding666 to your Applications folder.

### Windows
Download and run the `.exe` installer. Administrator privileges are required for proper installation.

### Linux
Download the `.AppImage` file, make it executable (`chmod +x VibeCoding666.AppImage`), and run it. Or install the `.deb` package for Debian/Ubuntu systems.

## Verification

You can verify the integrity of downloaded files using the provided checksums in the release assets.

---

**Full Changelog**: https://github.com/yourusername/vibecoding666/compare/v0.3.0...v0.3.1