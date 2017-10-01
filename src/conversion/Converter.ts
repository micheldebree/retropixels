import { ImageDataInterface } from '../model/ImageDataInterface';
import { PixelImage } from '../model/PixelImage';
import { GraphicMode } from '../profiles/GraphicMode';
import { c64Multicolor } from '../profiles/GraphicModes';
import { Remapper } from './Remapper';

/**
 * Converts ImageData to a PixelImage
 * @param  {GraphicMode} graphicMode The GraphicMode to use for conversion.
 */
export class Converter {

    public graphicMode: GraphicMode;

    /**
     * Constructor
     * @param  {GraphicMode} graphicMode The graphic mode to convert to.
     */
    constructor(graphicMode: GraphicMode) {
        this.graphicMode = graphicMode;
    }

    /**
     * Convert ImageData to a PixelImage
     * @param  {ImageDataInterface} imageData The ImageData to convert.
     * @return {PixelImage} The converted image.
     */
    public convert(imageData: ImageDataInterface): PixelImage {
        const pixelImage: PixelImage = this.graphicMode.factory();
        const remapper: Remapper = new Remapper(pixelImage);

        remapper.optimizeColorMaps(imageData);
        remapper.drawImageData(imageData);
        return pixelImage;
    }
}
