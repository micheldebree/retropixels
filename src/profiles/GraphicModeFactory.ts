import PixelImage from '../model/PixelImage';

// TODO: now just a wrapper/formalization of the builder. Can this go?
export default class GraphicModeFactory {
  public builder: (props?: Record<string, unknown>) => PixelImage;

  constructor(builder: (props?: Record<string, unknown>) => PixelImage) {
    this.builder = builder;
  }
}
