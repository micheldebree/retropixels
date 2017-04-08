/* jshint esversion: 6 */
// TODO: Make this a decorate for ImageData?
function coordsToindex(imageData, x, y) {
    const result = Math.floor(y) * (imageData.width << 2) + (x << 2);
    return result < imageData.data.length ? result : undefined;
}

// Set the pixel at (x,y)
function poke(imageData, x, y, pixel) {
    if (pixel !== undefined) {
        const i = coordsToindex(imageData, x, y);
        if (i !== undefined) {
            imageData.data[i] = pixel[0];
            imageData.data[i + 1] = pixel[1];
            imageData.data[i + 2] = pixel[2];
            imageData.data[i + 3] = pixel[3];
        }
    }
}

// Get the pixel at (x,y)
function peek(imageData, x, y) {
    const i = coordsToindex(imageData, x, y);
    if (i !== undefined) {
        return [
            imageData.data[i],
            imageData.data[i + 1],
            imageData.data[i + 2],
            imageData.data[i + 3]
        ];
    }
    return emptyPixel; // TODO: is emptyPixel defined?
}

// Draw ImageData onto a PixelImage 
function drawImageData(imageData, pixelImage) {
    for (let y = 0; y < pixelImage.height; y += 1) {
        for (let x = 0; x < pixelImage.width; x += 1) {
            let pixel = peek(imageData, x, y);
            pixelImage.poke(x, y, pixel);
        }
    }
}

module.exports = {
  poke: poke,
  peek: peek,
  drawImageData: drawImageData
};
