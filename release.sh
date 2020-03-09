#!/usr/bin/env bash

version='';
re="\"(version)\": \"([^\"]*)\"";

while read -r l; do
  if [[ $l =~ $re ]]; then
    value="${BASH_REMATCH[2]}";
    version="$value";
  fi
done < package.json;

echo $version;

read -e -p "Are you sure you want to release? " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
  echo -e "\033[0;32mReleasing...\033[0m"
  echo
  yarn build
  git commit -a -m "Build version $version"
  git tag -a v$version -m "Version $version"
  git push origin master
  git push --tags

  npm publish
else
  echo -e "\033[0;31mCancelling...\033[0m"
fi
