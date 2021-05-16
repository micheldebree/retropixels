import React, { useEffect, useState } from 'react';
import { ColorSpaces, Quantizer, Converter, GraphicModes, Palettes } from 'retropixels-core';
import PropTypes from 'prop-types';
import { getImageDataFromPixelImage } from './Utilities';
import Canvas from './Canvas';

function TargetImage(props) {
  const graphicMode = GraphicModes.all.bitmap;
  const palette = Palettes.all.colodore;

  const { jimpImage, hires, colorspaceId } = props;

  const [pixelImage, setPixelImage] = useState(undefined);
  const [imageData, setImageData] = useState(undefined);

  const defaultQuantizer = new Quantizer(palette, ColorSpaces.all[colorspaceId]);
  const defaultConverter = new Converter(defaultQuantizer);

  const [quantizer, setQuantizer] = useState(defaultQuantizer);
  const [converter, setConverter] = useState(defaultConverter);

  useEffect(() => {
    setQuantizer(new Quantizer(palette, ColorSpaces.all[colorspaceId]));
  }, [colorspaceId, palette]);

  useEffect(() => {
    setConverter(new Converter(quantizer));
  }, [quantizer]);

  useEffect(() => {
    if (jimpImage !== undefined) {
      const newPixelImage = graphicMode({ hires });
      jimpImage.resize(newPixelImage.mode.width, newPixelImage.mode.height);
      converter.convert(jimpImage.bitmap, newPixelImage);
      setPixelImage(newPixelImage);
    } else {
      setPixelImage(undefined);
    }
  }, [jimpImage, hires, converter, graphicMode]);

  useEffect(() => {
    if (pixelImage === undefined) {
      setImageData(undefined);
    } else {
      setImageData(getImageDataFromPixelImage(pixelImage));
    }
  }, [pixelImage]);

  return <Canvas width={320} height={200} imageData={imageData} />;
}

TargetImage.propTypes = {
  jimpImage: PropTypes.shape(),
  hires: PropTypes.bool,
  colorspaceId: PropTypes.string
};

TargetImage.defaultProps = {
  jimpImage: undefined,
  hires: false,
  colorspaceId: 'xyz'
};

export default TargetImage;
