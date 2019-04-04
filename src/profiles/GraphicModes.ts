import { ColorMap } from '../model/ColorMap';
import { PixelImage } from '../model/PixelImage';
import { GraphicMode } from '../profiles/GraphicMode';
import { Palettes } from './Palettes';

export class GraphicModes {
  // C64 modes {{{

  // TODO: GraphicMode is not factory but just property of PixelImage.

  // C64 standard multicolor mode
  public static c64Multicolor: GraphicMode = (() => {
    const result: GraphicMode = new GraphicMode(160, 200, Palettes.peptoPalette, function () {
      const pixelImage: PixelImage = new PixelImage(this);
      pixelImage.addColorMap();
      pixelImage.addColorMap(4, 8);
      pixelImage.addColorMap(4, 8);
      pixelImage.addColorMap(4, 8);
      return pixelImage;
    });
    result.pixelWidth = 2;
    return result;
  })();

  // C64 resolution and palette, but no attribute restrictions (not supported on real c64)
  public static c64MulticolorFake: GraphicMode = (() => {
    const result: GraphicMode = new GraphicMode(160, 200, Palettes.peptoPalette, function () {
      const pixelImage: PixelImage = new PixelImage(this);
      pixelImage.addColorMap(1, 1);
      return pixelImage;
    });
    result.pixelWidth = 2;
    return result;
  })();

  // C64 standard high resolution mode
  public static c64Hires: GraphicMode = new GraphicMode(
    320,
    200,
    Palettes.peptoPalette,
    function () {
      const pixelImage: PixelImage = new PixelImage(this);
      pixelImage.addColorMap(8, 8);
      pixelImage.addColorMap(8, 8);
      return pixelImage;
    }
  );

  // C64 resolution and palette, but no attribute restrictions (not supported on real c64)
  public static c64HiresFake: GraphicMode = new GraphicMode(
    320,
    200,
    Palettes.peptoPalette,
    function () {
      const pixelImage: PixelImage = new PixelImage(this);
      pixelImage.addColorMap(1, 1);
      return pixelImage;
    }
  );

  // C64 standard high resolution monochrome mode
  public static c64HiresMono: GraphicMode = new GraphicMode(
    320,
    200,
    Palettes.peptoPalette,
    function () {
      const pixelImage: PixelImage = new PixelImage(this);
      pixelImage.addColorMap();
      pixelImage.addColorMap();
      return pixelImage;
    }
  );

  // C64 FLI mode
  public static c64FLI: GraphicMode = (() => {
    const result: GraphicMode = new GraphicMode(160, 200, Palettes.peptoPalette, function () {
      const pixelImage: PixelImage = new PixelImage(this);
      pixelImage.addColorMap();
      pixelImage.addColorMap(4, 8);
      pixelImage.addColorMap(4, 1);
      pixelImage.addColorMap(4, 1);
      return pixelImage;
    });
    result.pixelWidth = 2;
    result.fliBugSize = 3 * 4;
    result.indexMap = {
      0: 0,
      1: 3,
      2: 2,
      3: 1
    };
    return result;
  })();

  // }}}

  // C64 AFLI mode
  public static c64AFLI: GraphicMode = (() => {
    const result: GraphicMode = new GraphicMode(320, 200, Palettes.peptoPalette, function () {
      const pixelImage: PixelImage = new PixelImage(this);
      pixelImage.addColorMap(8, 1);
      pixelImage.addColorMap(8, 1);
      return pixelImage;
    });
    result.fliBugSize = 3 * 8;
    return result;
  })();

  public static c64HiresSprites: GraphicMode = (() => {
    const result = new GraphicMode(8 * 24, 3 * 21, Palettes.peptoPalette, function () {
      const pixelImage: PixelImage = new PixelImage(this);
      // background
      pixelImage.colorMaps.push(new ColorMap(this.width, this.height, Palettes.peptoPalette));
      // foreground
      pixelImage.colorMaps.push(
        new ColorMap(this.width, this.height, Palettes.peptoPalette, 24, 21)
      );
      return pixelImage;
    });
    result.bytesPerCellRow = 3;
    result.rowsPerCell = 21;
    return result;
  })();

  public static c64TwocolorSprites: GraphicMode = (() => {
    const result = new GraphicMode(8 * 24, 3 * 21, Palettes.peptoPalette, function () {
      const pixelImage: PixelImage = new PixelImage(this);
      // background
      pixelImage.colorMaps.push(new ColorMap(this.width, this.height, Palettes.peptoPalette));
      // foreground
      pixelImage.colorMaps.push(new ColorMap(this.width, this.height, Palettes.peptoPalette));
      return pixelImage;
    });
    result.bytesPerCellRow = 3;
    result.rowsPerCell = 21;
    return result;
  })();

  public static c64MulticolorSprites: GraphicMode = (() => {
    const result: GraphicMode = new GraphicMode(
      (8 * 24) / 2,
      3 * 21,
      Palettes.peptoPalette,
      function () {
        const pixelImage: PixelImage = new PixelImage(this);
        // background
        pixelImage.colorMaps.push(new ColorMap(this.width, this.height, Palettes.peptoPalette));
        // d025
        pixelImage.colorMaps.push(new ColorMap(this.width, this.height, Palettes.peptoPalette));
        // d026
        pixelImage.colorMaps.push(new ColorMap(this.width, this.height, Palettes.peptoPalette));
        // d027..d02e
        pixelImage.colorMaps.push(
          new ColorMap(this.width, this.height, Palettes.peptoPalette, 24 / 2, 21)
        );
        return pixelImage;
      }
    );
    result.pixelWidth = 2;
    result.bytesPerCellRow = 3;
    result.rowsPerCell = 21;
    result.indexMap = {
      0: 0,
      1: 1,
      2: 3,
      3: 2
    };
    return result;
  })();

  public static c64ThreecolorSprites: GraphicMode = (() => {
    const result: GraphicMode = new GraphicMode(
      (8 * 24) / 2,
      3 * 21,
      Palettes.peptoPalette,
      function () {
        const pixelImage: PixelImage = new PixelImage(this);
        // background
        pixelImage.colorMaps.push(new ColorMap(this.width, this.height, Palettes.peptoPalette));
        // d025
        pixelImage.colorMaps.push(new ColorMap(this.width, this.height, Palettes.peptoPalette));
        // d026
        pixelImage.colorMaps.push(new ColorMap(this.width, this.height, Palettes.peptoPalette));
        // d027..d02e
        pixelImage.colorMaps.push(new ColorMap(this.width, this.height, Palettes.peptoPalette));
        return pixelImage;
      }
    );
    result.pixelWidth = 2;
    result.bytesPerCellRow = 3;
    result.rowsPerCell = 21;
    result.indexMap = {
      0: 0,
      1: 1,
      2: 3,
      3: 2
    };
    return result;
  })();

  public static spectrumStandard: GraphicMode = new GraphicMode(
    256,
    192,
    Palettes.spectrumPallete,
    function () {
      const pixelImage: PixelImage = new PixelImage(this);
      pixelImage.addColorMap(8, 8);
      pixelImage.addColorMap(8, 8);
      return pixelImage;
    }
  );

  public static all = {
    c64AFLI: GraphicModes.c64AFLI,
    c64FLI: GraphicModes.c64FLI,
    c64Hires: GraphicModes.c64Hires,
    c64HiresFake: GraphicModes.c64HiresFake,
    c64HiresMono: GraphicModes.c64HiresMono,
    c64HiresSprites: GraphicModes.c64HiresSprites,
    c64Multicolor: GraphicModes.c64Multicolor,
    c64MulticolorFake: GraphicModes.c64MulticolorFake,
    c64MulticolorSprites: GraphicModes.c64MulticolorSprites,
    c64ThreecolorSprites: GraphicModes.c64ThreecolorSprites,
    c64TwocolorSprites: GraphicModes.c64TwocolorSprites
  };
}
