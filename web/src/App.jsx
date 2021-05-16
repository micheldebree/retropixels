import React, { useEffect, useState } from 'react';
import { ColorSpaces } from 'retropixels-core';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Canvas from './Canvas';
import ImageUpload from './ImageUpload';
import './App.css';
import { getImageDataFromJimpImage } from './Utilities';
import TargetImage from './TargetImage';
import HiresCheckbox from './HiresCheckbox';
import ProfileSelection from './ProfileSelection';

// https://github.com/harishmahamure/photoCompress

function App() {
  const colorspaceOptions = ['rgb', 'yuv', 'xyz', 'rainbow', 'oklab'];
  const colorspaceDefault = 'xyz';

  const [sourceImage, setSourceImage] = useState(undefined);
  const [sourceImageData, setSourceImageData] = useState(undefined);
  const [hires, setHires] = useState(false);
  const [colorspace, setColorSpace] = useState(ColorSpaces.all.colodore);

  function onImageLoad(jimpImage) {
    jimpImage.cover(320, 200);
    jimpImage.resize(160, 200);
    setSourceImage(jimpImage);
  }

  useEffect(() => {
    const imageData = getImageDataFromJimpImage(sourceImage);
    setSourceImageData(imageData);
  }, [sourceImage]);

  return (
    <div className="App">
      {/* <header className="App-header">Retropixels</header> */}
      <body className="App-body">
        <Grid container spacing={3}>
          <Grid item xs={4}>
            Input
            <Paper elevation={3}>
              <ImageUpload onload={onImageLoad} />
            </Paper>
            <Canvas width={320} height={200} imageData={sourceImageData} />
          </Grid>
          <Grid item xs={4}>
            <HiresCheckbox onChange={value => setHires(value)} />
            <ProfileSelection
              label="colorspace"
              initialValue={colorspaceDefault}
              items={colorspaceOptions}
              onChange={value => setColorSpace(value)}
            />
          </Grid>
          <Grid item xs={4}>
            Output
            <TargetImage jimpImage={sourceImage} hires={hires} colorspaceId={colorspace} />
          </Grid>
        </Grid>
      </body>
    </div>
  );
}

export default App;
