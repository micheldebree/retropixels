/**
 * A binary file consisting of multiple sequences of 8-bit bytes.
 */
export class BinaryFile {

    /**
     * Concatenate multiple 8-bit array buffers into one.
     * @param  {Uint8Array[]} arrayBuffers The buffers to concatenate, in desired order.
     * @return {Uint8Array} The buffers concatenated.
     */
    public concat(arrayBuffers: Uint8Array[]): Uint8Array {
        let iii: number = 0;
        let outputLength: number = 0;

        // measure final size
        arrayBuffers.forEach((buffer: Uint8Array, i: number) => {
            outputLength += buffer.length;
        });

        const result = new Uint8Array(outputLength);

        arrayBuffers.forEach((buffer: Uint8Array, i: number) => {
            for (let ii = 0; ii < buffer.length; ii += 1) {
                result[iii] = buffer[ii];
                iii += 1;
            }
        });

        return result;
    }
}
