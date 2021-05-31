import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import * as Jimp from 'jimp';
import { Button, Container } from '@material-ui/core';
import Brightness5OutlinedIcon from '@material-ui/icons/Brightness5Outlined';
import Brightness6OutlinedIcon from '@material-ui/icons/Brightness6Outlined';
import BrokenImageOutlinedIcon from '@material-ui/icons/BrokenImageOutlined';
import BlurOnOutlinedIcon from '@material-ui/icons/BlurOnOutlined';
import AutorenewIcon from '@material-ui/icons/Autorenew';
import { getImageDataFromJimpImage, cropJimpImage, abbreviateFilename } from './Utilities';
import ImageUpload from './ImageUpload';
import ProfileSelection from './ProfileSelection';
import MyCheckbox from './MyCheckbox';
import MySlider from './MySlider';
import ResetButton from './ResetButton';

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
          tooltip="Type of cropping to apply to source image"
        />
      </Container>

      <ResetButton onClick={reset} disabled={defaultsSet} />

      <Container align="left">
        <MyCheckbox
          name="normalize"
          label="normalize"
          value={normalize}
          onChange={v => setNormalize(v)}
          tooltip="Stretch color intensities to their full range"
        />
        <MyCheckbox
          name="greyscale"
          label="greyscale"
          value={greyscale}
          onChange={v => setGreyscale(v)}
          tooltip="Convert to black and white"
        />
        <MyCheckbox name="invert" label="invert" value={invert} onChange={v => setInvert(v)} tooltip="Invert colors" />
        <MyCheckbox
          name="mirrorHor"
          label="flip horizontal"
          value={mirrorHor}
          onChange={v => setMirrorHor(v)}
          tooltip="Mirror image horizontally"
        />
        <MyCheckbox
          name="mirrorVer"
          label="flip vertical"
          value={mirrorVer}
          onChange={v => setMirrorVer(v)}
          tooltip="Mirror image vertically"
        />
        <MySlider
          label="brightness"
          value={brightness}
          min={-1.0}
          max={1.0}
          step={0.05}
          onChange={v => setBrightness(v)}
          tooltip="Adjust image brightness"
          icon={<Brightness5OutlinedIcon />}
        />
        <MySlider
          label="contrast"
          value={contrast}
          min={-1.0}
          max={1.0}
          step={0.05}
          onChange={v => setContrast(v)}
          tooltip="Adjust image contrast"
          icon={<Brightness6OutlinedIcon />}
        />
        <MySlider
          label="blur"
          value={blur}
          max={10}
          onChange={v => setBlur(v)}
          tooltip="Blur image by this many pixels"
          icon={<BlurOnOutlinedIcon />}
        />
        <MySlider
          label="threshold"
          value={threshold}
          max={255}
          onChange={v => setThreshold(v)}
          tooltip="Convert to black and white and remove pixels below this intensity threshold. (0 = off)"
          icon={<BrokenImageOutlinedIcon />}
        />
      </Container>
    </>
  );
}

ImagePreProcessor.propTypes = {
  onChanged: PropTypes.func.isRequired
};

export default ImagePreProcessor;
