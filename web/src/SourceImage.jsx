import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import * as Jimp from 'jimp';
import { Container } from '@material-ui/core';
import ImageUpload from './ImageUpload';
import Canvas from './Canvas';
import { clearJimpImage, getImageDataFromJimpImage } from './Utilities';
import ProfileSelection from './ProfileSelection';

// https://www.reddit.com/r/cemu/comments/aq2wbs/scale_filter_comparison_bilinear_vs_bicubic_vs/
// Let user upload image, scale it, and call callback with a jimpimage
function SourceImage(props) {
  const { onChanged } = props;

  const [uploadedImage, setUploadedImage] = useState(undefined);
  const [image, setImage] = useState(undefined);
  const [imageData, setImageData] = useState(undefined);
  const [scale, setScale] = useState('fill');

  function onUploaded(jimpImage) {
    setUploadedImage(jimpImage);
  }

  function cropJimpImage(jimpImage) {
    const isTooSmall = jimpImage.bitmap.width < 320 || jimpImage.bitmap.height < 200;
    let blitImage;

    if (isTooSmall) {
      blitImage = jimpImage.clone();
    }
    jimpImage.crop(0, 0, 320, 200);
    if (blitImage !== undefined) {
      clearJimpImage(jimpImage);
      jimpImage.blit(blitImage, 0, 0);
    }
  }

  useEffect(() => {
    if (uploadedImage === undefined) {
      return;
    }

    const newImage = uploadedImage.clone();
    if (scale === 'fill') {
      newImage.cover(320, 200, Jimp.RESIZE_HERMITE);
    } else if (scale === 'fit') {
      newImage.contain(320, 200, Jimp.RESIZE_HERMITE);
    } else {
      cropJimpImage(newImage);
    }
    setImage(newImage);
  }, [uploadedImage, scale]);

  useEffect(() => {
    onChanged(image);
    setImageData(getImageDataFromJimpImage(image));
  }, [image, onChanged]);

  return (
    <>
      <h2>input</h2>
      <Container>
        <Canvas width={320} height={200} imageData={imageData} />
        <ImageUpload onload={jimpImage => onUploaded(jimpImage)} />
      </Container>
      <Container align="left">
        <ProfileSelection
          label="cropping"
          items={['crop', 'fill', 'fit']}
          initialValue="fill"
          onChange={value => {
            setScale(value);
          }}
        />
      </Container>
    </>
  );
}

SourceImage.propTypes = {
  onChanged: PropTypes.func.isRequired
};

export default SourceImage;
