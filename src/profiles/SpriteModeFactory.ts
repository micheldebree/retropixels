import { ColorMap } from '../model/ColorMap';
import { PixelImage } from '../model/PixelImage';
import { GraphicMode } from './GraphicMode';
import { Palettes } from './Palettes';

export class SpriteModeFactory {
  public static createSpriteMode(nrHorizontal: number, nrVertical: number): GraphicMode {
    return new GraphicMode(nrHorizontal * 24, nrVertical * 21, Palettes.peptoPalette, function () {
      const pixelImage = new PixelImage(this);
      pixelImage.colorMaps.push(
        new ColorMap(this.width, this.height, Palettes.peptoPalette, this.width, this.height)
      );
      // background
      pixelImage.colorMaps.push(new ColorMap(this.width, this.height, Palettes.peptoPalette));
      // foreground
      pixelImage.colorMaps.push(
        new ColorMap(this.width, this.height, Palettes.peptoPalette, 24, 21)
      );
      return pixelImage;
    });
  }
}
