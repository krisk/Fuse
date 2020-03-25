#!/usr/bin/env bash
set -e

on_master_branch () {
  [[ $(git symbolic-ref --short -q HEAD) == "master" ]] && return 0
  return 1
}

if ! on_master_branch; then
  echo -e "\033[0;31mRefusing to release from non master branch.\033[0m"
  exit 1
fi

if [[ -z $1 ]]; then
  echo "Enter new version: "
  read -r VERSION
else
  VERSION=$1
fi

read -p "Releasing $VERSION - are you sure? (y/n) " -n 1 -r
echo

if [[ $REPLY =~ ^[Yy]$ ]]; then
  echo -e "\033[0;32mReleasing $VERSION...\033[0m"
  echo
  # Build
  VERSION=$VERSION npm run build

  ## Run tests
  echo -e "\033[0;32mRunning tests...\033[0m"
  npm run lint
  npm test

  # commit
  git add -A
  git add -f dist/*.js dist/*.ts
  git commit -m "Build $VERSION"

  # tag version
  npm version "$VERSION" --message "Release $VERSION"
  git push origin refs/tags/v"$VERSION"

  # Push to repo
  git push origin master

  # Publish
  npm publish
else
  echo -e "\033[0;31mCancelling...\033[0m"
fi