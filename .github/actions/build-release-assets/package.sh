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

tar -zcf dist/theme-github-templates.tar.gz templates -C dist assets/js
tar -zcf dist/theme-github-fonts.tar.gz -C dist assets/fonts
