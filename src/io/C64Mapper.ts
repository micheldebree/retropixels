import * as fs from 'fs-extra';
import * as path from 'path';
import { ColorMap } from '../model/ColorMap';
import { PixelImage } from '../model/PixelImage';
import { GraphicMode } from '../profiles/GraphicMode';

/**
 * A factory for creating Commodore 64 files from PixelImages.
 */
export class C64Mapper {
    public static pad(buffer: Uint8Array, numberOfBytes: number): Uint8Array {
        return this.concat([buffer, new Uint8Array(numberOfBytes)]);
    }

    private static concat(arrayBuffers: Uint8Array[]): Uint8Array {
        if (arrayBuffers.length === 1) {
            return arrayBuffers[0];
        }

        return arrayBuffers.reduce((total, current) => {
            const result = new Uint8Array(total.length + current.length);
            result.set(total, 0);
            result.set(current, total.length);
            return result;
        });
    }

    // The filename containing viewer code for executables.
    public viewerFilename: string;

    public mode: GraphicMode;

    private viewersFolder: string = '/target/c64/';

    public constructor(mode: GraphicMode) {
        this.mode = mode;
    }

    // Save PixelImage as a KoalaPaint image.
    public save(memoryMap: Uint8Array[], outFile: string, callback: () => {}) {
        fs.writeFile(outFile, new Buffer(C64Mapper.concat(memoryMap)), (err: Error) => {
            if (err) {
                throw err;
            }
            return callback();
        });
    }

    // Save PixelImage as a c64 native .PRG executable.
    public saveExecutable(memoryMap: Uint8Array[], outFile: string, callback: () => {}) {
        if (!this.viewerFilename) {
            throw new Error('Filename for viewercode is not set.');
        }

        // https://stackoverflow.com/questions/10265798/determine-project-root-from-a-running-node-js-application
        const appDir: string = path.dirname(require.main.filename);
        const viewerFile: string = path.join(appDir, this.viewersFolder + this.viewerFilename);

        fs.readFile(viewerFile, (readError, viewerCode) => {
            if (readError) {
                throw readError;
            }
            const buffer: Buffer = new Buffer(C64Mapper.concat(memoryMap));
            const writeBuffer: Buffer = Buffer.concat([viewerCode, buffer]);
            fs.writeFile(outFile, writeBuffer, writeError => {
                if (writeError) {
                    throw writeError;
                }
                if (callback) {
                    return callback();
                }
            });
        });
    }

    public convertBitmap(pixelImage: PixelImage): Uint8Array {
        const bitmap: Uint8Array = new Uint8Array(8000);
        let bitmapIndex: number = 0;

        this.forEachCell(0, (x, y) => {
            this.forEachCellRow(y, rowY => {
                // pack one character's row worth of pixels into one byte
                this.forEachByte(x, byteX => {
                    let packedByte: number = 0;
                    if (byteX >= this.mode.FLIBugSize) {
                        this.forEachPixel(byteX, (pixelX, shiftTimes) => {
                            packedByte = packedByte | (this.mode.mapPixelIndex(pixelImage, pixelX, rowY) << shiftTimes);
                        });
                    }
                    bitmap[bitmapIndex++] = packedByte;
                });
            });
        });

        return bitmap;
    }

    public convertScreenram(
        pixelImage: PixelImage,
        lowerColorIndex: number,
        upperColorIndex: number,
        yOffset: number = 0
    ): Uint8Array {
        return this.extractAttributeData(pixelImage, yOffset, (x, y) => {
            // pack two colors in one byte
            return (
                ((pixelImage.colorMaps[upperColorIndex].get(x, y) << 4) & 0xf0) |
                (pixelImage.colorMaps[lowerColorIndex].get(x, y) & 0x0f)
            );
        });
    }

    public convertColorram(pixelImage: PixelImage, colorMapIndex: number): Uint8Array {
        return this.extractAttributeData(pixelImage, 0, (x, y) => {
            return pixelImage.colorMaps[colorMapIndex].get(x, y) & 0x0f;
        });
    }

    private extractAttributeData(
        pixelImage: PixelImage,
        yOffset: number,
        callback: (x: number, y: number) => number
    ): Uint8Array {
        const result: Uint8Array = new Uint8Array(1000).fill(0);
        let index: number = 0;

        this.forEachCell(yOffset, (x, y) => {
            result[index++] = x >= this.mode.FLIBugSize ? callback(x, y) : 0;
        });
        return result;
    }

    /**
     * Execute for each cell in the image.
     * @param pixelImage The image
     * @param yOffset Added to the y coordinate of the cell top
     * @param callback Called with the topleft position in the image of the cell.
     */
    private forEachCell(yOffset = 0, callback: (x: number, y: number) => void): void {
        const pixelsPerCellRow: number = this.mode.pixelsPerCellRow();

        for (let y: number = yOffset; y < this.mode.height; y += this.mode.rowsPerCell) {
            for (let x: number = 0; x < this.mode.width; x += pixelsPerCellRow) {
                callback(x, y);
            }
        }
    }

    /**
     * Execute for each row in a cell.
     * @param pixelImage The image
     * @param cellX The left of the cell
     * @param cellY The top of the cell
     * @param callback
     */
    private forEachCellRow(cellY: number, callback: (y) => void) {
        for (let rowY = cellY; rowY < cellY + this.mode.rowsPerCell; rowY++) {
            callback(rowY);
        }
    }

    private forEachByte(cellX: number, callback: (x) => void) {
        for (let byteX = cellX; byteX < cellX + this.mode.bytesPerCellRow; byteX++) {
            callback(byteX);
        }
    }

    private forEachPixel(byteX: number, callback: (x: number, shiftTimes: number) => void) {
        const pixelsPerByte: number = this.mode.pixelsPerByte();

        for (let pixelX: number = 0; pixelX < pixelsPerByte; pixelX++) {
            const shiftTimes = (pixelsPerByte - 1 - pixelX) * this.mode.pixelWidth;
            callback(byteX + pixelX, shiftTimes);
        }
    }
}
