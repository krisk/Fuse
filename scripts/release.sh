#!/usr/bin/env sh

# Purpose: build and publish the the library.

# abort on errors
set -e

read -p "Do you want to create a release? (y/n) " -n 1 -r

echo

if [[ $REPLY =~ ^[Yy]$ ]]; then
  npx standard-version -a
else
  echo "\033[0;31mCancelling...\033[0m"
fi
