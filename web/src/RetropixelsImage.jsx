import React, { useEffect, useState } from 'react';
import { ColorSpaces, Quantizer, Converter, GraphicModes, Palettes, OrderedDither } from 'retropixels-core';
import PropTypes from 'prop-types';
import Canvas from './Canvas';

const graphicMode = GraphicModes.all.bitmap;

// resize JIMP image to the size needed for conversion to a pixelImage
function resizeToTargetSize(jimpImage, pixelImage) {
  const result = jimpImage.clone();
  result.resize(pixelImage.mode.width, pixelImage.mode.height);
  return result;
}

function getImageDataFromPixelImage(pixelImage) {
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

function RetropixelsImage(props) {
  const { jimpImage, onChanged, hires, nomaps, colorspaceId, palette, ditherId, ditherRadius } = props;

  const defaultQuantizer = new Quantizer(palette, ColorSpaces.all[colorspaceId]);
  const defaultConverter = new Converter(defaultQuantizer);
  const defaultDitherer = new OrderedDither(OrderedDither.presets[ditherId], ditherRadius);

  const [pixelImage, setPixelImage] = useState(undefined);
  const [imageData, setImageData] = useState(undefined);

  const [converter, setConverter] = useState(defaultConverter);
  const [ditherer, setDitherer] = useState(defaultDitherer);

  useEffect(() => {
    const quantizer = new Quantizer(palette, ColorSpaces.all[colorspaceId]);
    setConverter(new Converter(quantizer));
  }, [colorspaceId, palette]);

  useEffect(() => {
    setDitherer(new OrderedDither(OrderedDither.presets[ditherId], ditherRadius));
  }, [ditherId, ditherRadius]);

  useEffect(() => {
    if (jimpImage === undefined) {
      return;
    }

    const newPixelImage = graphicMode({ hires, nomaps });
    const resizedImage = resizeToTargetSize(jimpImage, newPixelImage);
    ditherer.dither(resizedImage.bitmap);
    setPixelImage(newPixelImage);
    converter.convert(resizedImage.bitmap, newPixelImage);
    setPixelImage(newPixelImage);
  }, [jimpImage, hires, nomaps, converter, ditherer]);

  useEffect(() => {
    setImageData(getImageDataFromPixelImage(pixelImage));
    onChanged(pixelImage);
  }, [pixelImage, onChanged]);

  return <Canvas width={320} height={200} imageData={imageData} />;
}

RetropixelsImage.propTypes = {
  jimpImage: PropTypes.shape(),
  onChanged: PropTypes.func,
  hires: PropTypes.bool,
  nomaps: PropTypes.bool,
  colorspaceId: PropTypes.string,
  palette: PropTypes.shape(),
  ditherId: PropTypes.string,
  ditherRadius: PropTypes.number
};

RetropixelsImage.defaultProps = {
  jimpImage: undefined,
  onChanged: () => {},
  hires: false,
  nomaps: false,
  colorspaceId: 'xyz',
  palette: Palettes.all.colodore,
  ditherId: 'bayer4x4',
  ditherRadius: 32
};

export default RetropixelsImage;
