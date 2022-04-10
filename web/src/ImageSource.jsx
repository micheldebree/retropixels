import React, { useEffect, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import * as Jimp from 'jimp';
import { Container } from '@mui/material';
import Brightness5OutlinedIcon from '@mui/icons-material/Brightness5Outlined';
import Brightness6OutlinedIcon from '@mui/icons-material/Brightness6Outlined';
import BrokenImageOutlinedIcon from '@mui/icons-material/BrokenImageOutlined';
import BlurOnOutlinedIcon from '@mui/icons-material/BlurOnOutlined';
import { abbreviateFilename } from './Utilities';
import ImageUpload from './ImageUpload';
import MyRadioButtons from './MyRadioButtons';
import MyCheckbox from './MyCheckbox';
import MySlider from './MySlider';
import ResetButton from './ResetButton';

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

function cropJimpImage(jimpImage) {
  const isTooSmall = jimpImage.bitmap.width < 320 || jimpImage.bitmap.height < 200;
  let blitImage;

  // if the image is too small, the cropped image is cleared,
  // and then the smaller image is blitted onto it
  // this is a workaround for artifacts when cropping images to larger sizes
  if (isTooSmall) {
    blitImage = jimpImage.clone();
  }
  jimpImage.crop(0, 0, 320, 200);
  if (blitImage !== undefined) {
    this.clearJimpImage(jimpImage);
    jimpImage.blit(blitImage, 0, 0);
  }
}

function cropImage(image, scale) {
  const newImage = image.clone();
  if (scale === 'fill') {
    newImage.cover(320, 200, Jimp.RESIZE_HERMITE);
  } else if (scale === 'fit') {
    newImage.contain(320, 200, Jimp.RESIZE_HERMITE);
  } else {
    cropJimpImage(newImage);
  }
  return newImage;
}

function getImageDataFromJimpImage(jimpImage) {
  if (jimpImage === undefined) {
    return undefined;
  }

  // TODO: Jimp does not seem to shrink the data array when resizing picture to a smaller size... Confirm?
  const dataSize = jimpImage.bitmap.width * jimpImage.bitmap.height * 4;
  let data;
  if (jimpImage.bitmap.data.length > dataSize) {
    data = jimpImage.bitmap.data.slice(0, dataSize);
  } else {
    data = jimpImage.bitmap.data;
  }

  return new ImageData(Uint8ClampedArray.from(data), jimpImage.bitmap.width, jimpImage.bitmap.height);
}

function ImageSource(props) {
  const { onChanged } = props;

  // the originally uploaded image
  const [sourceImage, setSourceImage] = useState(undefined);

  // the source image after cropping
  const [croppedImage, setCroppedImage] = useState(undefined);

  // the final processed image
  const [image, setImage] = useState(undefined);

  // the image data to show on the canvas
  const [imageData, setImageData] = useState(undefined);

  const [filename, setFilename] = useState('input');
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

  // memoize the callback to avoid re-rendering
  const onLoadedCallback = useCallback(img => {
    setSourceImage(img.jimpImage);
    setFilename(img.filename);
  }, []);

  // reset all controls to default
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
    setCroppedImage(cropImage(sourceImage, scale));
  }, [sourceImage, scale]);

  // if the cropped image or any of the controls change, update the image
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
        <ImageUpload imageData={imageData} onload={onLoadedCallback} />
      </Container>
      <Container align="left">
        <MyRadioButtons
          label="cropping"
          items={['crop', 'fill', 'fit']}
          value={scale}
          onChange={setScale}
          tooltip="Type of cropping to apply to source image"
        />
      </Container>

      <ResetButton onClick={reset} disabled={defaultsSet} />

      <Container align="left">
        <MyCheckbox
          name="normalize"
          label="normalize"
          value={normalize}
          onChange={setNormalize}
          tooltip="Stretch color intensities to their full range"
        />
        <MyCheckbox
          name="greyscale"
          label="greyscale"
          value={greyscale}
          onChange={setGreyscale}
          tooltip="Convert to black and white"
        />
        <MyCheckbox name="invert" label="invert" value={invert} onChange={v => setInvert(v)} tooltip="Invert colors" />
        <MyCheckbox
          name="mirrorHor"
          label="flip horizontal"
          value={mirrorHor}
          onChange={setMirrorHor}
          tooltip="Mirror image horizontally"
        />
        <MyCheckbox
          name="mirrorVer"
          label="flip vertical"
          value={mirrorVer}
          onChange={setMirrorVer}
          tooltip="Mirror image vertically"
        />
        <MySlider
          label="brightness"
          value={brightness}
          min={-1.0}
          max={1.0}
          step={0.05}
          onChange={setBrightness}
          tooltip="Adjust image brightness"
          icon={<Brightness5OutlinedIcon />}
        />
        <MySlider
          label="contrast"
          value={contrast}
          min={-1.0}
          max={1.0}
          step={0.05}
          onChange={setContrast}
          tooltip="Adjust image contrast"
          icon={<Brightness6OutlinedIcon />}
        />
        <MySlider
          label="blur"
          value={blur}
          max={10}
          onChange={setBlur}
          tooltip="Blur image by this many pixels"
          icon={<BlurOnOutlinedIcon />}
        />
        <MySlider
          label="threshold"
          value={threshold}
          max={255}
          onChange={setThreshold}
          tooltip="Convert to black and white and remove pixels below this intensity threshold. (0 = off)"
          icon={<BrokenImageOutlinedIcon />}
        />
      </Container>
    </>
  );
}

ImageSource.propTypes = {
  onChanged: PropTypes.func.isRequired
};

export default ImageSource;
