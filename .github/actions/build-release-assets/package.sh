#!/usr/bin/env bash
set -Eeuo pipefail

bun release

(
  cd dist
  tar -zcf theme-github-base.tar.gz \
    theme-github-auto.css theme-github-light.css theme-github-dark.css theme-github-soft-dark.css
)

(
  cd dist
  tar -zcf theme-github-accessibility.tar.gz \
    theme-github-colorblind-*.css theme-github-tritanopia-*.css \
    theme-github-high-contrast-*.css
)

(
  cd dist
  tar -zcf theme-github-extras.tar.gz \
    theme-github-pink-*.css theme-github-gitea-*.css theme-github-catppuccin-*.css
)

# Template assets must extract beside templates under the documented custom root.
# Keep page-specific styles out of theme packs; they are required by the templates.
template_stage=$(mktemp -d)
trap 'rm -rf "$template_stage"' EXIT
mkdir -p "$template_stage/public/assets/css" "$template_stage/public/assets/js"
cp -R templates "$template_stage/templates"
cp -R dist/assets/js/. "$template_stage/public/assets/js/"
for stylesheet in dist/*.css; do
  case "${stylesheet##*/}" in
    theme-*) ;;
    *) cp "$stylesheet" "$template_stage/public/assets/css/" ;;
  esac
done
tar -zcf dist/theme-github-templates.tar.gz -C "$template_stage" templates public
tar -zcf dist/theme-github-fonts.tar.gz -C dist assets/fonts
