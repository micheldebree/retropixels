import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

// https://blog.koenvangilst.nl/react-hooks-with-canvas/
// https://www.w3schools.com/Tags/canvas_putimagedata.asp

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

  return <canvas ref={canvasRef} width={width} height={height} />;
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
