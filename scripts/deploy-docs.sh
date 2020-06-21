#!/usr/bin/env sh

# abort on errors
set -e

read -p "Do you want to publish the website? (y/n) " -n 1 -r

echo

if [[ $REPLY =~ ^[Yy]$ ]]; then
  # build
  npm run docs:build

  # navigate into the build output directory
  cd docs/.vuepress/dist

  echo 'fusejs.io' > CNAME

  git init
  git add -A
  git commit -m 'docs(site): publish site'

  git push -f git@github.com:krisk/fuse.git master:gh-pages

  echo "✅ Pushed to GitHub"
else
  echo "\033[0;31mCancelling...\033[0m"
fi
