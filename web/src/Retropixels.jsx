import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Container, Grid, Slider, Typography } from '@material-ui/core';
import BlurLinearIcon from '@material-ui/icons/BlurLinear';
import HiresCheckbox from './HiresCheckbox';
import ProfileSelection from './ProfileSelection';
import TargetImage from './TargetImage';
import { parseFilename} from './Utilities';

// wraps the Targetimage with controls for the various properties
function Retropixels(props) {
  const ditherOptions = ['none', 'bayer2x2', 'bayer4x4', 'bayer8x8'];
  const ditherDefault = 'bayer4x4';
  const colorspaceOptions = ['rgb', 'yuv', 'xyz', 'rainbow'];
  const colorspaceDefault = 'xyz';
  const paletteOptions = ['colodore', 'pepto', 'deekay'];
  const paletteDefault = 'colodore';

  const { jimpImage, filename } = props;

  const [colorspace, setColorSpace] = useState(colorspaceDefault);
  const [palette, setPalette] = useState(paletteDefault);
  const [hires, setHires] = useState(false);
  const [dither, setDither] = useState(ditherDefault);
  const [ditherRadius, setDitherRadius] = useState(32);

  const parsedFilename = parseFilename(filename);
  const targetBasename = `${parsedFilename.basename.substring(0, 30)}`;

  return (
    <>
      <h4>{targetBasename}</h4>
      <Container>
        <TargetImage
          jimpImage={jimpImage}
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
