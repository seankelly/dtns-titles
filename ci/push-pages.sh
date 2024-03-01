#!/bin/sh

set -eu

git switch gh-pages
cp -a pages/* .
rm -r pages

git config --global user.name 'GitHub Actions'
git config --global user.email 'seankelly@users.noreply.github.com'
if ! git diff-index --quiet HEAD ; then
    git add .
    git commit --message "Automatic title update"
    git push
fi
