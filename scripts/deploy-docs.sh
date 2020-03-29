#!/usr/bin/env sh

# abort on errors
set -e

# build
npm run docs:build

# navigate into the build output directory
cd docs/.vuepress/dist

echo 'fusejs.io' > CNAME

git init
git add -A
git commit -m 'deploy'

git push -f git@github.com:krisk/fuse.git master:gh-pages
