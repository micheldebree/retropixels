import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Button, Container, Grid, Typography, FormControlLabel, Checkbox, Slider } from '@material-ui/core';
import Brightness5OutlinedIcon from '@material-ui/icons/Brightness5Outlined';
import Brightness6OutlinedIcon from '@material-ui/icons/Brightness6Outlined';
import BrokenImageOutlinedIcon from '@material-ui/icons/BrokenImageOutlined';
import BlurOnOutlinedIcon from '@material-ui/icons/BlurOnOutlined';
import AutorenewIcon from '@material-ui/icons/Autorenew';
// import FormatColorResetOutlinedIcon from '@material-ui/icons/FormatColorResetOutlined';
import { getImageDataFromJimpImage } from './Utilities';
import Canvas from './Canvas';

function ImagePreProcessor(props) {
  const { jimpImage, onChanged } = props;

  // defaults

  const normalizeDefault = true;
  const greyscaleDefault = false;
  const mirrorHorDefault = false;
  const mirrorVerDefault = false;
  const invertDefault = false;
  const brightnessDefault = 0;
  const contrastDefault = 0;
  const blurDefault = 0;
  const thresholdDefault = 0;

  const [image, setImage] = useState(undefined);
  const [imageData, setImageData] = useState(undefined);
  const [normalize, setNormalize] = useState(normalizeDefault);
  const [greyscale, setGreyscale] = useState(greyscaleDefault);
  const [mirrorHor, setMirrorHor] = useState(mirrorHorDefault);
  const [mirrorVer, setMirrorVer] = useState(mirrorVerDefault);
  const [invert, setInvert] = useState(invertDefault);
  const [brightness, setBrightness] = useState(brightnessDefault);
  const [contrast, setContrast] = useState(contrastDefault);
  const [blur, setBlur] = useState(blurDefault);
  const [threshold, setThreshold] = useState(thresholdDefault);
  // const [saturation, setSaturation] = useState(0);

  function reset() {
    setNormalize(normalizeDefault);
    setGreyscale(greyscaleDefault);
    setMirrorHor(mirrorHorDefault);
    setMirrorVer(mirrorVerDefault);
    setInvert(invertDefault);
    setBrightness(brightnessDefault);
    setContrast(contrastDefault);
    setBlur(blurDefault);
    setThreshold(thresholdDefault);
  }

  useEffect(() => {
    onChanged(image);
    setImageData(getImageDataFromJimpImage(image));
  }, [image, onChanged]);

  useEffect(() => {
    if (jimpImage === undefined) {
      return;
    }
    const newImage = jimpImage.clone();

    if (greyscale) {
      newImage.greyscale();
    }
    if (normalize) {
      newImage.normalize();
    }

    newImage.brightness(brightness);
    newImage.contrast(contrast);

    if (blur > 0) {
      newImage.blur(blur);
    }

    newImage.mirror(mirrorHor, mirrorVer);

    if (invert) {
      newImage.invert();
    }

    if (threshold > 0) {
      newImage.threshold({ max: threshold, autoGreyscale: false });
    }

    // const colorAdjustments = [];

    // if (saturation > 0) {
    //   colorAdjustments.push({ apply: 'saturate', params: [saturation] });
    // }
    // if (saturation < 0) {
    //   colorAdjustments.push({ apply: 'desaturate', params: [-saturation] });
    // }
    //
    // if (colorAdjustments.length > 0) {
    //   newImage.color(colorAdjustments);
    // }

    setImage(newImage);
  }, [jimpImage, normalize, brightness, contrast, greyscale, blur, mirrorHor, mirrorVer, invert, threshold]);

  const defaultsSet =
    normalize === normalizeDefault &&
    greyscale === greyscaleDefault &&
    mirrorHor === mirrorHorDefault &&
    mirrorVer === mirrorVerDefault &&
    invert === invertDefault &&
    contrast === contrastDefault &&
    brightness === brightnessDefault &&
    blur === blurDefault &&
    threshold === thresholdDefault;

  return (
    <>
      <h4>pre-processing</h4>
      <Container>
        <Canvas width={320} height={200} imageData={imageData} />
      </Container>
      <Container>
        <Button variant="contained" disabled={defaultsSet} onClick={() => reset()}>
          <AutorenewIcon /> &nbsp; defaults
        </Button>
      </Container>

      <Container align="left">
        <FormControlLabel
          control={
            <Checkbox
              checked={normalize}
              onChange={() => {
                setNormalize(!normalize);
              }}
              name="normalizeCheckbox"
            />
          }
          label="normalize"
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={greyscale}
              onChange={() => {
                setGreyscale(!greyscale);
              }}
              name="greyscaleCheckbox"
            />
          }
          label="greyscale"
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={invert}
              onChange={() => {
                setInvert(!invert);
              }}
              name="invertCheckbox"
            />
          }
          label="invert"
        />
      </Container>
      <Container align="left">
        <FormControlLabel
          control={
            <Checkbox
              checked={mirrorHor}
              onChange={() => {
                setMirrorHor(!mirrorHor);
              }}
              name="mirrorHorCheckbox"
            />
          }
          label="flip horizontal"
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={mirrorVer}
              onChange={() => {
                setMirrorVer(!mirrorVer);
              }}
              name="mirrorVerCheckbox"
            />
          }
          label="flip vertical"
        />
      </Container>
      <Typography gutterBottom>brightness</Typography>
      <Grid container>
        <Grid item>
          <Brightness5OutlinedIcon />
        </Grid>
        <Grid item xs>
          <Slider
            min={-1.0}
            max={1.0}
            step={0.05}
            value={brightness}
            onChange={(event, newValue) => setBrightness(newValue)}
            valueLabelDisplay="on"
          />
        </Grid>
      </Grid>
      <Typography gutterBottom>contrast</Typography>
      <Grid container>
        <Grid item>
          <Brightness6OutlinedIcon />
        </Grid>
        <Grid item xs>
          <Slider
            min={-1.0}
            max={1.0}
            step={0.05}
            value={contrast}
            onChange={(event, newValue) => setContrast(newValue)}
            valueLabelDisplay="on"
          />
        </Grid>
      </Grid>

      <Typography gutterBottom>blur</Typography>
      <Grid container>
        <Grid item>
          <BlurOnOutlinedIcon />
        </Grid>
        <Grid item xs>
          <Slider
            min={0}
            max={10}
            value={blur}
            onChange={(event, newValue) => setBlur(newValue)}
            valueLabelDisplay="on"
          />
        </Grid>
      </Grid>

      <Typography gutterBottom>threshold</Typography>
      <Grid container>
        <Grid item>
          <BrokenImageOutlinedIcon />
        </Grid>
        <Grid item xs>
          <Slider
            min={0}
            max={255}
            value={threshold}
            onChange={(event, newValue) => setThreshold(newValue)}
            valueLabelDisplay="on"
          />
        </Grid>
      </Grid>

      {/* <Typography variant="h5">color adjustments (slow)</Typography> */}
      {/* <Typography gutterBottom>saturation</Typography> */}
      {/* <Grid container> */}
      {/*   <Grid item> */}
      {/*     <FormatColorResetOutlinedIcon /> */}
      {/*   </Grid> */}
      {/*   <Grid item xs> */}
      {/*     <Slider */}
      {/*       min={-100} */}
      {/*       max={100} */}
      {/*       value={saturation} */}
      {/*       onChange={(event, newValue) => setSaturation(newValue)} */}
      {/*       valueLabelDisplay="on" */}
      {/*     /> */}
      {/*   </Grid> */}
      {/* </Grid> */}
    </>
  );
}

ImagePreProcessor.propTypes = {
  jimpImage: PropTypes.shape(),
  onChanged: PropTypes.func.isRequired
};

ImagePreProcessor.defaultProps = {
  jimpImage: undefined
};

export default ImagePreProcessor;
