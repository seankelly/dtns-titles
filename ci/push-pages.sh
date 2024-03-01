#!/bin/sh

set -eu

git switch gh-pages
cp -a pages/* .
rm -r pages

git config --global user.name 'GitHub Actions'
git config --global user.email 'seankelly@users.noreply.github.com'
git add .
if git diff --name-status | grep -q -E '^M' ; then
    git commit --message "Automatic title update"
    git push
fi
