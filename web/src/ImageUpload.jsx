import React, { useState, useEffect } from 'react';
import Jimp from 'jimp/es';
import PropTypes from 'prop-types';
import { useDropzone } from 'react-dropzone';
import { Container, Box, Snackbar } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';

// TODO: return Jimp Image
// TODO: Only accept image types

// Let's the user select an image file
// When a valid image is selected, calls the "onload" callback with a JimpImage object.
function ImageUpload(props) {
  const { onload } = props;

  const [error, setError] = useState(undefined);
  const { acceptedFiles, fileRejections, getRootProps, getInputProps } = useDropzone({
    accept: 'image/*',
    maxFiles: 1
  });

  function readFile(file) {
    const reader = new FileReader();

    reader.onabort = () => setError('file reading was aborted');
    reader.onerror = () => setError('file reading has failed');
    reader.onload = () => {
      Jimp.read(reader.result)
        .then(img => {
          setError(undefined);
          onload({ jimpImage: img, filename: file.name });
        })
        .catch(err => {
          setError(err.message);
        });
    };
    reader.readAsArrayBuffer(file);
  }

  useEffect(() => {
    if (acceptedFiles !== undefined && acceptedFiles.length === 1) {
      readFile(acceptedFiles[0]);
    }
  }, [acceptedFiles]);

  useEffect(() => {
    if (fileRejections !== undefined && fileRejections.length > 0) {
      setError(`Cannot load' + ${fileRejections[0].file}`);
    }
  }, [fileRejections]);

  // const rejected = fileRejections !== undefined ? fileRejections.length : 0;
  // const accepted = acceptedFiles !== undefined ? acceptedFiles.length : 0;

  return (
    <Container>
      <Box border={0} m={1} boxShadow={2}>
        <div {...getRootProps({ className: 'dropzone' })}>
          <input {...getInputProps()} />
          <p>Drop image here, or click to select image</p>
          <CloudUploadIcon />
          {/* <p>{rejected} rejected</p> */}
          {/* <p>{accepted} accepted</p> */}
        </div>
      </Box>
      <Snackbar open={error} autoHideDuration={6000} onClose={() => setError(undefined)}>
        <Alert severity="error">{error}</Alert>
      </Snackbar>
    </Container>
  );
}

ImageUpload.propTypes = {
  // callback when image is loaded successfully
  onload: PropTypes.func.isRequired
};

export default ImageUpload;
