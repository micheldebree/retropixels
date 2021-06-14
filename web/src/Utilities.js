export function parseFilename(filename) {
  const periodPos = filename.lastIndexOf('.');
  const extension = filename.substring(periodPos + 1, filename.length);
  const basename = filename.substring(0, Math.min(30, periodPos));
  return { basename, extension };
}

export function abbreviateFilename(filename, maxSize) {
  if (filename.length <= maxSize) {
    return filename;
  }
  const parsed = parseFilename(filename);
  return `${parsed.basename.substring(0, maxSize)}...${parsed.extension}`;
}

export function getImageDataFromPixelImage(pixelImage, palette) {
  if (pixelImage === undefined) {
    return new ImageData(1, 1);
  }
  const imageWidth = pixelImage.mode.width * pixelImage.mode.pixelWidth;
  const imageData = new ImageData(imageWidth, pixelImage.mode.height);
  for (let y = 0; y < pixelImage.mode.height; y += 1) {
    for (let x = 0; x < pixelImage.mode.width; x += 1) {
      const paletteIndex = pixelImage.peek(x, y);
      const pixelValue = paletteIndex !== undefined ? palette.colors[paletteIndex] : [0, 0, 0, 0];
      for (let xx = 0; xx < pixelImage.mode.pixelWidth; xx += 1) {
        const index = y * 4 * imageWidth + x * pixelImage.mode.pixelWidth * 4 + xx * 4;
        const [r, g, b] = pixelValue;
        imageData.data[index] = r;
        imageData.data[index + 1] = g;
        imageData.data[index + 2] = b;
        imageData.data[index + 3] = 0xff;
      }
    }
  }
  return imageData;
}
