import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Box } from '@material-ui/core';

function Canvas(props) {
  const canvasRef = React.useRef(null);
  const getContext = () => canvasRef.current.getContext('2d');

  const { width, height, imageData } = props;

  // if imagedata property is set/changes, draw it on the canvas
  useEffect(() => {
    if (imageData !== undefined) {
      getContext().putImageData(imageData, 0, 0);
    }
  }, [imageData]);

  return (
    <Box m={2}>
      <canvas ref={canvasRef} width={width} height={height} />
    </Box>
  );
}

Canvas.propTypes = {
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  imageData: PropTypes.shape()
};

Canvas.defaultProps = {
  imageData: undefined
};

export default Canvas;
