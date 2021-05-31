import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Checkbox, FormControlLabel } from '@material-ui/core';
import { Palette } from 'retropixels-core';

function PaletteControl(props) {
  const { palette, enabledColors, onChange } = props;

  function onChanged(index, findIndex) {
    if (findIndex >= 0) {
      enabledColors.splice(findIndex, 1);
    } else {
      enabledColors.push(index);
    }

    onChange(enabledColors);
  }

  return palette.colors.map((color, index) => {
    const findIndex = enabledColors.indexOf(index);
    return (
      <FormControlLabel
        control={
          <Checkbox checked={findIndex >= 0} onChange={() => onChanged(index, findIndex)} name={`color${index}cb`} />
        }
        label={index}
      />
    );
  });
}

PaletteControl.propTypes = {
  palette: PropTypes.instanceOf(Palette).isRequired,
  enabledColors: PropTypes.arrayOf(PropTypes.number),
  onChange: PropTypes.func.isRequired
};

export default PaletteControl;
