import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { Button, Container, Tooltip, Grid } from '@mui/material';
import { makeStyles } from '@mui/styles';
import BlurLinearIcon from '@mui/icons-material/BlurLinear';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import { C64Writer, Palettes } from 'retropixels-core';
import { saveAs } from 'file-saver';
import Jimp from 'jimp/es';
import { parseFilename, getImageDataFromPixelImage } from './Utilities';
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
const ditherDefault = 'bayer2x2';
const paletteDefault = Palettes.all.colodore;
const colorspaceDefault = 'yuv';
const hiresDefault = false;
const nomapsDefault = false;
const ditherRadiusDefault = 32;

const useStyles = makeStyles(theme => ({
  root: {
    '& > *': {
      margin: theme.spacing(1)
    }
  }
}));

function getDefaultExtension(pixelImage) {
  return pixelImage.mode.pixelWidth === 1 ? '.art' : '.kla';
}

function saveOutput(pixelImage, filename) {
  const binary = C64Writer.toBinary(pixelImage);
  const buffer = C64Writer.toBuffer(binary);
  const blob = new Blob([buffer], { type: 'application/octet-stream' });
  saveAs(blob, filename);
}

function savePNG(pixelImage, palette, filename) {
  const width = pixelImage.mode.width * pixelImage.mode.pixelWidth;
  const { height } = pixelImage.mode;
  /* eslint-disable no-new */
  new Jimp(width, height, (err, image) => {
    /* eslint-enable no-new */
    if (err) {
      throw err;
    }

    const imageData = getImageDataFromPixelImage(pixelImage, palette);
    // it seems we can just replace the underlying data of the Jimp image
    image.bitmap.width = imageData.width;
    image.bitmap.height = imageData.height;
    image.bitmap.data = imageData.data;

    image.getBufferAsync(Jimp.MIME_PNG).then(buffer => {
      const blob = new Blob([buffer], { type: 'application/octet-stream' });
      saveAs(blob, filename);
    });
  });
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

  // memoize the callbacks to avoid re-renders
  const paletteCallback = useCallback(p => setPalette(p), []);
  const newPixelImageCallback = useCallback(i => setPixelImage(i), []);

  let c64OutputFilename = 'output';
  let pngOutputFilename;
  if (pixelImage !== undefined) {
    const extension = getDefaultExtension(pixelImage);
    const parsedFilename = parseFilename(filename);
    c64OutputFilename = `${parsedFilename.basename}${extension}`;
    pngOutputFilename = `${parsedFilename.basename}.png`;
  }

  const reset = useCallback(() => {
    setColorSpace(colorspaceDefault);
    setHires(hiresDefault);
    setNomaps(nomapsDefault);
    setDither(ditherDefault);
    setDitherRadius(ditherRadiusDefault);
  }, []);

  let outputFormat = 'output';
  if (pixelImage !== undefined) {
    outputFormat = pixelImage.mode.pixelWidth === 1 ? 'art studio' : 'koala painter';
  }

  const defaultsSet =
    colorspace === colorspaceDefault &&
    hires === hiresDefault &&
    nomaps === nomapsDefault &&
    dither === ditherDefault &&
    ditherRadius === ditherRadiusDefault;

  const classes = useStyles();

  return (
    <Grid container>
      <Grid item xs={12} sm={12} md={6}>
        <h4>{c64OutputFilename}</h4>
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
        <Container align="left" className={classes.root}>
          <Tooltip title={`Download the image as ${outputFormat} file`} arrow>
            <Button
              sx={{ marginRight: '2em' }}
              variant="contained"
              disabled={pixelImage === undefined}
              color="primary"
              startIcon={<CloudDownloadIcon />}
              onClick={() => saveOutput(pixelImage, c64OutputFilename)}
            >
              {outputFormat}
            </Button>
          </Tooltip>
          <Tooltip title="Download the image" arrow>
            <Button
              variant="contained"
              disabled={pixelImage === undefined}
              color="primary"
              startIcon={<CloudDownloadIcon />}
              onClick={() => savePNG(pixelImage, palette, pngOutputFilename)}
            >
              Image
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
