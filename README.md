# retropixels

Convert images to Commodore 64 format.

This is intended primarily for:

- Commodore 64 developers who want to convert an image to graphics data
  for use in a Commodore 64 production.
- Commodore 64 pixel artists who want to use an existing image as a starting
  point.
- People who like the Commodore 64 graphics esthetics and want to apply them to
  an image.

To use retropixels, check out the [retropixels, the command line tool](cli/README.md)

## Development

See [DEVELOPMENT.md](DEVELOPMENT.md)

## Changelog

### 0.8.5

- Changed: Significantly improved conversion speed
- Changed: (Internal) Split package into the command line tool (`retropixels`)
  and core functionality (`retropixels-core`).

### 0.8.1

- Fixed [[#53](https://github.com/micheldebree/retropixels/issues/53)]
  multicolor PNG output is not pixel-perfect (Thanks to Rob for reporting)

### 0.8.0

This is a **backwards incompatible** release.

- Added [#26](https://github.com/micheldebree/retropixels/issues/26) `sprites` mode.
  - `--mode: sprites`
  - `--cols`: number of sprites in horizontal direction.
  - `--rows`: number of sprites in vertical direction.
- Added [#44](https://github.com/micheldebree/retropixels/issues/44) save
  hires bitmaps to Art Studio format
- Changed all the options for `--mode`. `c64Multicolor`, `c64Hires` and
  `c64HiresMono` are now `bitmap` mode. `c64FLI` and `c64AFLI` are now `fli`.
- Added option `--hires` for hires images. Default when not
  supplied is multicolor images.
- Added [#43](https://github.com/micheldebree/retropixels/issues/43) option
  `--format` for outputting the special `png` and `prg` formats.
- Added option `--nomaps` for limiting attribute maps to one single color.
- Added option `--scale none` to disable rescaling of the input image.
  Default behaviour is `--scale fill`
- Added option `--outfile` for setting output filename.
- Changed automatically overwriting of output file
  Added option `--overwrite` to force overwriting output file.

### 0.7.2

- Fixed [#37](https://github.com/micheldebree/retropixels/issues/37):
  Unfriendly error message when file not found
- Changed [#38](https://github.com/micheldebree/retropixels/issues/38):
  Improve performance of quantizing

### 0.7.1

- Changed [#15](https://github.com/micheldebree/retropixels/issues/15): Default color
  palette changed from Pepto to Colodore. You can still chose `pepto` with the
  new `--palette` argument.
- Changed default color space conversion changed from YUV to XYZ. You can still choose
  `yuv` with the new `--colorspace` argument.
- Added [#35](https://github.com/micheldebree/retropixels/issues/35):
  `--palette` argument to choose a color palette. New default is `colodore`.
- Added [#36](https://github.com/micheldebree/retropixels/issues/36):
  `--colorspace` argument to choose the color space to convert to before
  quantizing. New default is `xyz`.
- Removed `--unicorn` argument. It is replaced by the `rainbow` option in the
  new `-colorspace` argument. It is a secret option so don't tell anyone!

### 0.6.4

- Changed [#31](https://github.com/micheldebree/retropixels/issues/31):
  More developer friendly importing of library.

### 0.6.3

- Changed [#28](https://github.com/micheldebree/retropixels/issues/28):
  Replaced ACME compiler with c64jasm to support JS only build.

### 0.6.2

- Added Unicorn mode

### 0.6.1

Fixes:

- [#25](https://github.com/micheldebree/retropixels/issues/25):
  Koala export is broken. (Thanks to Alex Goldblat for reporting this)

### 0.6.0

Features:

- [#19](https://github.com/micheldebree/retropixels/issues/19):
  Undocumented fake modes.

Fixes:
[#21](https://github.com/micheldebree/retropixels/issues/21),
[#23](https://github.com/micheldebree/retropixels/issues/23)

### 0.5.2

Bugfix:

- [#22](https://github.com/micheldebree/retropixels/issues/22)
  Fixed small dithering bug.

### 0.5.1

Internal refactoring.

### 0.5.0

All modes now support saving as Commodore 64 executable (.prg)

- [#3](https://github.com/micheldebree/retropixels/issues/3)
  Export PRG for c64Hires mode
- [#4](https://github.com/micheldebree/retropixels/issues/4)
  Export PRG for c64FLI mode
- [#18](https://github.com/micheldebree/retropixels/issues/18)
  Export PRG for c64AFLI mode

### 0.4.1

- [#16](https://github.com/micheldebree/retropixels/issues/16)
  Fixed suboptimal FLI color optimization
- [#17](https://github.com/micheldebree/retropixels/issues/17)
  Made FLI bug visible in PNG export

### 0.4.0

- Export FLI executable.
- Internal refactoring.

### 0.3.0

Dithering options added:

- ditherMode
- ditherRadius

### 0.2.2

Optimized dithering, with better default setting.

### 0.2.1

- Fixes in `README.md`

### 0.2.0

- Library: ported to Typescript
- Conversion tool: support for graphicMode c64Hires

### 0.1.0

Initial version.
