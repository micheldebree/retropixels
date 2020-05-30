import PixelImage from '../model/PixelImage';
import GraphicMode from './GraphicMode';
import GraphicModeFactory from './GraphicModeFactory';
import Palette from '../model/Palette';

export default class GraphicModes {
  // C64 modes {{{

  public static c64Multicolor: GraphicModeFactory = new GraphicModeFactory(
    (palette: Palette): PixelImage => {
      const gm: GraphicMode = new GraphicMode('c64Multicolor', 160, 200, palette);
      gm.pixelWidth = 2;

      const result = new PixelImage(gm);
      result.addColorMap();
      result.addColorMap(4, 8);
      result.addColorMap(4, 8);
      result.addColorMap(4, 8);
      return result;
    }
  );

  public static c64Hires: GraphicModeFactory = new GraphicModeFactory(
    (palette: Palette): PixelImage => {
      const gm: GraphicMode = new GraphicMode('c64Hires', 320, 200, palette);
      const result = new PixelImage(gm);
      result.addColorMap(8, 8);
      result.addColorMap(8, 8);
      return result;
    }
  );

  public static c64HiresMono: GraphicModeFactory = new GraphicModeFactory(
    (palette: Palette): PixelImage => {
      const gm: GraphicMode = new GraphicMode('c64HiresMono', 320, 200, palette);
      const result = new PixelImage(gm);
      result.addColorMap();
      result.addColorMap();
      return result;
    }
  );

  public static c64FLI: GraphicModeFactory = new GraphicModeFactory(
    (palette: Palette): PixelImage => {
      const gm: GraphicMode = new GraphicMode('c64FLI', 160, 200, palette);
      gm.pixelWidth = 2;
      gm.fliBugSize = 3 * 4;
      gm.indexMap = {
        0: 0,
        1: 3,
        2: 2,
        3: 1
      };
      const result = new PixelImage(gm);
      result.addColorMap();
      result.addColorMap(4, 8);
      result.addColorMap(4, 1);
      result.addColorMap(4, 1);
      return result;
    }
  );

  public static c64AFLI: GraphicModeFactory = new GraphicModeFactory(
    (palette: Palette): PixelImage => {
      const gm: GraphicMode = new GraphicMode('c64AFLI', 320, 200, palette);
      gm.fliBugSize = 3 * 8;
      const result = new PixelImage(gm);
      result.addColorMap(8, 1);
      result.addColorMap(8, 1);
      return result;
    }
  );

  // public static c64HiresSprites: GraphicMode = ((): GraphicMode => {
  // const result = new GraphicMode(8 * 24, 3 * 21, Palettes.peptoPalette, function () {
  // const pixelImage: PixelImage = new PixelImage(this);
  // background
  // pixelImage.colorMaps.push(new ColorMap(this.width, this.height, Palettes.peptoPalette));
  // foreground
  // pixelImage.colorMaps.push(new ColorMap(this.width, this.height, Palettes.peptoPalette, 24, 21));
  // return pixelImage;
  // });
  // result.bytesPerCellRow = 3;
  // result.rowsPerCell = 21;
  // return result;
  // })();

  // public static c64TwocolorSprites: GraphicMode = ((): GraphicMode => {
  // const result = new GraphicMode(8 * 24, 3 * 21, Palettes.peptoPalette, function () {
  // const pixelImage: PixelImage = new PixelImage(this);
  // background
  // pixelImage.colorMaps.push(new ColorMap(this.width, this.height, Palettes.peptoPalette));
  // foreground
  // pixelImage.colorMaps.push(new ColorMap(this.width, this.height, Palettes.peptoPalette));
  // return pixelImage;
  // });
  // result.bytesPerCellRow = 3;
  // result.rowsPerCell = 21;
  // return result;
  // })();

  // public static c64MulticolorSprites: GraphicMode = ((): GraphicMode => {
  // const result: GraphicMode = new GraphicMode((8 * 24) / 2, 3 * 21, Palettes.peptoPalette, function () {
  // const pixelImage: PixelImage = new PixelImage(this);
  // background
  // pixelImage.colorMaps.push(new ColorMap(this.width, this.height, Palettes.peptoPalette));
  // d025
  // pixelImage.colorMaps.push(new ColorMap(this.width, this.height, Palettes.peptoPalette));
  // d026
  // pixelImage.colorMaps.push(new ColorMap(this.width, this.height, Palettes.peptoPalette));
  // d027..d02e
  // pixelImage.colorMaps.push(new ColorMap(this.width, this.height, Palettes.peptoPalette, 24 / 2, 21));
  // return pixelImage;
  // });
  // result.pixelWidth = 2;
  // result.bytesPerCellRow = 3;
  // result.rowsPerCell = 21;
  // result.indexMap = {
  // 0: 0,
  // 1: 1,
  // 2: 3,
  // 3: 2
  // };
  // return result;
  // })();

  // public static c64ThreecolorSprites: GraphicMode = ((): GraphicMode => {
  // const result: GraphicMode = new GraphicMode((8 * 24) / 2, 3 * 21, Palettes.peptoPalette, function () {
  // const pixelImage: PixelImage = new PixelImage(this);
  // background
  // pixelImage.colorMaps.push(new ColorMap(this.width, this.height, Palettes.peptoPalette));
  // d025
  // pixelImage.colorMaps.push(new ColorMap(this.width, this.height, Palettes.peptoPalette));
  // d026
  // pixelImage.colorMaps.push(new ColorMap(this.width, this.height, Palettes.peptoPalette));
  // d027..d02e
  // pixelImage.colorMaps.push(new ColorMap(this.width, this.height, Palettes.peptoPalette));
  // return pixelImage;
  // });
  // result.pixelWidth = 2;
  // result.bytesPerCellRow = 3;
  // result.rowsPerCell = 21;
  // result.indexMap = {
  // 0: 0,
  // 1: 1,
  // 2: 3,
  // 3: 2
  // };
  // return result;
  // })();

  // public static spectrumStandard: GraphicMode = new GraphicMode(256, 192, Palettes.spectrumPallete, function () {
  // const pixelImage: PixelImage = new PixelImage(this);
  // pixelImage.addColorMap(8, 8);
  // pixelImage.addColorMap(8, 8);
  // return pixelImage;
  // });

  public static all = {
    c64AFLI: GraphicModes.c64AFLI,
    c64FLI: GraphicModes.c64FLI,
    c64Hires: GraphicModes.c64Hires,
    c64HiresMono: GraphicModes.c64HiresMono,
    c64Multicolor: GraphicModes.c64Multicolor
  };
}
