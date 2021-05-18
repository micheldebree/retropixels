import React, { useEffect, useState } from 'react';
import { Grid, Card } from '@material-ui/core';
import './App.css';
import SourceImage from './SourceImage';
import ImagePreProcessor from './ImagePreProcessor';
import Retropixels from './Retropixels';

// https://github.com/harishmahamure/photoCompress

function App() {
  const [sourceImage, setSourceImage] = useState(undefined);
  const [processedImage, setProcessedImage] = useState(undefined);

  return (
    <div className="App">
      {/* <header className="App-header">Retropixels</header> */}
      <body className="App-body">
        <Grid container spacing={3}>
          <Grid item component={Card} xs>
            <SourceImage onChanged={jimpImage => setSourceImage(jimpImage)} />
          </Grid>
          <Grid item component={Card} xs>
            <ImagePreProcessor jimpImage={sourceImage} onChanged={jimpImage => setProcessedImage(jimpImage)} />
          </Grid>
          <Grid item component={Card} xs>
            <Retropixels jimpImage={processedImage} />
          </Grid>
        </Grid>
      </body>
    </div>
  );
}

export default App;
