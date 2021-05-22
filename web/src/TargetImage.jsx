import React, { useEffect, useState } from 'react';
import { C64Writer, ColorSpaces, Quantizer, Converter, GraphicModes, Palettes } from 'retropixels-core';
import { Button } from '@material-ui/core';
import PropTypes from 'prop-types';
import OrderedDither from 'retropixels-core/target/conversion/OrderedDither';
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';
import { saveAs } from 'file-saver';
import { getImageDataFromPixelImage } from './Utilities';
import Canvas from './Canvas';

function TargetImage(props) {
  const graphicMode = GraphicModes.all.bitmap;

  const { jimpImage, hires, colorspaceId, paletteId, ditherId, ditherRadius } = props;

  const defaultQuantizer = new Quantizer(Palettes.all[paletteId], ColorSpaces.all[colorspaceId]);
  const defaultConverter = new Converter(defaultQuantizer);
  const defaultDitherer = new OrderedDither(OrderedDither.presets[ditherId], ditherRadius);

  const [pixelImage, setPixelImage] = useState(undefined);
  const [imageData, setImageData] = useState(undefined);

  const [quantizer, setQuantizer] = useState(defaultQuantizer);
  const [converter, setConverter] = useState(defaultConverter);
  const [ditherer, setDitherer] = useState(defaultDitherer);

  useEffect(() => {
    setQuantizer(new Quantizer(Palettes.all[paletteId], ColorSpaces.all[colorspaceId]));
  }, [colorspaceId, paletteId]);

  useEffect(() => {
    setConverter(new Converter(quantizer));
  }, [quantizer]);

  useEffect(() => {
    setPixelImage(graphicMode({ hires }));
  }, [hires, graphicMode]);

  useEffect(() => {
    setDitherer(new OrderedDither(OrderedDither.presets[ditherId], ditherRadius));
  }, [ditherId, ditherRadius]);

  useEffect(() => {
    if (jimpImage !== undefined) {
      const newPixelImage = graphicMode({ hires });
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
  }, [jimpImage, converter, ditherer, hires, graphicMode]);

  useEffect(() => {
    setImageData(getImageDataFromPixelImage(pixelImage));
  }, [pixelImage]);

  function saveOutput() {
    const binary = C64Writer.toBinary(pixelImage);
    const buffer = C64Writer.toBuffer(binary);
    const blob = new Blob([buffer], { type: 'application/octet-stream' });
    const extension = pixelImage.mode.pixelWidth < 2 ? '.art' : '.kla';
    saveAs(blob, `test${extension}`);
  }

  let outputFormat;
  if (pixelImage !== undefined) {
    outputFormat = pixelImage.mode.pixelWidth < 2 ? 'Art studio' : 'Koala';
  }

  return (
    <>
      <Canvas width={320} height={200} imageData={imageData} />
      <Button variant="contained" disabled={pixelImage === undefined} color="primary" onClick={() => saveOutput()}>
        <CloudDownloadIcon /> &nbsp; Download {outputFormat}
      </Button>
    </>
  );
}

TargetImage.propTypes = {
  jimpImage: PropTypes.shape(),
  hires: PropTypes.bool,
  colorspaceId: PropTypes.string,
  paletteId: PropTypes.string,
  ditherId: PropTypes.string,
  ditherRadius: PropTypes.number
};

TargetImage.defaultProps = {
  jimpImage: undefined,
  hires: false,
  colorspaceId: 'xyz',
  paletteId: 'colodore',
  ditherId: 'bayer4x4',
  ditherRadius: 32
};

export default TargetImage;