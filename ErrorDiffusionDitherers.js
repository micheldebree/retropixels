weighError = function(error, mul, div) {
    return [
        (error[0] * mul) / div, (error[1] * mul) / div, (error[2] * mul) / div
    ];
};

fsDither = function(pixelImage, x, y, error) {
    pixelImage.addDitherOffset(x + 1, y, weighError(error, 7, 16));
    pixelImage.addDitherOffset(x - 1, y + 1, weighError(error, 3, 16));
    pixelImage.addDitherOffset(x, y + 1, weighError(error, 5, 16));
    pixelImage.addDitherOffset(x + 1, y + 1, weighError(error, 1, 16));
};

jjnDither = function(pixelImage, x, y, error) {
    pixelImage.addDitherOffset(x + 1, y, weighError(error, 7, 48));
    pixelImage.addDitherOffset(x + 2, y, weighError(error, 5, 48));
    pixelImage.addDitherOffset(x - 2, y + 1, weighError(error, 3, 48));
    pixelImage.addDitherOffset(x - 1, y + 1, weighError(error, 5, 48));
    pixelImage.addDitherOffset(x, y + 1, weighError(error, 7, 48));
    pixelImage.addDitherOffset(x + 1, y + 1, weighError(error, 5, 48));
    pixelImage.addDitherOffset(x + 2, y + 1, weighError(error, 3, 48));
    pixelImage.addDitherOffset(x - 2, y + 2, weighError(error, 1, 48));
    pixelImage.addDitherOffset(x - 1, y + 2, weighError(error, 3, 48));
    pixelImage.addDitherOffset(x, y + 2, weighError(error, 5, 48));
    pixelImage.addDitherOffset(x + 1, y + 2, weighError(error, 3, 48));
    pixelImage.addDitherOffset(x + 2, y + 2, weighError(error, 1, 48));
};

atkinsonDither = function(pixelImage, x, y, error) {
    pixelImage.addDitherOffset(x + 1, y, weighError(error, 1, 8));
    pixelImage.addDitherOffset(x + 2, y, weighError(error, 1, 8));
    pixelImage.addDitherOffset(x - 1, y + 1, weighError(error, 1, 8));
    pixelImage.addDitherOffset(x, y + 1, weighError(error, 1, 8));
    pixelImage.addDitherOffset(x + 1, y + 1, weighError(error, 1, 8));
    pixelImage.addDitherOffset(x, y + 2, weighError(error, 1, 8));
};

module.exports = {
    fsDither: fsDither,
    jjnDither: jjnDither,
    atkinsonDither: atkinsonDither
};
