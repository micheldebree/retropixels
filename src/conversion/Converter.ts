import { Remapper } from './Remapper';
import { ImageDataInterface } from '../model/ImageDataInterface';
import { PixelImage } from '../model/PixelImage';
import { c64Multicolor } from '../profiles/GraphicModes'
import { GraphicMode } from '../profiles/GraphicMode'

/**
 * Converts ImageData to a PixelImage
 * @param  {GraphicMode} graphicMode The GraphicMode to use for conversion.
 */
export class Converter {

    graphicMode: GraphicMode;

    constructor(graphicMode: GraphicMode) {
        this.graphicMode = graphicMode;
    }

    /**
     * Convert ImageData to a PixelImage
     * @param  {ImageDataInterface} imageData The ImageData to convert.
     * @return {PixelImage} The converted image.
     */
    convert(imageData: ImageDataInterface): PixelImage {
        const pixelImage: PixelImage = this.graphicMode.factory();
        const remapper = new Remapper(pixelImage);

        remapper.optimizeColorMaps(imageData);
        remapper.drawImageData(imageData);
        return pixelImage;
    }
}
