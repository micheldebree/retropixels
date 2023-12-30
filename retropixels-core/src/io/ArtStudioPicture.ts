import PixelImage from '../model/PixelImage'
import { convertBitmap, convertScreenram } from './C64Layout'
import IBinaryFormat from './IBinaryFormat'

export default class ArtStudioPicture implements IBinaryFormat {
  public formatName = 'artstudio'

  public defaultExtension = 'art'

  private loadAddress: Uint8Array

  private bitmap: Uint8Array

  private screenRam: Uint8Array

  private magic: Uint8Array

  public fromPixelImage (pixelImage: PixelImage): void {
    this.loadAddress = new Uint8Array(2)
    this.loadAddress[0] = 0
    this.loadAddress[1] = 0x20

    this.bitmap = convertBitmap(pixelImage)
    this.screenRam = convertScreenram(pixelImage, 0, 1)

    this.magic = new Uint8Array([0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00])
  }

  public toMemoryMap (): Uint8Array[] {
    return [this.loadAddress, this.bitmap, this.screenRam, this.magic]
  }
}
