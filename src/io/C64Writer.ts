import AFLIPicture from './AFLIPicture';
import FLIPicture from './FLIPicture';
import ArtStudioPicture from './ArtStudioPicture';
import KoalaPicture from './KoalaPicture';
import SpritePad from './SpritePad';
import PixelImage from '../model/PixelImage';
import C64Layout from './C64Layout';
import IBinaryFormat from './IBinaryFormat';

export default class C64Writer {
  public static toBinary(pixelImage: PixelImage): IBinaryFormat {
    let result: IBinaryFormat;

    if (pixelImage.mode.id === 'bitmap') {
      if (pixelImage.isHires()) {
        result = new ArtStudioPicture();
      } else {
        result = new KoalaPicture();
      }
    }

    if (pixelImage.mode.id === 'fli') {
      if (pixelImage.isHires()) {
        result = new AFLIPicture();
      } else {
        result = new FLIPicture();
      }
    }

    if (pixelImage.mode.id === 'sprites') {
      result = new SpritePad();
    }

    if (result !== undefined) {
      result.fromPixelImage(pixelImage);
      return result;
    }

    throw new Error(`Output format is not supported for mode ${pixelImage.mode.id}`);
  }

  public static toBuffer(image: IBinaryFormat): Buffer {
    return Buffer.from(C64Layout.concat(image.toMemoryMap()));
  }
}
