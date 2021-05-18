import React, { useState } from 'react';
import { DropzoneArea } from 'material-ui-dropzone';
import Jimp from 'jimp/es';
import PropTypes from 'prop-types';
import { Card, Snackbar } from '@material-ui/core';
import { Alert } from '@material-ui/lab';

// TODO: return Jimp Image
// TODO: Only accept image types

// Let's the user select an image file
// When a valid image is selected, calls the "onload" callback with a JimpImage object.
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
      <DropzoneArea
        onChange={acceptFiles}
        acceptedFiles={['image/*']}
        filesLimit={1}
        showPreviewsInDropzone={false}
        dropzoneText="Drag and drop an image here or click"
      />
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
