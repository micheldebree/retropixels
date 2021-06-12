import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { Button, Container, Tooltip, Grid } from '@material-ui/core';
import BlurLinearIcon from '@material-ui/icons/BlurLinear';
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';
import { C64Writer, Palettes } from 'retropixels-core';
import { saveAs } from 'file-saver';
import { parseFilename } from './Utilities';
import MyRadioButtons from './MyRadioButtons';
import RetropixelsImage from './RetropixelsImage';
import MyCheckbox from './MyCheckbox';
import MySlider from './MySlider';
import ResetButton from './ResetButton';
import PaletteControl from './PaletteControl';

// options
const ditherOptions = ['none', 'bayer2x2', 'bayer4x4', 'bayer8x8'];
const colorspaceOptions = ['rgb', 'yuv', 'xyz', 'rainbow'];

// defaults
const ditherDefault = 'bayer4x4';
const paletteDefault = Palettes.all.colodore;
const colorspaceDefault = 'xyz';
const hiresDefault = false;
const nomapsDefault = false;
const ditherRadiusDefault = 32;

function getDefaultExtension(pixelImage) {
  return pixelImage.mode.pixelWidth === 1 ? '.art' : '.kla';
}

function saveOutput(pixelImage, targetFilename) {
  const binary = C64Writer.toBinary(pixelImage);
  const buffer = C64Writer.toBuffer(binary);
  const blob = new Blob([buffer], { type: 'application/octet-stream' });
  saveAs(blob, targetFilename);
}

function Retropixels(props) {
  const { jimpImage, filename } = props;

  const [pixelImage, setPixelImage] = useState(undefined);
  const [colorspace, setColorSpace] = useState(colorspaceDefault);
  const [palette, setPalette] = useState(paletteDefault);
  const [hires, setHires] = useState(hiresDefault);
  const [nomaps, setNomaps] = useState(nomapsDefault);
  const [dither, setDither] = useState(ditherDefault);
  const [ditherRadius, setDitherRadius] = useState(ditherRadiusDefault);

  // memoize the callback to avoid re-renders
  const paletteCallback = useCallback(p => setPalette(p), []);
  const newPixelImageCallback = useCallback(i => setPixelImage(i), []);

  let targetFilename = 'output';
  if (pixelImage !== undefined) {
    const extension = getDefaultExtension(pixelImage);
    const parsedFilename = parseFilename(filename);
    targetFilename = `${parsedFilename.basename.substring(0, 30)}${extension}`;
  }

  function reset() {
    setColorSpace(colorspaceDefault);
    setHires(hiresDefault);
    setNomaps(nomapsDefault);
    setDither(ditherDefault);
    setDitherRadius(ditherRadiusDefault);
  }

  // function savePNG() {
  //   JimpPreprocessor.toJimpImage(pixelImage, Palettes.all[palette]).then(outputJimpImage => {
  //     outputJimpImage.image
  //       .getBufferAsync(Jimp.MIME_PNG)
  //       .then(buffer => {
  //         const blob = new Blob([buffer], { type: 'application/octet-stream' });
  //         saveAs(blob, 'test.png');
  //       })
  //       .catch(error => alert(error));
  //   });
  // }

  let outputFormat = 'output';
  if (pixelImage !== undefined) {
    outputFormat = pixelImage.mode.pixelWidth === 1 ? 'art studio file' : 'koala painter file';
  }

  const defaultsSet =
    colorspace === colorspaceDefault &&
    hires === hiresDefault &&
    nomaps === nomapsDefault &&
    dither === ditherDefault &&
    ditherRadius === ditherRadiusDefault;

  return (
    <Grid container>
      <Grid item xs={12} sm={12} md={6}>
        <h4>{outputFormat}</h4>
        <Container>
          <RetropixelsImage
            jimpImage={jimpImage}
            onChanged={newPixelImageCallback}
            hires={hires}
            nomaps={nomaps}
            colorspaceId={colorspace}
            palette={palette}
            ditherId={dither}
            ditherRadius={ditherRadius}
          />
        </Container>
        <Container>
          <Tooltip title={`Download the image as ${outputFormat}`} arrow>
            <Button
              variant="contained"
              disabled={pixelImage === undefined}
              color="primary"
              startIcon={<CloudDownloadIcon />}
              onClick={() => saveOutput(pixelImage, targetFilename)}
            >
              Download
            </Button>
          </Tooltip>
        </Container>
        <ResetButton onClick={reset} disabled={defaultsSet} />
        <Container align="left">
          <MyCheckbox
            name="hires"
            label="hires"
            value={hires}
            onChange={setHires}
            tooltip="Use high resolution mode instead of multi color"
          />
          <MyCheckbox
            name="nomaps"
            label="single color layers"
            value={nomaps}
            onChange={setNomaps}
            tooltip="Restrict each attribute layer to a single color"
          />
        </Container>
        <Container align="left">
          <MyRadioButtons
            label="colorspace"
            value={colorspace}
            items={colorspaceOptions}
            onChange={setColorSpace}
            tooltip="Convert colors to this color space before quantizing"
          />
          <MyRadioButtons
            label="dithering"
            value={dither}
            items={ditherOptions}
            onChange={setDither}
            tooltip="Type of dithering to apply"
          />
          <MySlider
            label="dithering strength"
            value={ditherRadius}
            max={64}
            onChange={setDitherRadius}
            tooltip="Strength of dithering"
            icon={<BlurLinearIcon />}
            disabled={dither === 'none'}
          />
        </Container>
      </Grid>
      <Grid item xs>
        <h4>palette</h4>
        <PaletteControl onChange={paletteCallback} />
      </Grid>
    </Grid>
  );
}

Retropixels.propTypes = {
  jimpImage: PropTypes.shape(),
  filename: PropTypes.string
};

Retropixels.defaultProps = {
  jimpImage: undefined,
  filename: 'output'
};

export default Retropixels;
