# retropixels
A Javascript library for applying graphic mode limitations of retro computers on images.
Also contains a command line conversion tool which demonstrates the use of the library.

## Library

The library uses the CommonJS module format. It is not documented except for the comments in the code itself.

## Conversion tool

The command line tool turns any image into a Commodore 64 Multicolor image. 
It can produce an image, or an executable that can be run on a real Commodore 64.

### Prerequisites

The following must be installed and callable from the command line:

- [Git](https://git-scm.com)
- [NodeJS](https://nodejs.org)

### Installation
- Clone or unzip this project
- From the project root:
  - ```npm install -g```

You now have a new shell command called ```retropixels```  
  
### Usage

    retropixels <infile> <outfile>

With
- ```<infile>```: the image to convert
- ```<outfile>```: the converted image. Supported extentions are ```.png```, ```.prg``` and ```.kla```

#### ```<outfile>```

The format of the outfile depends on the file extension:
- ```.png```: A PNG image
- ```.kla```: A Koala Painter image, to be opened in Koala Painter on c64
- ```.prg```: A Commodore 64 executable

### Example

Convert an image to a Commodore 64 executable:

    retropixels eye.jpg eye.prg
    
View the result by running it in the [VICE](http://vice-emu.sourceforge.net) emulator:
    
    x64 eye.prg
    
Optionally, to save some space and loading time, you could "crunch" (compress) the resulting ```.prg``` file using [exomizer](https://bitbucket.org/magli143/exomizer/wiki/Home):

    exomizer sfx basic eye.prg -o eye-crunched.prg


### Uninstall

        npm uninstall -g retropixels
