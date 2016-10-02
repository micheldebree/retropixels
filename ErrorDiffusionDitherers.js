function ErrorDiffusionDitherer() {
    'use strict';
}

ErrorDiffusionDitherer.weighError = function(error, mul, div) {
    'use strict';
    return [
        (error[0] * mul) / div, (error[1] * mul) / div, (error[2] * mul) / div
    ];
};

ErrorDiffusionDitherer.fsDither = function(pixelImage, x, y, error) {
    'use strict';
    pixelImage.addDitherOffset(x + 1, y, ErrorDiffusionDitherer.weighError(error, 7, 16));
    pixelImage.addDitherOffset(x - 1, y + 1, ErrorDiffusionDitherer.weighError(error, 3, 16));
    pixelImage.addDitherOffset(x, y + 1, ErrorDiffusionDitherer.weighError(error, 5, 16));
    pixelImage.addDitherOffset(x + 1, y + 1, ErrorDiffusionDitherer.weighError(error, 1, 16));
};

ErrorDiffusionDitherer.jjnDither = function(pixelImage, x, y, error) {
    'use strict';
    pixelImage.addDitherOffset(x + 1, y, ErrorDiffusionDitherer.weighError(error, 7, 48));
    pixelImage.addDitherOffset(x + 2, y, ErrorDiffusionDitherer.weighError(error, 5, 48));
    pixelImage.addDitherOffset(x - 2, y + 1, ErrorDiffusionDitherer.weighError(error, 3, 48));
    pixelImage.addDitherOffset(x - 1, y + 1, ErrorDiffusionDitherer.weighError(error, 5, 48));
    pixelImage.addDitherOffset(x, y + 1, ErrorDiffusionDitherer.weighError(error, 7, 48));
    pixelImage.addDitherOffset(x + 1, y + 1, ErrorDiffusionDitherer.weighError(error, 5, 48));
    pixelImage.addDitherOffset(x + 2, y + 1, ErrorDiffusionDitherer.weighError(error, 3, 48));
    pixelImage.addDitherOffset(x - 2, y + 2, ErrorDiffusionDitherer.weighError(error, 1, 48));
    pixelImage.addDitherOffset(x - 1, y + 2, ErrorDiffusionDitherer.weighError(error, 3, 48));
    pixelImage.addDitherOffset(x, y + 2, ErrorDiffusionDitherer.weighError(error, 5, 48));
    pixelImage.addDitherOffset(x + 1, y + 2, ErrorDiffusionDitherer.weighError(error, 3, 48));
    pixelImage.addDitherOffset(x + 2, y + 2, ErrorDiffusionDitherer.weighError(error, 1, 48));
};

ErrorDiffusionDitherer.atkinsonDither = function(pixelImage, x, y, error) {
    'use strict';
    pixelImage.addDitherOffset(x + 1, y, ErrorDiffusionDitherer.weighError(error, 1, 8));
    pixelImage.addDitherOffset(x + 2, y, ErrorDiffusionDitherer.weighError(error, 1, 8));
    pixelImage.addDitherOffset(x - 1, y + 1, ErrorDiffusionDitherer.weighError(error, 1, 8));
    pixelImage.addDitherOffset(x, y + 1, ErrorDiffusionDitherer.weighError(error, 1, 8));
    pixelImage.addDitherOffset(x + 1, y + 1, ErrorDiffusionDitherer.weighError(error, 1, 8));
    pixelImage.addDitherOffset(x, y + 2, ErrorDiffusionDitherer.weighError(error, 1, 8));
};

ErrorDiffusionDitherer.all = [{
    key: 'None',
    value: function() {}
}, {
    key: 'Floyd-Steinberg',
    value: ErrorDiffusionDitherer.fsDither
}, {
    key: 'Jarvis, Judice and Ninke',
    value: ErrorDiffusionDitherer.jjnDither
}, {
    key: 'Atkinson',
    value: ErrorDiffusionDitherer.atkinsonDither
}];
