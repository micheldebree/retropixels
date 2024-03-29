import React, { useState, useEffect } from 'react';
import Jimp from 'jimp/es';
import PropTypes from 'prop-types';
import { useDropzone } from 'react-dropzone';
import { Container, Box, Snackbar, Typography } from '@mui/material';
import { Alert } from '@mui/lab';
import Canvas from './Canvas';

// Lets the user select an image file
// When a valid image is selected, calls the "onload" callback with a JimpImage object.
function ImageUpload(props) {
  const { onload, imageData } = props;

  const [error, setError] = useState(undefined);
  const { acceptedFiles, fileRejections, getRootProps, getInputProps } = useDropzone({
    accept: 'image/*',
    maxFiles: 1
  });

  useEffect(() => {
    const readFile = file => {
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
    };
    if (acceptedFiles !== undefined && acceptedFiles.length === 1) {
      readFile(acceptedFiles[0]);
    }
  }, [acceptedFiles, onload]);

  useEffect(() => {
    if (fileRejections !== undefined && fileRejections.length > 0) {
      const rejectedFile = fileRejections[0];
      const errorMessages = rejectedFile.errors.map(e => e.message).reduce((a, e) => `${a},${e}`);
      setError(`Cannot load ${rejectedFile.file.path}: ${errorMessages}`);
    }
  }, [fileRejections]);

  return (
    <Container>
      <Box border={0} m={1} boxShadow={2} borderRadius="borderRadius" borderColor="textSecondary">
        <div {...getRootProps({ className: 'dropzone' })}>
          <input {...getInputProps()} />
          <Canvas width={320} height={200} imageData={imageData} />
          <Typography color="textSecondary" gutterBottom>
            Drop image here, or click to browse
          </Typography>
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
  onload: PropTypes.func.isRequired,
  imageData: PropTypes.shape()
};

ImageUpload.defaultProps = {
  imageData: undefined
};
export default ImageUpload;
