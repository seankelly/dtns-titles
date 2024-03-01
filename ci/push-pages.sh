#!/bin/sh

set -eux

git switch gh-pages
ls -l * pages
cp -a pages/* .
rm -r pages

git config --global user.name 'GitHub Actions'
git config --global user.email 'seankelly@users.noreply.github.com'
git add .
if git diff --name-only | grep -q . ; then
    git commit --message "Automatic title update"
    git push
fi
