import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Box, Button, Container, Grid, Slider, Typography } from '@material-ui/core';
import BlurLinearIcon from '@material-ui/icons/BlurLinear';
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';
import { C64Writer } from 'retropixels-core';
import { saveAs } from 'file-saver';
import HiresCheckbox from './HiresCheckbox';
import ProfileSelection from './ProfileSelection';
import TargetImage from './TargetImage';
import { parseFilename } from './Utilities';

// wraps the Targetimage with controls for the various properties
function Retropixels(props) {
  const ditherOptions = ['none', 'bayer2x2', 'bayer4x4', 'bayer8x8'];
  const ditherDefault = 'bayer4x4';
  const colorspaceOptions = ['rgb', 'yuv', 'xyz', 'rainbow'];
  const colorspaceDefault = 'xyz';
  const paletteOptions = ['colodore', 'pepto', 'deekay'];
  const paletteDefault = 'colodore';

  const { jimpImage, filename } = props;

  const [pixelImage, setPixelImage] = useState(undefined);
  const [colorspace, setColorSpace] = useState(colorspaceDefault);
  const [palette, setPalette] = useState(paletteDefault);
  const [hires, setHires] = useState(false);
  const [dither, setDither] = useState(ditherDefault);
  const [ditherRadius, setDitherRadius] = useState(32);

  let targetFilename = 'output';
  if (pixelImage !== undefined) {
    const extension = pixelImage.mode.pixelWidth < 2 ? '.art' : '.kla';
    const parsedFilename = parseFilename(filename);
    targetFilename = `${parsedFilename.basename.substring(0, 30)}${extension}`;
  }

  function onNewPixelImage(newPixelImage) {
    setPixelImage(newPixelImage);
  }

  function saveOutput() {
    const binary = C64Writer.toBinary(pixelImage);
    const buffer = C64Writer.toBuffer(binary);
    const blob = new Blob([buffer], { type: 'application/octet-stream' });
    saveAs(blob, targetFilename);
  }

  let outputFormat;
  if (pixelImage !== undefined) {
    outputFormat = pixelImage.mode.pixelWidth < 2 ? 'Art studio' : 'Koala';
  }

  return (
    <>
      <h4>{targetFilename}</h4>
      <Container>
        <TargetImage
          jimpImage={jimpImage}
          onChanged={onNewPixelImage}
          hires={hires}
          colorspaceId={colorspace}
          paletteId={palette}
          ditherId={dither}
          ditherRadius={ditherRadius}
        />
      </Container>
      <Container align="left">
        {/* TODO: use generic checkbox */}
        <HiresCheckbox onChange={value => setHires(value)} />
      </Container>
      <Container align="left">
        <ProfileSelection
          label="colorspace"
          initialValue={colorspaceDefault}
          items={colorspaceOptions}
          onChange={value => setColorSpace(value)}
        />
        <ProfileSelection
          label="palette"
          initialValue={paletteDefault}
          items={paletteOptions}
          onChange={value => setPalette(value)}
        />
        <ProfileSelection
          label="dithering"
          initialValue={ditherDefault}
          items={ditherOptions}
          onChange={value => setDither(value)}
        />
        <Typography gutterBottom>dithering strength</Typography>
        <Grid container>
          <Grid item>
            <BlurLinearIcon />
          </Grid>
          <Grid item xs>
            <Slider
              disabled={dither === 'none'}
              min={0}
              max={64}
              value={ditherRadius}
              onChange={(event, newValue) => setDitherRadius(newValue)}
              valueLabelDisplay="on"
            />
          </Grid>
        </Grid>
      </Container>
      <Container>
        <Box m={2}>
          <Button variant="contained" disabled={pixelImage === undefined} color="primary" onClick={() => saveOutput()}>
            <CloudDownloadIcon /> &nbsp; Download {outputFormat} file
          </Button>
        </Box>
      </Container>
    </>
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
