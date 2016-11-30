/**
 * Utility for calculations involving pixels
 */
emptyPixel = [0, 0, 0, 0];

function add(one, other) {
    return [one[0] + other[0], one[1] + other[1], one[2] + other[2], one[3] + other[3]];
}

function substract(one, other) {
    return [one[0] - other[0], one[1] - other[1], one[2] - other[2], one[3] - other[3]];
}

function multiply(one, factor) {
    return [one[0] * factor, one[1] * factor, one[2] * factor];
}

function divide(one, factor) {
    return [one[0] / factor, one[1] / factor, one[2] / factor];
}

function clone(one) {
    return [one[0], one[1], one[2], one[3]];
}

function isEmpty(pixel) {
    return pixel[3] === undefined || pixel[3] < 1;
}

function equals(one, other) {
    return !isEmpty(one) && !isEmpty(other) && one[0] === other[0] && one[1] === other[1] && one[2] === other[2];
}

function toYUV(pixel) {
    return [
        pixel[0] * 0.299 + pixel[1] * 0.587 + pixel[2] * 0.114,
        pixel[0] * -0.14713 + pixel[1] * -0.28886 + pixel[2] * 0.436,
        pixel[0] * 0.615 + pixel[1] * -0.51499 + pixel[2] * -0.10001
    ];
}

module.exports = {
    add: add,
    substract: substract,
    multiply: multiply,
    divide: divide,
    clone: clone,
    isEmpty: isEmpty,
    equals: equals,
    emptyPixel: emptyPixel,
    toYUV: toYUV
};
