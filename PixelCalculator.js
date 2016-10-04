/*jslint bitwise: true*/
/*global document*/
/**
 * Utility for calculations involving pixels and imagedata
 * TODO: rename to pixelmath or pixelutil or something
 */
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
    return !PixelCalculator.isEmpty(one) && !PixelCalculator.isEmpty(other) && one[0] === other[0] && one[1] === other[1] && one[2] === other[2];
}

emptyPixel = [0, 0, 0, 0];

function getImageData(img, w, h) {
    var canvas = document.createElement('canvas'),
        context = canvas.getContext('2d');
    canvas.width = w;
    canvas.height = h;
    context.drawImage(img, 0, 0, w, h);
    return context.getImageData(0, 0, w, h);
}

function cloneImageData(sourceImageData) {
    if (sourceImageData === undefined) {
        return undefined;
    }

    var canvas = document.createElement('canvas'),
        context = canvas.getContext('2d');

    canvas.width = sourceImageData.width;
    canvas.height = sourceImageData.height;

    context.putImageData(sourceImageData, 0, 0);
    return context.getImageData(0, 0, canvas.width, canvas.height);
}

function coordsToindex(imageData, x, y) {
    var result = Math.floor(y) * (imageData.width << 2) + (x << 2);
    return result < imageData.data.length ? result : undefined;
}

function poke(imageData, x, y, pixel) {
    if (pixel !== undefined) {
        var i = PixelCalculator.coordsToindex(imageData, x, y);
        if (i !== undefined) {
            imageData.data[i] = pixel[0];
            imageData.data[i + 1] = pixel[1];
            imageData.data[i + 2] = pixel[2];
            imageData.data[i + 3] = pixel[3];
        }
    }
}

function peek(imageData, x, y) {
    var i = PixelCalculator.coordsToindex(imageData, x, y);
    if (i !== undefined) {
        return [
            imageData.data[i],
            imageData.data[i + 1],
            imageData.data[i + 2],
            imageData.data[i + 3]
        ];
    }
    return PixelCalculator.emptyPixel;
}

function resize(imageData, w, h) {
    var canvas = document.createElement('canvas'),
        context = canvas.getContext('2d');

    canvas.width = w;
    canvas.height = h;

    context.putImageData(imageData, 0, 0, 0, 0, w, h);
    return context.getImageData(0, 0, w, h);
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
    getImageData: getImageData,
    cloneImageData: cloneImageData,
    coordsToindex: coordsToindex,
    peek: peek,
    poke: poke,
    resize: resize,
    toYUV: toYUV
};
