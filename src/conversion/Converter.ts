import * as graphicModes from '../profiles/GraphicModes';
import * as remapper from './Remapper';
import * as ImageData from '../model/ImageData';
import { ImageDataInterface } from '../model/ImageDataInterface';
import { PixelImage } from '../model/PixelImage';

export class Converter {

    graphicMode: any;

    constructor() {
        this.graphicMode = graphicModes.c64Multicolor;
    }

    convert(imageData: ImageDataInterface): PixelImage {
        const pixelImage: PixelImage = this.graphicMode.create();
        remapper.optimizeColorMaps(imageData, pixelImage);
        ImageData.drawImageData(imageData, pixelImage);
        return pixelImage;
    }
}


