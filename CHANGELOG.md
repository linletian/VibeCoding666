# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.2.0] - 2026-02-12

### Added

- **Auto-hide feature**: Keyboard automatically collapses to a thin bar when snapped to screen edges
- **Mouse hover expand/collapse**: Hover over the collapsed bar to expand the full keyboard, move away to collapse after 1 second
- **Single-row horizontal layout**: All keys arranged in a single horizontal row (90% of screen width)
- **Single-column vertical layout**: All keys arranged in a single vertical column (70% of screen height)
- **Automatic layout switching**: Dragging to top/bottom edges switches to horizontal layout; left/right edges switch to vertical layout
- **Responsive sizing**: Keyboard dimensions adapt to screen size using percentages
- **Edge snapping with drag-to-snap**: Drag keyboard near any edge to automatically snap to it
- **Smooth animations**: Expand and collapse transitions with opacity and size changes

### Changed

- Improved window positioning logic for better multi-monitor support
- Updated configuration UI with layout, position, and auto-hide settings
- Refactored IPC communication between main and renderer processes

### Fixed

- Window focus issues preventing input to target applications
- Keyboard layout rendering for both orientations
- Edge detection and snapping accuracy

## [0.1.0] - 2026-02-12

### Added

- Initial release of VibeCoding666
- Cross-platform on-screen keyboard (macOS, Windows, Linux)
- Customizable keys with configurable labels and input values
- System-level input simulation using robotjs
- Global shortcut (Ctrl/Cmd+Alt+K) to toggle visibility
- Configuration window for key customization
- Config import/export functionality
- Always-on-top overlay window with transparency support
- Basic horizontal keyboard layout with multiple rows

[0.2.0]: https://github.com/yourusername/vibecoding666/compare/v0.1.0...v0.2.0
[0.1.0]: https://github.com/yourusername/vibecoding666/releases/tag/v0.1.0
