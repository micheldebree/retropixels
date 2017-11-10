import { ColorMap } from '../model/ColorMap';
import { Palette } from '../model/Palette';
import { PixelImage } from '../model/PixelImage';
import { GraphicMode } from '../profiles/GraphicMode';
import { Palettes } from './Palettes';

// C64 modes {{{

// TODO: GraphicMode is not factory but just property of PixelImage.

// C64 standard multicolor mode
export const c64Multicolor = new GraphicMode(160, 200, Palettes.peptoPalette, function() {
  const pixelImage = new PixelImage(this);
  pixelImage.addColorMap();
  pixelImage.addColorMap(4, 8);
  pixelImage.addColorMap(4, 8);
  pixelImage.addColorMap(4, 8);
  return pixelImage;
});
c64Multicolor.pixelWidth = 2;

// C64 resolution and palette, but no attribute restrictions (not supported on real c64)
export const c64MulticolorFake = new GraphicMode(160, 200, Palettes.peptoPalette, function() {
  const pixelImage = new PixelImage(this);
  pixelImage.addColorMap(1, 1);
  return pixelImage;
});
c64MulticolorFake.pixelWidth = 2;

// C64 standard high resolution mode
export const c64Hires = new GraphicMode(320, 200, Palettes.peptoPalette, function() {
  const pixelImage = new PixelImage(this);
  pixelImage.addColorMap(8, 8);
  pixelImage.addColorMap(8, 8);
  return pixelImage;
});

// C64 resolution and palette, but no attribute restrictions (not supported on real c64)
export const c64HiresFake = new GraphicMode(320, 200, Palettes.peptoPalette, function() {
  const pixelImage = new PixelImage(this);
  pixelImage.addColorMap(1, 1);
  return pixelImage;
});

// C64 standard high resolution monochrome mode
export const c64HiresMono = new GraphicMode(320, 200, Palettes.peptoPalette, function() {
  const pixelImage = new PixelImage(this);
  pixelImage.addColorMap();
  pixelImage.addColorMap();
  return pixelImage;
});

// C64 FLI mode
export const c64FLI = new GraphicMode(160, 200, Palettes.peptoPalette, function() {
  const pixelImage = new PixelImage(this);
  pixelImage.addColorMap();
  pixelImage.addColorMap(4, 8);
  pixelImage.addColorMap(4, 1);
  pixelImage.addColorMap(4, 1);
  return pixelImage;
});
c64FLI.pixelWidth = 2;
c64FLI.FLIBugSize = 12;
c64FLI.indexMap = {
  0: 0,
  1: 3,
  2: 2,
  3: 1
};

// }}}

// C64 AFLI mode
export const c64AFLI = new GraphicMode(320, 200, Palettes.peptoPalette, function() {
  const pixelImage = new PixelImage(this);
  pixelImage.addColorMap(8, 1);
  pixelImage.addColorMap(8, 1);
  return pixelImage;
});
c64AFLI.FLIBugSize = 12;

export const c64HiresSprites = new GraphicMode(8 * 24, 3 * 21, Palettes.peptoPalette, function() {
  const pixelImage = new PixelImage(this);
  // background
  pixelImage.colorMaps.push(new ColorMap(this.width, this.height, Palettes.peptoPalette));
  // foreground
  pixelImage.colorMaps.push(new ColorMap(this.width, this.height, Palettes.peptoPalette, 24, 21));
  return pixelImage;
});

export const c64MulticolorSprites = new GraphicMode(8 * 24 / 2, 3 * 21, Palettes.peptoPalette, function() {
  const pixelImage = new PixelImage(this);
  // background
  pixelImage.colorMaps.push(new ColorMap(this.width, this.height, Palettes.peptoPalette));
  // d025
  pixelImage.colorMaps.push(new ColorMap(this.width, this.height, Palettes.peptoPalette));
  // d026
  pixelImage.colorMaps.push(new ColorMap(this.width, this.height, Palettes.peptoPalette));
  // d027..d02e
  pixelImage.colorMaps.push(new ColorMap(this.width, this.height, Palettes.peptoPalette, 24 / 2 , 21));
  return pixelImage;
});
c64MulticolorSprites.pixelWidth = 2;

export const c64ThreecolorSprites = new GraphicMode(8 * 24 / 2, 3 * 21, Palettes.peptoPalette, function() {
  const pixelImage = new PixelImage(this);
  // background
  pixelImage.colorMaps.push(new ColorMap(this.width, this.height, Palettes.peptoPalette));
  // d025
  pixelImage.colorMaps.push(new ColorMap(this.width, this.height, Palettes.peptoPalette));
  // d026
  pixelImage.colorMaps.push(new ColorMap(this.width, this.height, Palettes.peptoPalette));
  // d027..d02e
  pixelImage.colorMaps.push(new ColorMap(this.width, this.height, Palettes.peptoPalette));
  return pixelImage;
});
c64MulticolorSprites.pixelWidth = 2;

export const spectrumStandard = new GraphicMode(256, 192, Palettes.spectrumPallete, function() {
  const pixelImage = new PixelImage(this);
  pixelImage.addColorMap(8, 8);
  pixelImage.addColorMap(8, 8);
  return pixelImage;
});

export const pyssla = new GraphicMode(116, 116, Palettes.pysslaPalette1, function() {
  const pixelImage = new PixelImage(this);
  pixelImage.addColorMap(4, 4);

  return pixelImage;
});
pyssla.pixelWidth = 4;
pyssla.pixelHeight = 4;

export const all = {
  c64Multicolor,
  c64MulticolorFake,
  c64Hires,
  c64HiresMono,
  c64HiresFake,
  c64HiresSprites,
  c64MulticolorSprites,
  c64ThreecolorSprites,
  c64FLI,
  c64AFLI,
  spectrumStandard,
  pyssla
};
