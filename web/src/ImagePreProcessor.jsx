import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Typography, CardContent, CardMedia, FormControlLabel, Checkbox, Slider } from '@material-ui/core';
import ProfileSelection from './ProfileSelection';
import { getImageDataFromJimpImage } from './Utilities';
import Canvas from './Canvas';

function ImagePreProcessor(props) {
  const { jimpImage, onChanged } = props;

  const [image, setImage] = useState(undefined);
  const [imageData, setImageData] = useState(undefined);
  const [normalize, setNormalize] = useState(true);
  const [brightness, setBrightness] = useState(0);

  useEffect(() => {
    onChanged(image);
    setImageData(getImageDataFromJimpImage(image));
  }, [image, onChanged]);

  useEffect(() => {
    if (jimpImage === undefined) {
      return;
    }
    const newImage = jimpImage.clone();
    // ditherer.dither(newImage.bitmap);
    // TODO: this is a workaround for a bug in dithering
    // that clears the alpha channel
    // newImage.opaque();

    if (normalize) {
      newImage.normalize();
    }

    newImage.color([{ apply: 'brighten', params: [brightness] }]);

    setImage(newImage);
  }, [jimpImage, normalize, brightness]);

  return (
    <>
      <h2>pre-processing</h2>
      <CardMedia>
        <Canvas width={320} height={200} imageData={imageData} />
      </CardMedia>
      <CardContent>
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
        <Typography gutterBottom>Brighten</Typography>
        <Slider
          min={0}
          max={100}
          value={brightness}
          onChange={(event, newValue) => setBrightness(newValue)}
          valueLabelDisplay="on"
        />
      </CardContent>
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
