import PixelImage from '../model/PixelImage';

interface IBinaryFormat {
  formatName: string;

  fromPixelImage(pixelImage: PixelImage): void;
  toMemoryMap(): Uint8Array[];
}
export default IBinaryFormat;
