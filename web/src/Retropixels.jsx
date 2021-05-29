import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Button, Container, Grid, Slider, Checkbox, FormControlLabel, FormLabel } from '@material-ui/core';
import BlurLinearIcon from '@material-ui/icons/BlurLinear';
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';
import AutorenewIcon from '@material-ui/icons/Autorenew';
import { C64Writer } from 'retropixels-core';
import { saveAs } from 'file-saver';
import ProfileSelection from './ProfileSelection';
import TargetImage from './TargetImage';
import { parseFilename } from './Utilities';

// wraps the Targetimage with controls for the various properties
function Retropixels(props) {
  const ditherOptions = ['none', 'bayer2x2', 'bayer4x4', 'bayer8x8'];
  const colorspaceOptions = ['rgb', 'yuv', 'xyz', 'rainbow'];
  const paletteOptions = ['colodore', 'pepto', 'deekay'];

  // defaults

  const ditherDefault = 'bayer4x4';
  const paletteDefault = 'colodore';
  const colorspaceDefault = 'xyz';
  const hiresDefault = false;
  const ditherRadiusDefault = 32;

  const { jimpImage, filename } = props;

  const [pixelImage, setPixelImage] = useState(undefined);
  const [colorspace, setColorSpace] = useState(colorspaceDefault);
  const [palette, setPalette] = useState(paletteDefault);
  const [hires, setHires] = useState(hiresDefault);
  const [dither, setDither] = useState(ditherDefault);
  const [ditherRadius, setDitherRadius] = useState(ditherRadiusDefault);

  let targetFilename = 'output';
  if (pixelImage !== undefined) {
    const extension = pixelImage.mode.pixelWidth === 1 ? '.art' : '.kla';
    const parsedFilename = parseFilename(filename);
    targetFilename = `${parsedFilename.basename.substring(0, 30)}${extension}`;
  }

  function onNewPixelImage(newPixelImage) {
    setPixelImage(newPixelImage);
  }

  function reset() {
    setColorSpace(colorspaceDefault);
    setPalette(paletteDefault);
    setHires(hiresDefault);
    setDither(ditherDefault);
    setDitherRadius(ditherRadiusDefault);
  }

  function saveOutput() {
    const binary = C64Writer.toBinary(pixelImage);
    const buffer = C64Writer.toBuffer(binary);
    const blob = new Blob([buffer], { type: 'application/octet-stream' });
    saveAs(blob, targetFilename);
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
    palette === paletteDefault &&
    hires === hiresDefault &&
    dither === ditherDefault &&
    ditherRadius === ditherRadiusDefault;

  return (
    <>
      <h4>{outputFormat}</h4>
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
      <Container>
        <Button
          variant="contained"
          disabled={pixelImage === undefined}
          color="primary"
          startIcon={<CloudDownloadIcon />}
          onClick={() => saveOutput()}
        >
          Download
        </Button>
      </Container>
      <Container align="left">
        <Button size="small" disabled={defaultsSet} startIcon={<AutorenewIcon />} onClick={() => reset()}>
          defaults
        </Button>
      </Container>
      <Container align="left">
        {/* TODO: use generic checkbox */}
        <FormControlLabel
          control={
            <Checkbox
              checked={hires}
              onChange={() => {
                setHires(!hires);
              }}
              name="mirrorHorCheckbox"
            />
          }
          label="hires"
        />
      </Container>
      <Container align="left">
        <ProfileSelection
          label="colorspace"
          value={colorspace}
          items={colorspaceOptions}
          onChange={value => setColorSpace(value)}
        />
        <ProfileSelection
          label="palette"
          value={palette}
          items={paletteOptions}
          onChange={value => setPalette(value)}
        />
        <ProfileSelection label="dithering" value={dither} items={ditherOptions} onChange={value => setDither(value)} />
        <FormLabel component="legend">dithering strength</FormLabel>
        <Grid container>
          <Grid item>
            <BlurLinearIcon /> &nbsp;
          </Grid>
          <Grid item xs>
            <Slider
              disabled={dither === 'none'}
              min={0}
              max={64}
              value={ditherRadius}
              onChange={(event, newValue) => setDitherRadius(newValue)}
              valueLabelDisplay="auto"
            />
          </Grid>
        </Grid>
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
