#!/usr/bin/env bash
set -e

if [[ -z $1 ]]; then
  echo "Enter new version: "
  read -r VERSION
else
  VERSION=$1
fi

PS3='Please enter your choice: '
options=("latest" "beta" "alpha")
select opt in "${options[@]}"
do
  case $opt in
    "latest")
      break
      ;;
    "beta")
      RELEASE_TAG='beta'
      break
      ;;
    "alpha")
      RELEASE_TAG='alpha'
      break
      ;;
    *) echo "invalid option $REPLY";;
  esac
done

if [[ -z $RELEASE_TAG ]]; then
  read -p "Releasing $VERSION (latest) - are you sure? (y/n) " -n 1 -r
else
  read -p "Releasing $VERSION ($RELEASE_TAG) - are you sure? (y/n) " -n 1 -r
fi

echo

if [[ $REPLY =~ ^[Yy]$ ]]; then
  echo -e "\033[0;32mReleasing $VERSION...\033[0m"
  echo
  # Build
  VERSION=$VERSION npm run build

  ## Run tests
  echo -e "\033[0;32mRunning tests...\033[0m"
  npm run lint
  npm test 2>/dev/null

  # commit
  echo -e "\033[0;32mCommitting...\033[0m"
  git add -A
  git add -f dist/*.js dist/*.ts
  git commit -m "Build $VERSION"

  # tag version
  npm version "$VERSION" --message "Release $VERSION"
  git push origin refs/tags/v"$VERSION"

  # Push to repo
  git push origin HEAD

  # Publish
  if [[ -z $RELEASE_TAG ]]; then
    npm publish
  else
    npm publish --tag "$RELEASE_TAG"
  fi
else
  echo -e "\033[0;31mCancelling...\033[0m"
fi