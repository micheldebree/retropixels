import React, { useEffect, useState } from 'react';
import { ColorSpaces, Quantizer, Converter, GraphicModes, Palettes, OrderedDither } from 'retropixels-core';
import PropTypes from 'prop-types';
import Canvas from './Canvas';
import { getImageDataFromPixelImage } from './Utilities';

const graphicMode = GraphicModes.all.bitmap;

// resize JIMP image to the size needed for conversion to a pixelImage
function resizeToTargetSize(jimpImage, pixelImage) {
  const result = jimpImage.clone();
  result.resize(pixelImage.mode.width, pixelImage.mode.height);
  return result;
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
    setImageData(getImageDataFromPixelImage(pixelImage, palette));
    onChanged(pixelImage);
  }, [pixelImage, onChanged, palette]);

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
