# Contributing

Thanks for your interest in contributing to VibeCoding666.

## Development Setup

1. Fork and clone the repository.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the app:
   ```bash
   npm start
   ```

## Branch and Commit

- Create a feature branch from `main`.
- Keep commits focused and small.
- Use clear commit messages, for example:
  - `feat(renderer): add custom key validation`
  - `fix(main): handle robotjs init failure`

## Pull Requests

- Fill in the PR template.
- Include:
  - What changed
  - Why it changed
  - Manual test steps
- Update docs if behavior or commands changed.

## Code Style

- JavaScript style follows `AGENTS.md`:
  - 2-space indentation
  - Single quotes
  - No semicolons
- Prefer simple, readable changes over broad refactors.

## Testing

No formal test suite exists yet. Please run manual checks before submitting:

1. `npm start`
2. Verify keyboard window appears
3. Test key input in a text editor
4. Open settings window and save config
5. Test global shortcut `Ctrl/Cmd + Alt + K`
