import PixelImage from '../model/PixelImage'
import { convertBitmap, convertScreenram, pad } from './C64Layout'
import IBinaryFormat from './IBinaryFormat'

export default class AFLIPicture implements IBinaryFormat {
  public formatName = 'afli'

  public defaultExtension = 'afli'

  private loadAddress: Uint8Array

  private screenRam: Uint8Array[]

  private bitmap: Uint8Array

  public fromPixelImage (pixelImage: PixelImage): void {
    this.loadAddress = new Uint8Array(2)
    this.loadAddress[0] = 0
    this.loadAddress[1] = 0x40

    this.bitmap = convertBitmap(pixelImage)
    this.screenRam = []

    for (let i = 0; i < 8; i += 1) {
      this.screenRam[i] = convertScreenram(pixelImage, 0, 1, i)
    }
  }

  /**
   * Convert to a sequence of bytes.
   * @return {Uint8Array} A sequence of 8-bit bytes.
   */
  public toMemoryMap (): Uint8Array[] {
    return [
      this.loadAddress,
      pad(this.screenRam[0], 24),
      pad(this.screenRam[1], 24),
      pad(this.screenRam[2], 24),
      pad(this.screenRam[3], 24),
      pad(this.screenRam[4], 24),
      pad(this.screenRam[5], 24),
      pad(this.screenRam[6], 24),
      pad(this.screenRam[7], 24),
      this.bitmap
    ]
  }
}
