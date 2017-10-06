# retropixels

A cross platform command line tool to convert images to c64 format.

## Summary

![Input](paintface.jpg)

``retropixels paintface.jpg paintface.png``

![Output](paintface.png)

## For users

### Installation

- Install [NodeJS](https://nodejs.org)
- Run ``npm install -g retropixels``

You now have a new shell command called ``retropixels``

### Usage

```bash
retropixels [options] <infile> <outfile>
```

With

- ``<infile>``: the image to convert
- ``<outfile>``: the converted image. The extension determines the format:
    - ``<outfile>.png`` produces a PNG file.
    - ``<outfile>.kla`` produces a Koala Painter file (only supported for c64Multicolor mode)
    - ``<outfile>.prg`` produces a Commodore 64 executable (only supported for c64Multicolor mode)
- ``[options]``:
  - ``-m <mode>`` with ``<mode>``:
    - ``c64Multicolor`` (default)
    - ``c64Hires``
    - ``c64HiresMono``
    - ``c64FLI``
    - ``c64AFLI``
  - ``-d <ditherMode>`` with ``<ditherMode>``:
      - ``bayer2x2``
      - ``bayer4x4`` (default)
      - ``bayer8x8``
  - ``-r <ditherRadius>`` with ``ditherRadius``:
      - A number between 0 (no dithering) and 64 (heavy dithering). Default is 32.

### Example

Convert an image to a Commodore 64 executable:

```bash
retropixels -b bayer8x8 -r 64 eye.jpg eye.prg
```

View the result by running it in the
[VICE](http://vice-emu.sourceforge.net) emulator:

```bash
x64 eye.prg
```

### Uninstall

```bash
npm uninstall -g retropixels
```

## For developers

The build process has been tested on macOS. It should work on other platforms but you're on your own there.

### Prerequisites

- [NodeJS](https://nodejs.org) (latest LTE version)
- [Git](https://git-scm.com)
- GCC
- GNU make

#### Build

- Clone or unzip this project

```bash
cd retropixels
npm install -g typescript@2.3.3
npm install
make
```

Run with ``node index.js [options] <infile> <outfile>``

### Build Docker image

```bash
docker build -t micheldebree/retropixels-cli .
```

### Run the conversion tool with [Docker](https://www.docker.com)

The command line tool can be run with docker.
The only prerequisite for this is Docker itself:

```bash
docker run --rm -v "$PWD":/data micheldebree/retropixels-cli [options] <infile> <outfile>
```

The first time docker will download the image.
Be patient. Next time it will get it from your local cache.

## Changelog

### 0.3.1

Internal refactoring.

### 0.3.0

- Dithering options added:
  - ditherMode
  - ditherRadius

### 0.2.2

Optimized dithering, with better default setting.

### 0.2.1

- Fixes in ``README.md``

### 0.2.0

- Library: ported to Typescript
- Conversion tool: support for graphicMode c64Hires

### 0.1.0

Initial version.
