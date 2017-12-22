#!/bin/sh
convert $1 -resize 320x200^ -extent 320x200 -resize 160x200 -ordered-dither o4x4,12   $1.png
node index2 -m c64Multicolor $1.png $1.prg
x64sc $1.prg
