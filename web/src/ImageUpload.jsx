import React, { useState } from 'react';
import Dropzone from 'react-dropzone';
import Jimp from 'jimp/es';
import PropTypes from 'prop-types';
import { Snackbar } from '@material-ui/core';
import { Alert } from '@material-ui/lab';

// TODO: return Jimp Image
// TODO: Only accept image types

// Let's the user select an image file
// When a valid image is selected, calls the "onload" callback with an ImageData object.
function ImageUpload(props) {
  const { onload } = props;

  const [error, setError] = useState(undefined);

  function readFile(file) {
    const reader = new FileReader();

    reader.onabort = () => setError('file reading was aborted');
    reader.onerror = () => setError('file reading has failed');
    reader.onload = () => {
      Jimp.read(reader.result)
        .then(img => {
          setError(undefined);
          onload(img);
        })
        .catch(err => {
          setError(err.message);
        });
    };
    reader.readAsArrayBuffer(file);
  }

  function acceptFiles(acceptedFiles) {
    acceptedFiles.forEach(f => readFile(f));
  }

  return (
    <>
      <Dropzone
        onDrop={acceptFiles}
        maxFiles={1}
        accept="image/jpeg, image/png, image/gif"
        onDropRejected={() => setError('Not a supported image file.')}
      >
        {({ getRootProps, getInputProps }) => (
          <section>
            <div {...getRootProps()}>
              <input {...getInputProps()} />
              <p>Drag and drop image file, or click to select file</p>
            </div>
          </section>
        )}
      </Dropzone>
      <Snackbar open={error} autoHideDuration={6000} onClose={() => setError(undefined)}>
        <Alert severity="error">{error}</Alert>
      </Snackbar>
    </>
  );
}

ImageUpload.propTypes = {
  // callback when image is loaded successfully
  onload: PropTypes.func.isRequired
};

export default ImageUpload;
