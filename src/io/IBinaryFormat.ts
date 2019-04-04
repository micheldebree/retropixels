import { PixelImage } from '../model/PixelImage';
import { GraphicMode } from '../profiles/GraphicMode';

export interface IBinaryFormat {
  formatName: string;
  supportedModes: GraphicMode[];

  fromPixelImage(pixelImage: PixelImage): void;
  toMemoryMap(): Uint8Array[];
}
