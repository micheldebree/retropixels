import * as Jimp from 'jimp';
import { ImageData } from '../model/ImageData';
import { PixelImage } from '../model/PixelImage';

export class PNGPicture {

    public static save(pixelImage: PixelImage, outFile: string, callback: () => { }) {

        Jimp(pixelImage.width, pixelImage.height, (err: Error, image: Jimp) => {

            if (err) { throw err; }
            for (let y: number = 0; y < image.bitmap.height; y += 1) {
                for (let x: number = 0; x < image.bitmap.width; x += 1) {
                    ImageData.poke(image.bitmap, x, y, pixelImage.peek(x, y));
                }
            }
            // image.resize(pixelImage.width
                // * pixelImage.pWidth, pixelImage.height
                // * pixelImage.pHeight);
            image.write(outFile, () => {
                return callback();
            });
        });
    }

}
