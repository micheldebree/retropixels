import { ColorMap } from '../model/ColorMap';
import { Palette } from '../model/Palette';
import { PixelImage } from '../model/PixelImage';
import { C64Mapper } from './C64Mapper';

/**
 * A Koala Painter compatible picture.
 */
export class KoalaPicture {
  /**
   * Convert a pixelImage to a KoalaPic
   * PixelImage must have the following specs:
   * - 320 x 160 pixels
   * - colormap 0 has one color, the background color
   * - colormap 1 and 2 have the screenram
   * - colormap 3 has the colorram
   */
  public static fromPixelImage(pixelImage: PixelImage): KoalaPicture {
    const koalaPic: KoalaPicture = new KoalaPicture();

    koalaPic.loadAddress = new Uint8Array(2);
    koalaPic.loadAddress[0] = 0;
    koalaPic.loadAddress[1] = 0x60;

    const mapper: C64Mapper = new C64Mapper(pixelImage.mode);

    koalaPic.bitmap = mapper.convertBitmap(pixelImage);
    koalaPic.screenRam = mapper.convertScreenram(pixelImage, 2, 1);
    koalaPic.colorRam = mapper.convertColorram(pixelImage, 3);
    koalaPic.background = new Uint8Array(1);
    koalaPic.background[0] = pixelImage.colorMaps[0].get(0, 0);

    return koalaPic;
  }

  public loadAddress: Uint8Array;
  public bitmap: Uint8Array;
  public screenRam: Uint8Array;
  public colorRam: Uint8Array;
  public background: Uint8Array;

  /**
   * Read the picture from an 8-bit buffer.
   * @param  {Uint8Array} arrayBuffer The buffer to read.
   */
  public read(arrayBuffer: Uint8Array): void {
    this.loadAddress = new Uint8Array(arrayBuffer, 0, 2);
    this.bitmap = new Uint8Array(arrayBuffer, 2, 8000);
    this.screenRam = new Uint8Array(arrayBuffer, 8002, 1000);
    this.colorRam = new Uint8Array(arrayBuffer, 9002, 1000);
    this.background = new Uint8Array(arrayBuffer, 10002, 1);
  }

  /**
   * Convert to a sequence of bytes.
   * @return {Uint8Array} A sequence of 8-bit bytes.
   */
  public toMemoryMap(): Uint8Array[] {
    return [this.loadAddress, this.bitmap, this.screenRam, this.colorRam, this.background];
  }

  /**
   * Convert a Koala Painter picture to a PixelImage.
   */
//   public toPixelImage(koalaPic: KoalaPicture, palette: Palette): PixelImage {
//     const imageW = 160;
//     const imageH = 200;
//     const pixelImage: PixelImage = new PixelImage(GraphicModes[]);
//     const pixelsPerCellHor = 4;
//     const pixelsPerCellVer = 8;

//     let bitmapIndex = 0;
//     let colorIndex = 0;

//     pixelImage.addColorMap(new ColorMap(imageW, imageH, palette));
//     pixelImage.addColorMap(new ColorMap(imageW, imageH, palette, pixelsPerCellHor, pixelsPerCellVer));
//     pixelImage.addColorMap(new ColorMap(imageW, imageH, palette, pixelsPerCellHor, pixelsPerCellVer));
//     pixelImage.addColorMap(new ColorMap(imageW, imageH, palette, pixelsPerCellHor, pixelsPerCellVer));

//     for (let charY = 0; charY < imageH; charY += pixelsPerCellVer) {
//       for (let charX = 0; charX < imageW; charX += pixelsPerCellHor) {
//         for (let bitmapY = 0; bitmapY < pixelsPerCellVer; bitmapY += 1) {
//           const x = charX;
//           const y = charY + bitmapY;

//           pixelImage.pixelIndex[y][x] = (koalaPic.bitmap[bitmapIndex] >> 6) & 0x03;
//           pixelImage.pixelIndex[y][x + 1] = (koalaPic.bitmap[bitmapIndex] >> 4) & 0x03;
//           pixelImage.pixelIndex[y][x + 2] = (koalaPic.bitmap[bitmapIndex] >> 2) & 0x03;
//           pixelImage.pixelIndex[y][x + 3] = koalaPic.bitmap[bitmapIndex] & 0x03;

//           bitmapIndex += 1;
//         }
//       }
//     }

//     for (let colorY = 0; colorY < imageH; colorY += pixelsPerCellVer) {
//       for (let colorX = 0; colorX < imageW; colorX += pixelsPerCellHor) {
//         // get two colors from screenRam and one from colorRam
//         const color01 = (koalaPic.screenRam[colorIndex] >> 4) & 0x0f;
//         const color10 = koalaPic.screenRam[colorIndex] & 0x0f;
//         const color11 = koalaPic.colorRam[colorIndex] & 0x0f;

//         // add the colors to the corresponding color maps
//         pixelImage.colorMaps[1].put(colorX, colorY, color01);
//         pixelImage.colorMaps[2].put(colorX, colorY, color10);
//         pixelImage.colorMaps[3].put(colorX, colorY, color11);

//         colorIndex += 1;
//       }
//     }
//     // add background color as colorMap 0
//     pixelImage.colorMaps[0].put(0, 0, koalaPic.background[0]);
//     return pixelImage;
//   }
}
