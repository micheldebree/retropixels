/*jslint bitwise: true*/
/*global document*/
/**
 * Singleton utility for calculations involving pixels and imagedata
 * TODO: rename to pixelmath or pixelutil or something
 */
var PixelCalculator = {};

PixelCalculator.add = function (one, other) {
    'use strict';
    return [one[0] + other[0], one[1] + other[1], one[2] + other[2], one[3] + other[3]];
};

PixelCalculator.substract = function (one, other) {
    'use strict';
    return [one[0] - other[0], one[1] - other[1], one[2] - other[2], one[3] - other[3]];
};

PixelCalculator.multiply = function (one, factor) {
    'use strict';
    return [one[0] * factor, one[1] * factor, one[2] * factor];
};

PixelCalculator.divide = function (one, factor) {
    'use strict';
    return [one[0] / factor, one[1] / factor, one[2] / factor];
};

PixelCalculator.clone = function (one) {
    'use strict';
    return [one[0], one[1], one[2], one[3]];
};

/**
 * Is the pixel empty?
 * An empty pixel is any pixel with total transparency.
 */
PixelCalculator.isEmpty = function (pixel) {
    'use strict';
    return pixel[3] === undefined || pixel[3] < 1;
};

/** Compare pixels by color value */
PixelCalculator.equals = function (one, other) {
    'use strict';

    return !PixelCalculator.isEmpty(one) && !PixelCalculator.isEmpty(other) && one[0] === other[0] && one[1] === other[1] && one[2] === other[2];
};

PixelCalculator.emptyPixel = [0, 0, 0, 0];

/**
 * Create imageData from an Image, optionally resizing it.
 * @param {Image} img - HTML5 Image object to get the image data from.
 * @param {number} [w] - Width to rescale image to.
 * @param {number} [h] - Height to rescale image to.:w
 */
PixelCalculator.getImageData = function (img, w, h) {
    'use strict';

    var canvas = document.createElement('canvas'),
        context = canvas.getContext('2d');

    canvas.width = w;
    canvas.height = h;
    context.drawImage(img, 0, 0, w, h);
    return context.getImageData(0, 0, w, h);

};

/**
 * Clone image data.
 */
PixelCalculator.cloneImageData = function (sourceImageData) {
    'use strict';

    if (sourceImageData === undefined) {
        return undefined;
    }

    var canvas = document.createElement('canvas'),
        context = canvas.getContext('2d');

    canvas.width = sourceImageData.width;
    canvas.height = sourceImageData.height;

    context.putImageData(sourceImageData, 0, 0);
    return context.getImageData(0, 0, canvas.width, canvas.height);

};

/**
 * Convert x and y position in image to an index in the image data.
 * @returns {number} index in the imagedata for the first (red) channel.
 */
PixelCalculator.coordsToindex = function (imageData, x, y) {
    'use strict';

    var result = Math.floor(y) * (imageData.width << 2) + (x << 2);
    return result < imageData.data.length ? result : undefined;
};

PixelCalculator.poke = function (imageData, x, y, pixel) {
    'use strict';

    if (pixel !== undefined) {
        var i = PixelCalculator.coordsToindex(imageData, x, y);
        if (i !== undefined) {
            imageData.data[i] = pixel[0];
            imageData.data[i + 1] = pixel[1];
            imageData.data[i + 2] = pixel[2];
            imageData.data[i + 3] = pixel[3];
        }
    }
};

PixelCalculator.peek = function (imageData, x, y) {
    'use strict';

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

};

PixelCalculator.resize = function (imageData, w, h) {
    'use strict';

    var canvas = document.createElement('canvas'),
        context = canvas.getContext('2d');

    canvas.width = w;
    canvas.height = h;

    context.putImageData(imageData, 0, 0, 0, 0, w, h);
    return context.getImageData(0, 0, w, h);

};


/**
RGB -> YUV
Y = 0.299*Red+0.587*Green+0.114*Blue
U = -0.147*Red-0.289*Green+0.436*Blue
V = 0.615*Red-0.515*Green-0.100*Blue

YUV -> RGB
Red = Y+0.000*U+1.140*V
Green = Y-0.396*U-0.581*V
Blue = Y+2.029*U+0.000*V
*/
PixelCalculator.toYUV = function (pixel) {
    'use strict';
    return [
        pixel[0] * 0.299 + pixel[1] * 0.587 + pixel[2] * 0.114,
        pixel[0] * -0.14713 + pixel[1] * -0.28886 + pixel[2] * 0.436,
        pixel[0] * 0.615 + pixel[1] * -0.51499 + pixel[2] * -0.10001
        
    ];
};

PixelCalculator.toYCbCr = function (pixel) {
    'use strict';
    return [
        pixel[0] * 0.299 + pixel[1] * 0.587 + pixel[2] * 0.114,
        128 - pixel[0] * -0.168736 - pixel[1] * 0.331264 + pixel[2] * 0.50000,
        128 + pixel[0] * 0.50000 - pixel[1] * 0.418688 - pixel[2] * 0.08131
        
        // Cb = -0.16874 * R - 0.33126 * G + 0.50000 * B  + 128
        //         Cr =  0.50000 * R - 0.41869 * G - 0.08131 * B  + 128
        //  0.299 * otherPixel[0] + 0.587 * otherPixel[1] + 0.114 * otherPixel[2];
    ];
};
