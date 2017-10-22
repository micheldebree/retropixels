import * as fs from 'fs-extra';

/**
 * A binary file consisting of multiple sequences of 8-bit bytes.
 */
export abstract class BinaryFile {

    // Save PixelImage as a KoalaPaint image.
    public save(outFile: string, callback: () => {}) {

        fs.writeFile(outFile, new Buffer(this.toBytes()), (err: Error) => {
            if (err) { throw err; }
            return callback();
        });
    }

    public pad(buffer: Uint8Array, numberOfBytes: number): Uint8Array {
        return this.concat([buffer, new Uint8Array(numberOfBytes)]);
    }

    protected abstract toMemoryMap(): Uint8Array[];

    private toBytes(): Uint8Array {
        return this.concat(this.toMemoryMap());
    }

    /**
     * Concatenate multiple 8-bit array buffers into one.
     * @param  {Uint8Array[]} arrayBuffers The buffers to concatenate, in desired order.
     * @return {Uint8Array} The buffers concatenated.
     */
    private concat(arrayBuffers: Uint8Array[]): Uint8Array {

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

}
