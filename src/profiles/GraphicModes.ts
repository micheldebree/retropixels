import PixelImage from '../model/PixelImage';
import GraphicMode from './GraphicMode';
import GraphicModeFactory from './GraphicModeFactory';
import Palette from '../model/Palette';

export default class GraphicModes {
  // C64 modes {{{

  public static bitmap: GraphicModeFactory = new GraphicModeFactory(
    (palette: Palette, props: Record<string, unknown>): PixelImage => {
      const { multicolor, nomaps } = props;
      const width = multicolor ? 160 : 320;

      const gm: GraphicMode = new GraphicMode('bitmap', width, 200, palette);
      gm.pixelWidth = multicolor ? 2 : 1;

      const result = new PixelImage(gm);
      if (multicolor) {
        // background
        result.addColorMap();
      }
      if (nomaps) {
        result.addColorMap();
        result.addColorMap();
        if (multicolor) {
          result.addColorMap();
        }
      } else {
        result.addColorMap(gm.pixelsPerByte(), gm.rowsPerCell);
        result.addColorMap(gm.pixelsPerByte(), gm.rowsPerCell);
        if (multicolor) {
          result.addColorMap(gm.pixelsPerByte(), gm.rowsPerCell);
        }
      }
      return result;
    }
  );

  // public static c64Multicolor: GraphicModeFactory = new GraphicModeFactory(
  //   (palette: Palette): PixelImage => {
  //     const gm: GraphicMode = new GraphicMode('c64Multicolor', 160, 200, palette);
  //     gm.pixelWidth = 2;

  //     const result = new PixelImage(gm);
  //     result.addColorMap();
  //     result.addColorMap(4, 8);
  //     result.addColorMap(4, 8);
  //     result.addColorMap(4, 8);
  //     return result;
  //   }
  // );

  // public static c64Hires: GraphicModeFactory = new GraphicModeFactory(
  //   (palette: Palette): PixelImage => {
  //     const gm: GraphicMode = new GraphicMode('c64Hires', 320, 200, palette);
  //     const result = new PixelImage(gm);
  //     result.addColorMap(8, 8);
  //     result.addColorMap(8, 8);
  //     return result;
  //   }
  // );

  // public static c64HiresMono: GraphicModeFactory = new GraphicModeFactory(
  //   (palette: Palette): PixelImage => {
  //     const gm: GraphicMode = new GraphicMode('c64HiresMono', 320, 200, palette);
  //     const result = new PixelImage(gm);
  //     result.addColorMap();
  //     result.addColorMap();
  //     return result;
  //   }
  // );

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

  public static c64Sprites: GraphicModeFactory = new GraphicModeFactory(
    (palette: Palette, props: Record<string, unknown>): PixelImage => {
      const { rows, columns, multicolor, nomaps } = props;
      const nrRows = Number(rows);
      const nrColumns = Number(columns);

      const pixelsPerColumn = multicolor ? 12 : 24;

      const height: number = nrRows * 21;
      const width: number = nrColumns * pixelsPerColumn;

      const gm: GraphicMode = new GraphicMode('c64Sprites', width, height, palette);
      gm.pixelWidth = multicolor ? 2 : 1;
      gm.bytesPerCellRow = 3;
      gm.rowsPerCell = 21;
      gm.indexMap = {
        0: 0,
        1: 1,
        2: 3,
        3: 2
      };

      const result = new PixelImage(gm);
      // background
      result.addColorMap();
      if (multicolor) {
        // d025
        result.addColorMap();
        // d026
        result.addColorMap();
      }
      // d027..d02e
      if (nomaps) {
        result.addColorMap();
      } else {
        result.addColorMap(pixelsPerColumn, 21);
      }
      return result;
    }
  );

  public static all = {
    bitmap: GraphicModes.bitmap,
    c64AFLI: GraphicModes.c64AFLI,
    c64FLI: GraphicModes.c64FLI,
    c64Sprites: GraphicModes.c64Sprites
  };
}
