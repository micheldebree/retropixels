# retropixels

A command line tool to convert images to c64 format.

![Input](miamivice.jpg)
![Output](miamivice.png)

## Installation

- Install [NodeJS](https://nodejs.org)
- Run ``npm install -g retropixels``

You now have a new shell command called ```retropixels```

### Usage

```bash
retropixels [options] <infile> <outfile>
```

With

- ```<infile>```: the image to convert
- ```<outfile>```: the converted image. Supported extentions are ```.png```, ```.prg``` and ```.kla```
- ```[options]```:
  - ```-m <mode>``` with ```<mode>```:
    - ```c64Multicolor``` (default)
    - ```c64Hires```
    - ```c64HiresMono```
    - ```c64FLI```
    - ```c64AFLI```

N.B. Only ```c64Multicolor``` mode supports saving as ```.prg```

#### ```<outfile>```

The format of the outfile depends on the file extension:

- ```.png```: A PNG image
- ```.kla```: A Koala Painter image, to be opened in Koala Painter on c64
- ```.prg```: A Commodore 64 executable

### Example

Convert an image to a Commodore 64 executable:

```bash
retropixels eye.jpg eye.prg
```

View the result by running it in the
[VICE](http://vice-emu.sourceforge.net) emulator:

```bash
x64 eye.prg
```

Optionally, to save some space and loading time,
you could "crunch" (compress) the resulting ```.prg``` file using
[exomizer](https://bitbucket.org/magli143/exomizer/wiki/Home):

```bash
exomizer sfx basic eye.prg -o eye-crunched.prg
```
The command line tool turns any image into a Commodore 64 Multicolor image.
It can produce an image, or an executable that can be
run on a real Commodore 64.

### Run the conversion tool with [Docker](https://www.docker.com)

The command line tool can be run with docker.
The only prerequisite for this is Docker itself:

```bash
docker run --rm -v "$PWD":/data micheldebree/retropixels-cli [options] <infile> <outfile>
```

The first time docker will download the image.
Be patient. Next time it will get it from your local cache.

## Build &amp; install locally

### Prerequisites

Sourcecode is compiled to Typescript using Gulp.

- [Git](https://git-scm.com)
- ```npm install -g typescript```
- ```npm install -g gulp-cli```

### Installation

- Clone or unzip this project

```bash
cd retropixels
npm install
gulp
npm install -g
```


### Uninstall

```bash
npm uninstall -g retropixels
```

## Changelog

### 0.2.0

- Library: ported to Typescript
- Conversion tool: support for graphicMode c64Hires

### 0.1.0

Initial version.
