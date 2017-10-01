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
}
