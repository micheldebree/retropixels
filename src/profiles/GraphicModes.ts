import PixelImage from '../model/PixelImage';
import GraphicMode from './GraphicMode';
import GraphicModeFactory from './GraphicModeFactory';

export default class GraphicModes {
  // C64 modes {{{

  public static bitmap: GraphicModeFactory = new GraphicModeFactory(
    (props: Record<string, unknown>): PixelImage => {
      const { hires, nomaps } = props;
      const width = hires ? 320 : 160;

      const gm: GraphicMode = new GraphicMode('bitmap', width, 200);
      gm.pixelWidth = hires ? 1 : 2;

      const result = new PixelImage(gm);
      if (!hires) {
        // background
        result.addColorMap();
      }
      if (nomaps) {
        result.addColorMap();
        result.addColorMap();
        if (!hires) {
          result.addColorMap();
        }
      } else {
        result.addColorMap(gm.pixelsPerByte(), gm.rowsPerCell);
        result.addColorMap(gm.pixelsPerByte(), gm.rowsPerCell);
        if (!hires) {
          result.addColorMap(gm.pixelsPerByte(), gm.rowsPerCell);
        }
      }
      return result;
    }
  );

  public static c64FLI: GraphicModeFactory = new GraphicModeFactory(
    (props: Record<string, unknown>): PixelImage => {
      if (props.hires) {
        return GraphicModes.createHiresFLI();
      }

      return GraphicModes.createMulticolorFLI();
    }
  );

  private static createMulticolorFLI(): PixelImage {
    const gm: GraphicMode = new GraphicMode('fli', 160, 200);
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

  private static createHiresFLI(): PixelImage {
    const gm: GraphicMode = new GraphicMode('fli', 320, 200);
    gm.fliBugSize = 3 * 8;
    const result = new PixelImage(gm);
    result.addColorMap(8, 1);
    result.addColorMap(8, 1);
    return result;
  }

  public static c64Sprites: GraphicModeFactory = new GraphicModeFactory(
    (props: Record<string, unknown>): PixelImage => {
      const { rows, columns, hires, nomaps } = props;
      const nrRows = Number(rows);
      const nrColumns = Number(columns);

      const pixelsPerColumn = hires ? 24 : 12;

      const height: number = nrRows * 21;
      const width: number = nrColumns * pixelsPerColumn;

      const gm: GraphicMode = new GraphicMode('sprites', width, height);
      gm.pixelWidth = hires ? 1 : 2;
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
      if (!hires) {
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
    fli: GraphicModes.c64FLI,
    sprites: GraphicModes.c64Sprites
  };
}
