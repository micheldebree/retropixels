import * as fs from 'fs-extra';

/**
 * A binary file consisting of multiple sequences of 8-bit bytes.
 */
export abstract class BinaryFile {

    protected abstract toMemoryMap(): Uint8Array[];

    // Save PixelImage as a KoalaPaint image.
    public save(outFile: string, callback: () => {}) {

        fs.writeFile(outFile, new Buffer(this.toBytes()), (err: Error) => {
            if (err) { throw err; }
            return callback();
        });
    }

    private toBytes(): Uint8Array {
        return this.concat(this.toMemoryMap());
    }

    /**
     * Concatenate multiple 8-bit array buffers into one.
     * @param  {Uint8Array[]} arrayBuffers The buffers to concatenate, in desired order.
     * @return {Uint8Array} The buffers concatenated.
     */
    private concat(arrayBuffers: Uint8Array[]): Uint8Array {
        let iii = 0;
        let outputLength = 0;

        // measure final size
        for (let i = 0; i < arrayBuffers.length; i += 1) {
            outputLength += arrayBuffers[i].length;
        }

        const result = new Uint8Array(outputLength);

        for (let i = 0; i < arrayBuffers.length; i += 1) {
            for (let ii = 0; ii < arrayBuffers[i].length; ii += 1) {
                result[iii] = arrayBuffers[i][ii];
                iii += 1;
            }
        }

        return result;
    }

    public pad(buffer: Uint8Array, numberOfBytes: number): Uint8Array {
        const padding = new Uint8Array(numberOfBytes);
        return this.concat([buffer, padding]);
    }

}
