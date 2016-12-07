/* jshint esversion: 6 */
class BinaryFile {

    /**
     * Concatenate multiple 8-bit array buffers into one.
     */
    concat(arrayBuffers) {
        let iii = 0,
            outputLength = 0;

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
module.exports = BinaryFile;
