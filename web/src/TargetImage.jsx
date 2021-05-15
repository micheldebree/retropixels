import React, { useEffect, useState } from 'react';
import { ColorSpaces, Quantizer, Converter, GraphicModes, Palettes } from 'retropixels-core';
import PropTypes from 'prop-types';
import { getImageDataFromPixelImage } from './Utilities';
import Canvas from './Canvas';

function TargetImage(props) {
  const graphicMode = GraphicModes.all.bitmap;
  const palette = Palettes.all.colodore;
  const colorspace = ColorSpaces.all.xyz;
  const quantizer = new Quantizer(palette, colorspace);
  const converter = new Converter(quantizer);

  const { jimpImage } = props;

  const [pixelImage, setPixelImage] = useState(undefined);
  const [imageData, setImageData] = useState(undefined);

  useEffect(() => {
    if (jimpImage !== undefined) {
      const newPixelImage = graphicMode({});
      jimpImage.resize(newPixelImage.mode.width, newPixelImage.mode.height);
      converter.convert(jimpImage.bitmap, newPixelImage);
      setPixelImage(newPixelImage);
    } else {
      setPixelImage(undefined);
    }
  }, [jimpImage]);

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
  jimpImage: PropTypes.shape()
};

TargetImage.defaultProps = {
  jimpImage: undefined
};

export default TargetImage;
