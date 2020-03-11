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

on_master_branch () {
  [[ $(git symbolic-ref --short -q HEAD) == "master" ]] && return 0
  return 1
}

if ! on_master_branch; then
  echo -e "\033[0;31mRefusing to release from non master branch.\033[0m"
  exit 1
fi

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
