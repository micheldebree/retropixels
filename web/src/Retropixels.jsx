import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Button, Card, CardContent, CardMedia, CardActions, Slider, Typography } from '@material-ui/core';
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';
import HiresCheckbox from './HiresCheckbox';
import ProfileSelection from './ProfileSelection';
import TargetImage from './TargetImage';

// wraps the Targetimage with controls for the various properties
function Retropixels(props) {
  const ditherOptions = ['none', 'bayer2x2', 'bayer4x4', 'bayer8x8'];
  const ditherDefault = 'bayer4x4';
  const colorspaceOptions = ['rgb', 'yuv', 'xyz', 'rainbow'];
  const colorspaceDefault = 'xyz';
  const paletteOptions = ['colodore', 'pepto', 'deekay'];
  const paletteDefault = 'colodore';

  const { jimpImage } = props;

  const [colorspace, setColorSpace] = useState(colorspaceDefault);
  const [palette, setPalette] = useState(paletteDefault);
  const [hires, setHires] = useState(false);
  const [dither, setDither] = useState(ditherDefault);
  const [ditherRadius, setDitherRadius] = useState(32);

  return (
    <>
      <h2>output</h2>
      <CardMedia>
        <TargetImage
          jimpImage={jimpImage}
          hires={hires}
          colorspaceId={colorspace}
          paletteId={palette}
          ditherId={dither}
          ditherRadius={ditherRadius}
        />
      </CardMedia>
      <CardContent>
        <HiresCheckbox onChange={value => setHires(value)} />
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
        <Typography gutterBottom>Dither strength</Typography>
        <Slider
          disabled={dither === 'none'}
          min={0}
          max={64}
          value={ditherRadius}
          onChange={(event, newValue) => setDitherRadius(newValue)}
          valueLabelDisplay="on"
        />
      </CardContent>
      <CardActions>
        <Button variant="contained" color="primary">
          <CloudDownloadIcon /> &nbsp; Download Koala
        </Button>
      </CardActions>
    </>
  );
}

Retropixels.propTypes = {
  jimpImage: PropTypes.shape()
};

Retropixels.defaultProps = {
  jimpImage: undefined
};

export default Retropixels;
