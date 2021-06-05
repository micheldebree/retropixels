import React from 'react';
import PropTypes from 'prop-types';
import { Grid, Slider, Tooltip, FormLabel } from '@material-ui/core';

function MySlider(props) {
  const { label, value, min, max, step, onChange, tooltip, icon, disabled } = props;

  return (
    <>
      <FormLabel component="legend">{label}</FormLabel>
      <Tooltip title={tooltip} arrow>
        <Grid container>
          <Grid item>{icon} &nbsp;</Grid>
          <Grid item xs>
            <Slider
              min={min}
              max={max}
              step={step}
              value={value}
              onChange={(event, newValue) => onChange(newValue)}
              valueLabelDisplay="auto"
              disabled={disabled}
            />
          </Grid>
        </Grid>
      </Tooltip>
    </>
  );
}

MySlider.propTypes = {
  icon: PropTypes.node.isRequired,
  label: PropTypes.string.isRequired,
  value: PropTypes.number.isRequired,
  min: PropTypes.number,
  max: PropTypes.number.isRequired,
  step: PropTypes.number,
  onChange: PropTypes.func.isRequired,
  tooltip: PropTypes.string.isRequired,
  disabled: PropTypes.bool
};

MySlider.defaultProps = {
  min: 0,
  step: 1,
  disabled: false
};

export default MySlider;
