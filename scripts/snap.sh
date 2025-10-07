#!/bin/bash

## ask user before process git clean and git reset
read -p "This will remove all uncommitted changes and reset the repository. Are you sure? (y/n): " confirm
if [[ "$confirm" != "y" ]]; then
  echo "Operation cancelled."
  exit 1
fi
# Backup gradle.properties
cp android/gradle.properties android/gradle.properties.backup
# Remove uncommitted changes
git reset --hard HEAD
# Restore gradle.properties
cp android/gradle.properties.backup android/gradle.properties
rm android/gradle.properties.backup

# Clean the repository
git clean -xfd \
  -e "*.env" \
  -e ".env.*" \
  -e .vscode/ \
  -e "*.keep" \
  -e "**/*.keystore" \
  -e "android/gradle.properties"
