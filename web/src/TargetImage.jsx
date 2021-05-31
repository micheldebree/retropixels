import React, { useEffect, useState } from 'react';
import { ColorSpaces, Quantizer, Converter, GraphicModes, Palettes, OrderedDither } from 'retropixels-core';
import PropTypes from 'prop-types';
import { getImageDataFromPixelImage } from './Utilities';
import Canvas from './Canvas';

function TargetImage(props) {
  const graphicMode = GraphicModes.all.bitmap;

  const { jimpImage, onChanged, hires, nomaps, colorspaceId, paletteId, enabledColors, ditherId, ditherRadius } = props;

  const defaultQuantizer = new Quantizer(Palettes.all[paletteId], ColorSpaces.all[colorspaceId]);
  const defaultConverter = new Converter(defaultQuantizer);
  const defaultDitherer = new OrderedDither(OrderedDither.presets[ditherId], ditherRadius);

  const [pixelImage, setPixelImage] = useState(undefined);
  const [imageData, setImageData] = useState(undefined);

  const [quantizer, setQuantizer] = useState(defaultQuantizer);
  const [converter, setConverter] = useState(defaultConverter);
  const [ditherer, setDitherer] = useState(defaultDitherer);

  useEffect(() => {
    const palette = Palettes.all[paletteId];
    palette.enabled = enabledColors;

    setQuantizer(new Quantizer(palette, ColorSpaces.all[colorspaceId]));
  }, [colorspaceId, paletteId, enabledColors]);

  useEffect(() => {
    setConverter(new Converter(quantizer));
  }, [quantizer]);

  useEffect(() => {
    setDitherer(new OrderedDither(OrderedDither.presets[ditherId], ditherRadius));
  }, [ditherId, ditherRadius]);

  useEffect(() => {
    if (jimpImage !== undefined) {
      const newPixelImage = graphicMode({ hires, nomaps });
      const resizedImage = jimpImage.clone();
      resizedImage.resize(newPixelImage.mode.width, newPixelImage.mode.height);
      if (ditherId !== 'none') {
        ditherer.dither(resizedImage.bitmap);
      }
      // TODO: this is a workaround for a bug in dithering
      // that clears the alpha channel
      resizedImage.opaque();

      converter.convert(resizedImage.bitmap, newPixelImage);
      setPixelImage(newPixelImage);
    }
  }, [jimpImage, converter, ditherer, hires, nomaps, graphicMode]);

  useEffect(() => {
    setImageData(getImageDataFromPixelImage(pixelImage));
    onChanged(pixelImage);
  }, [pixelImage, onChanged]);

  return (
    <>
      <Canvas width={320} height={200} imageData={imageData} />
    </>
  );
}

TargetImage.propTypes = {
  jimpImage: PropTypes.shape(),
  onChanged: PropTypes.func,
  hires: PropTypes.bool,
  nomaps: PropTypes.bool,
  colorspaceId: PropTypes.string,
  paletteId: PropTypes.string,
  enabledColors: PropTypes.arrayOf(PropTypes.number),
  ditherId: PropTypes.string,
  ditherRadius: PropTypes.number
};

TargetImage.defaultProps = {
  jimpImage: undefined,
  onChanged: () => {},
  hires: false,
  nomaps: false,
  colorspaceId: 'xyz',
  paletteId: 'colodore',
  ditherId: 'bayer4x4',
  ditherRadius: 32,
  enabledColors: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]
};

export default TargetImage;
