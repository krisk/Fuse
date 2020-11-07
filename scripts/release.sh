#!/usr/bin/env sh

# abort on errors
set -e

read -p "Do you want to create a release? (y/n) " -n 1 -r

echo

if [[ $REPLY =~ ^[Yy]$ ]]; then
  npm run standard-version -a
else
  echo "\033[0;31mCancelling...\033[0m"
fi
