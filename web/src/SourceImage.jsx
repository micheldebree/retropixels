import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Card, CardContent, CardMedia } from '@material-ui/core';
import ImageUpload from './ImageUpload';
import Canvas from './Canvas';
import { getImageDataFromJimpImage } from './Utilities';

// Let user upload image, scale it, and call callback with a jimpimage
function SourceImage(props) {
  const { onChanged } = props;

  const [image, setImage] = useState(undefined);
  const [imageData, setImageData] = useState(undefined);

  function onUploaded(jimpImage) {
    const newImage = jimpImage.clone();
    newImage.cover(320, 200);
    setImage(newImage);
  }

  useEffect(() => {
    onChanged(image);
    setImageData(getImageDataFromJimpImage(image));
  }, [image, onChanged]);

  return (
    <>
      <h2>input</h2>
      <Canvas width={320} height={200} imageData={imageData} />
      <ImageUpload onload={jimpImage => onUploaded(jimpImage)} />
      {/* <ProfileSelection items={['crop', 'fill', 'fit']} onChange={() => {}} /> */}
    </>
  );
}

SourceImage.propTypes = {
  onChanged: PropTypes.func.isRequired
};

export default SourceImage;
