import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import * as Jimp from 'jimp';
import { Button, Container, Grid, FormControlLabel, Checkbox, Slider, FormLabel } from '@material-ui/core';
import Brightness5OutlinedIcon from '@material-ui/icons/Brightness5Outlined';
import Brightness6OutlinedIcon from '@material-ui/icons/Brightness6Outlined';
import BrokenImageOutlinedIcon from '@material-ui/icons/BrokenImageOutlined';
import BlurOnOutlinedIcon from '@material-ui/icons/BlurOnOutlined';
import AutorenewIcon from '@material-ui/icons/Autorenew';
import { getImageDataFromJimpImage, cropJimpImage, abbreviateFilename } from './Utilities';
import ImageUpload from './ImageUpload';
import ProfileSelection from './ProfileSelection';

function ImagePreProcessor(props) {
  const { onChanged } = props;

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

  const [sourceImage, setSourceImage] = useState(undefined);
  const [croppedImage, setCroppedImage] = useState(undefined);
  const [image, setImage] = useState(undefined);
  const [filename, setFilename] = useState('input');
  const [imageData, setImageData] = useState(undefined);
  const [scale, setScale] = useState('fill');
  const [normalize, setNormalize] = useState(normalizeDefault);
  const [greyscale, setGreyscale] = useState(greyscaleDefault);
  const [mirrorHor, setMirrorHor] = useState(mirrorHorDefault);
  const [mirrorVer, setMirrorVer] = useState(mirrorVerDefault);
  const [invert, setInvert] = useState(invertDefault);
  const [brightness, setBrightness] = useState(brightnessDefault);
  const [contrast, setContrast] = useState(contrastDefault);
  const [blur, setBlur] = useState(blurDefault);
  const [threshold, setThreshold] = useState(thresholdDefault);

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

  function onUploaded(newUploadedImage) {
    setSourceImage(newUploadedImage.jimpImage);
    setFilename(newUploadedImage.filename);
  }

  // if the processed image has changed, notify owner
  useEffect(() => {
    if (image !== undefined) {
      onChanged({ jimpImage: image, filename });
      setImageData(getImageDataFromJimpImage(image));
    }
  }, [image, onChanged, filename]);

  // if the source image has changed, apply cropping
  useEffect(() => {
    if (sourceImage === undefined) {
      return;
    }

    const newImage = sourceImage.clone();
    if (scale === 'fill') {
      newImage.cover(320, 200, Jimp.RESIZE_HERMITE);
    } else if (scale === 'fit') {
      newImage.contain(320, 200, Jimp.RESIZE_HERMITE);
    } else {
      cropJimpImage(newImage);
    }
    setCroppedImage(newImage);
  }, [sourceImage, scale]);

  useEffect(() => {
    if (croppedImage === undefined) {
      return;
    }
    const newImage = croppedImage.clone();

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

    setImage(newImage);
  }, [croppedImage, normalize, brightness, contrast, greyscale, blur, mirrorHor, mirrorVer, invert, threshold]);

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
      <h4>{abbreviateFilename(filename, 30)}</h4>
      <Container>
        <ImageUpload imageData={imageData} onload={onUploaded} />
      </Container>
      <Container align="left">
        <ProfileSelection
          label="cropping"
          items={['crop', 'fill', 'fit']}
          value={scale}
          onChange={value => {
            setScale(value);
          }}
        />
      </Container>
      <Container align="left">
        <Button size="small" disabled={defaultsSet} startIcon={<AutorenewIcon />} onClick={() => reset()}>
          defaults
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
        <FormLabel component="legend">brightness</FormLabel>
        <Grid container>
          <Grid item>
            <Brightness5OutlinedIcon /> &nbsp;
          </Grid>
          <Grid item xs>
            <Slider
              min={-1.0}
              max={1.0}
              step={0.05}
              value={brightness}
              onChange={(event, newValue) => setBrightness(newValue)}
              valueLabelDisplay="auto"
            />
          </Grid>
        </Grid>
        <FormLabel component="legend">contrast</FormLabel>
        <Grid container>
          <Grid item>
            <Brightness6OutlinedIcon /> &nbsp;
          </Grid>
          <Grid item xs>
            <Slider
              min={-1.0}
              max={1.0}
              step={0.05}
              value={contrast}
              onChange={(event, newValue) => setContrast(newValue)}
              valueLabelDisplay="auto"
            />
          </Grid>
        </Grid>
        <FormLabel component="legend">blur</FormLabel>
        <Grid container>
          <Grid item>
            <BlurOnOutlinedIcon /> &nbsp;
          </Grid>
          <Grid item xs>
            <Slider
              min={0}
              max={10}
              value={blur}
              onChange={(event, newValue) => setBlur(newValue)}
              valueLabelDisplay="auto"
            />
          </Grid>
        </Grid>
        <FormLabel component="legend">threshold</FormLabel>
        <Grid container>
          <Grid item>
            <BrokenImageOutlinedIcon /> &nbsp;
          </Grid>
          <Grid item xs>
            <Slider
              min={0}
              max={255}
              value={threshold}
              onChange={(event, newValue) => setThreshold(newValue)}
              valueLabelDisplay="auto"
            />
          </Grid>
        </Grid>
      </Container>
    </>
  );
}

ImagePreProcessor.propTypes = {
  onChanged: PropTypes.func.isRequired
};

export default ImagePreProcessor;
