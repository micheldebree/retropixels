#!/bin/sh
# Make scaled, square version with transparent background
convert -background none -resize "$1x$1" -extent "$1x$1" -gravity center src/logo.svg "public/logo-$1.png"
optipng -o7 "public/logo-$1.png"

