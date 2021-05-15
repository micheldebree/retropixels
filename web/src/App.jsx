import React, { useEffect, useState } from 'react';
import Canvas from './Canvas';
import ImageUpload from './ImageUpload';
import './App.css';
import { getImageDataFromJimpImage } from './Utilities';
import TargetImage from './TargetImage';

// https://github.com/harishmahamure/photoCompress

function App() {
  const [sourceImage, setSourceImage] = useState(undefined);
  const [sourceImageData, setSourceImageData] = useState(undefined);

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
      <header className="App-header">
        <Canvas width={320} height={200} imageData={sourceImageData} />
        <TargetImage jimpImage={sourceImage} />
        <ImageUpload onload={onImageLoad} />
      </header>
    </div>
  );
}

export default App;
