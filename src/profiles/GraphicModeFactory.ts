import Palette from '../model/Palette';
import PixelImage from '../model/PixelImage';

// TODO: now just a wrapper/formalization of the builder. Can this go?
export default class GraphicModeFactory {
  public builder: (palette: Palette) => PixelImage;

  constructor(builder: (palette: Palette) => PixelImage) {
    this.builder = builder;
  }
}
