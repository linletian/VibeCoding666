#!/usr/bin/env bash
set -euo pipefail

APP_NAME='VibeCoding666'
APP_BUNDLE="${APP_NAME}.app"
APP_PATHS=(
  "/Applications/${APP_BUNDLE}"
  "$HOME/Applications/${APP_BUNDLE}"
)

DATA_PATHS=(
  "$HOME/Library/Application Support/${APP_NAME}"
  "$HOME/Library/Caches/com.vibecoding666.app"
  "$HOME/Library/Preferences/com.vibecoding666.app.plist"
  "$HOME/Library/Saved Application State/com.vibecoding666.app.savedState"
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
  if [ -e "$target" ]; then
    rm -rf "$target"
    echo "Removed: $target"
  fi
}

echo "Uninstall tool for ${APP_NAME} (macOS)"

echo 'Removing application files...'
app_removed=0
for app_path in "${APP_PATHS[@]}"; do
  if [ -e "$app_path" ]; then
    rm -rf "$app_path"
    echo "Removed: $app_path"
    app_removed=1
  fi
done

if [ "$app_removed" -eq 0 ]; then
  echo 'No application bundle found in default locations.'
fi

if ask_yes_no 'Do you want to remove user data (settings and custom keys)?'; then
  echo 'Removing user data...'
  for data_path in "${DATA_PATHS[@]}"; do
    remove_path "$data_path"
  done
else
  echo 'User data kept.'
fi

echo 'Done.'
