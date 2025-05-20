#!/bin/bash
# Manual GitHub Pages deployment script

# Build the project
npm run build

# Create a new orphan branch
git checkout --orphan gh-pages-new

# Remove all files from staging
git rm -rf .

# Add just the built files
cp -r dist/* .

# Create special GitHub Pages files
touch .nojekyll

# Add all files to staging
git add .

# Commit the changes
git commit -m "Deploy to GitHub Pages"

# Force push to the gh-pages branch
git push -f origin gh-pages-new:gh-pages

# Return to original branch
git checkout -
git branch -D gh-pages-new

echo "Deployment complete!"