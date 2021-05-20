import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Container, Typography, FormControlLabel, Checkbox, Slider } from '@material-ui/core';
import { getImageDataFromJimpImage } from './Utilities';
import Canvas from './Canvas';

function ImagePreProcessor(props) {
  const { jimpImage, onChanged } = props;

  const [image, setImage] = useState(undefined);
  const [imageData, setImageData] = useState(undefined);
  const [normalize, setNormalize] = useState(true);
  const [greyscale, setGreyScale] = useState(false);
  const [mirrorHor, setMirrorHor] = useState(false);
  const [mirrorVer, setMirrorVer] = useState(false);
  const [invert, setInvert] = useState(false);
  const [brightness, setBrightness] = useState(0);
  const [contrast, setContrast] = useState(0);
  const [blur, setBlur] = useState(0);

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

    setImage(newImage);
  }, [jimpImage, normalize, brightness, contrast, greyscale, blur, mirrorHor, mirrorVer, invert]);

  return (
    <>
      <h2>pre-processing</h2>
      <Container>
        <Canvas width={320} height={200} imageData={imageData} />
      </Container>

      <Container>
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
          label="Normalize"
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={greyscale}
              onChange={() => {
                setGreyScale(!greyscale);
              }}
              name="greyscaleCheckbox"
            />
          }
          label="Greyscale"
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
          label="Invert"
        />
        <Container>
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
            label="Flip Horizontal"
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
            label="Flip Vertical"
          />
        </Container>
        <Typography gutterBottom>Brightness</Typography>
        <Slider
          min={-1.0}
          max={1.0}
          step={0.1}
          value={brightness}
          onChange={(event, newValue) => setBrightness(newValue)}
          valueLabelDisplay="on"
        />
        <Typography gutterBottom>Contrast</Typography>
        <Slider
          min={-1.0}
          max={1.0}
          step={0.1}
          value={contrast}
          onChange={(event, newValue) => setContrast(newValue)}
          valueLabelDisplay="on"
        />
        <Typography gutterBottom>Blur</Typography>
        <Slider
          min={0}
          max={10}
          value={blur}
          onChange={(event, newValue) => setBlur(newValue)}
          valueLabelDisplay="on"
        />
      </Container>
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
