import { PixelImage } from '../model/PixelImage';
import { GraphicMode } from '../profiles/GraphicMode';

export interface IC64Format {
  formatName: string;
  supportedModes: GraphicMode[];

  fromPixelImage(pixelImage: PixelImage);
  toMemoryMap(): Uint8Array[];
}
