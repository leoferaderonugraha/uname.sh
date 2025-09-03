#!/bin/sh

npm run build &&
touch dist/.nojekyll &&
cp CNAME dist/ &&
git add -f dist &&
git commit -m "Build the latest version" &&
git push origin `git subtree split --prefix dist main`:gh-pages --force
