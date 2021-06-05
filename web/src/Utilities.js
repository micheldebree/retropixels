import { ColorSpaces, Quantizer, Converter, GraphicModes, Palettes } from 'retropixels-core';

export function convertJimpImageToPixelImage(jimpImage) {
  if (jimpImage === undefined) {
    return undefined;
  }
  const palette = Palettes.all.colodore;
  const colorspace = ColorSpaces.all.xyz;
  const quantizer = new Quantizer(palette, colorspace);
  const converter = new Converter(quantizer);

  const graphicMode = GraphicModes.all.bitmap;
  const result = graphicMode({});

  converter.convert(jimpImage.bitmap, result);
  return result;
}

export function getImageDataFromJimpImage(jimpImage) {
  if (jimpImage === undefined) {
    return undefined;
  }

  // TODO: Jimp does not seem to shrink the data array when resizing picture to a smaller size... Confirm?
  const dataSize = jimpImage.bitmap.width * jimpImage.bitmap.height * 4;
  let data;
  if (jimpImage.bitmap.data.length > dataSize) {
    data = jimpImage.bitmap.data.slice(0, dataSize);
  } else {
    data = jimpImage.bitmap.data;
  }

  return jimpImage !== undefined
    ? new ImageData(Uint8ClampedArray.from(data), jimpImage.bitmap.width, jimpImage.bitmap.height)
    : undefined;
}

export function cropJimpImage(jimpImage) {
  const isTooSmall = jimpImage.bitmap.width < 320 || jimpImage.bitmap.height < 200;
  let blitImage;

  // if the image is too small, the cropped image is cleared,
  // and then the smaller image is blitted onto it
  // this is a workaround for artifacts when cropping images to larger sizes
  if (isTooSmall) {
    blitImage = jimpImage.clone();
  }
  jimpImage.crop(0, 0, 320, 200);
  if (blitImage !== undefined) {
    this.clearJimpImage(jimpImage);
    jimpImage.blit(blitImage, 0, 0);
  }
}

export function clearJimpImage(jimpImage) {
  jimpImage.scan(0, 0, jimpImage.bitmap.width, jimpImage.bitmap.height, (x, y, idx) => {
    jimpImage.bitmap.data[idx + 0] = 0;
    jimpImage.bitmap.data[idx + 1] = 0;
    jimpImage.bitmap.data[idx + 2] = 0;
    jimpImage.bitmap.data[idx + 3] = 0;
  });
}

export function getImageDataFromPixelImage(pixelImage) {
  if (pixelImage === undefined) {
    return new ImageData(1, 1);
  }
  const imageWidth = pixelImage.mode.width * pixelImage.mode.pixelWidth;
  const imageData = new ImageData(imageWidth, pixelImage.mode.height);
  for (let y = 0; y < pixelImage.mode.height; y += 1) {
    for (let x = 0; x < pixelImage.mode.width; x += 1) {
      const paletteIndex = pixelImage.peek(x, y);
      const pixelValue = paletteIndex !== undefined ? Palettes.all.colodore.colors[paletteIndex] : [0, 0, 0, 0];
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

export default {
  getImageDataFromJimpImage
};
