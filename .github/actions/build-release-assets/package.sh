#!/usr/bin/env bash
set -Eeuo pipefail

bun release

tar -zcf dist/theme-github-base.tar.gz \
  dist/theme-github-auto.css dist/theme-github-light.css dist/theme-github-dark.css dist/theme-github-soft-dark.css

tar -zcf dist/theme-github-colorblind-protanopia-deuteranopia.tar.gz dist/theme-github-colorblind-*.css
tar -zcf dist/theme-github-colorblind-tritanopia.tar.gz dist/theme-github-tritanopia-*.css

tar -zcf dist/theme-github-high-contrast-base.tar.gz \
  dist/theme-github-high-contrast-auto.css dist/theme-github-high-contrast-light.css \
  dist/theme-github-high-contrast-dark.css dist/theme-github-high-contrast-soft-dark.css

tar -zcf dist/theme-github-high-contrast-colorblind-protanopia-deuteranopia.tar.gz \
  dist/theme-github-high-contrast-colorblind-*.css
tar -zcf dist/theme-github-high-contrast-colorblind-tritanopia.tar.gz \
  dist/theme-github-high-contrast-tritanopia-*.css

tar -zcf dist/theme-github-extra-pink.tar.gz dist/theme-github-pink-*.css
tar -zcf dist/theme-github-extra-gitea.tar.gz dist/theme-github-gitea-*.css
tar -zcf dist/theme-github-extra-catppuccin.tar.gz dist/theme-github-catppuccin-*.css

tar -zcf dist/theme-github.tar.gz --remove-files dist/theme-github-*.css

tar -zcf dist/theme-github-templates.tar.gz templates
tar -zcf dist/theme-github-fonts.tar.gz -C dist assets/fonts
tar -zcf dist/theme-github-translations.tar.gz --remove-files dist/options
