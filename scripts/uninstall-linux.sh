#!/usr/bin/env bash
set -euo pipefail

APP_NAME='VibeCoding666'
PACKAGE_NAME='vibecoding666'

SYSTEM_PATHS=(
  '/opt/VibeCoding666'
  '/usr/share/applications/vibecoding666.desktop'
  '/usr/share/icons/hicolor/512x512/apps/vibecoding666.png'
)

USER_APP_PATHS=(
  "$HOME/.local/share/applications/vibecoding666.desktop"
  "$HOME/.local/share/icons/hicolor/512x512/apps/vibecoding666.png"
)

USER_DATA_PATHS=(
  "$HOME/.config/VibeCoding666"
  "$HOME/.cache/VibeCoding666"
  "$HOME/.local/share/VibeCoding666"
)

ask_yes_no() {
  local prompt="$1"
  while true; do
    read -r -p "$prompt [y/N]: " answer
    case "${answer:-}" in
      y|Y|yes|YES) return 0 ;;
      n|N|no|NO|'') return 1 ;;
      *) echo 'Please input y or n.' ;;
    esac
  done
}

remove_path() {
  local target="$1"
  if [ ! -e "$target" ]; then
    return
  fi

  if [ -w "$target" ] || [ -w "$(dirname "$target")" ]; then
    rm -rf "$target"
  else
    sudo rm -rf "$target"
  fi
  echo "Removed: $target"
}

echo "Uninstall tool for ${APP_NAME} (Linux)"

if command -v dpkg >/dev/null 2>&1 && dpkg -s "$PACKAGE_NAME" >/dev/null 2>&1; then
  if ask_yes_no "Detected Debian package ${PACKAGE_NAME}. Remove package first?"; then
    if command -v apt-get >/dev/null 2>&1; then
      sudo apt-get remove -y "$PACKAGE_NAME"
    else
      sudo dpkg -r "$PACKAGE_NAME"
    fi
  fi
fi

echo 'Removing application files...'
for target in "${SYSTEM_PATHS[@]}"; do
  remove_path "$target"
done
for target in "${USER_APP_PATHS[@]}"; do
  remove_path "$target"
done

if ask_yes_no 'Do you want to remove user data (settings and custom keys)?'; then
  echo 'Removing user data...'
  for target in "${USER_DATA_PATHS[@]}"; do
    remove_path "$target"
  done
else
  echo 'User data kept.'
fi

echo 'Done.'
