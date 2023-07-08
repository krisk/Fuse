#!/usr/bin/env sh

# Purpose: build and publish the doumentation (https://fusejs.io)

# abort on errors
set -e

read -p "Do you want to publish the website? (y/n) " -n 1 -r

echo

if [[ $REPLY =~ ^[Yy]$ ]]; then
  # bump
  echo "Updating Fuse.js version"
  npm run docs:bump

  # build
  echo "Building docs"
  npm run docs:build

  echo "Publishing"
  # navigate into the build output directory
  cd docs/.vuepress/dist

  echo 'www.fusejs.io' > CNAME

  git init
  git add -A
  git commit -m 'docs(site): publish site'

  git push -f git@github.com:krisk/Fuse.git main:gh-pages

  echo "✅ Pushed to GitHub"
else
  echo "\033[0;31mCancelling...\033[0m"
fi
