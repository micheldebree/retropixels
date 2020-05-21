# retropixels

A cross platform command line tool to convert images to Commodore 64 format.

## Summary

![Input](paintface.jpg)

`retropixels paintface.jpg paintface.png`

![Output](samples/paintface-Multicolor.png)

## Installation

Note: you do **not** need to download retropixels to install it. The `npm` command
below will do that for you.

- Install [NodeJS](https://nodejs.org)
- Run `npm install -g retropixels`

You now have a new shell command called `retropixels`

## Usage

```sh
retropixels [options] <infile> <outfile>
```

With

- `<infile>`: the image to convert
- `<outfile>`: the converted image. The extension determines the format:
  - `<outfile>.png` produces a PNG file
  - `<outfile>.kla` produces a Koala Painter file
    (only supported for c64Multicolor mode)
  - `<outfile>.prg` produces a Commodore 64 executable
- `[options]`:
  - `-m <mode>` with `<mode>`:
    - `c64Multicolor` (default)
    - `c64Hires`
    - `c64HiresMono`
    - `c64FLI`
    - `c64AFLI`
  - `-d <ditherMode>` with `<ditherMode>`:
    - `bayer2x2`
    - `bayer4x4` (default)
    - `bayer8x8`
  - `-r <ditherRadius>` with `<ditherRadius>`:
    - A number between 0 (no dithering) and 64 (heavy dithering). Default is 32.
  - `-p <palette>` with `<palette>`:
    - `colodore` (default)
    - `pepto`
    - `deekay`
  - `-c <colorspace>` with `<colorspace>`:
    - `xyz` (default)
    - `yuv`
    - `rainbow`
    - `rgb` (no conversion)

Notes:

- The FLI/AFLI display code was found on [codebase64.org](http://codebase64.org/doku.php?id=base:fli_displayer)
- FLI/AFLI modes result in an issue with the leftmost 3 characters on
  each row being unusable.
  You will see a blank space in the image. This is a limitation of the
  Commodore 64 VIC chip hacking
  involved in creating this artificial mode, and is not a bug in retropixels

## Example

Convert an image to a Commodore 64 executable:

```sh
retropixels -b bayer8x8 -r 64 eye.jpg eye.prg
```

View the result by running it in the
[VICE](http://vice-emu.sourceforge.net) emulator:

```sh
x64 eye.prg
```

## Uninstall

```sh
npm uninstall -g retropixels
```

## Development

The build process has been tested on macOS.
It should work on other platforms but you're on your own there.

### Prerequisites

- [Git](https://git-scm.com)
- [NodeJS](https://nodejs.org) (latest LTE version)
- [Yarn](https://yarnpkg.com/en/docs/install#mac-stable)
- GNU make

### Build

```sh
git clone https://github.com/micheldebree/retropixels.git
cd retropixels
make
```

Run with `node cli.js [options] <infile> <outfile>`

## Changelog

### 0.7.0

#### Added

- [#35](https://github.com/micheldebree/retropixels/issues/35):
  `--palette` argument to choose a color palette. New default is `colodore`.
- [#36](https://github.com/micheldebree/retropixels/issues/36):
  `--colorspace` argument to choose the color space to convert to before
  quantizing. New default is `xyz`.

#### Changed

- Default color palette changed from Pepto to Colodore. You can still chose
  `pepto` with the new `--palette` argument.
- Default color space conversion changed from YUV to XYZ. You can still choose
  `yuv` with the new `--colorspace` argument.

#### Removed

- `--unicorn` argument. It is replaced by the `rainbow` option in the new `-colorspace`
  argument. It is a secret option so don't tell anyone!

### 0.6.4

Changed:

- [#31](https://github.com/micheldebree/retropixels/issues/31):
  More developer friendly importing of library.

### 0.6.3

Changed:

- [#28](https://github.com/micheldebree/retropixels/issues/28):
  Replaced ACME compiler with c64jasm to support JS only build.

### 0.6.2

Added:

- Unicorn mode

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
