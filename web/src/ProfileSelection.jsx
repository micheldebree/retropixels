import React from 'react';
import PropTypes from 'prop-types';
import { Radio, RadioGroup, FormControlLabel, FormControl, FormLabel, Tooltip } from '@material-ui/core';

function ProfileSelection(props) {
  const { label, value, items, onChange, tooltip } = props;

  return (
    <Tooltip title={tooltip}>
      <FormControl component="fieldset">
        <FormLabel component="legend">{label}</FormLabel>
        <RadioGroup
          row
          aria-label={label}
          name={`select${label}`}
          value={value}
          onChange={event => onChange(event.target.value)}
        >
          {items.map(i => (
            <FormControlLabel key={i} value={i} control={<Radio />} label={i} />
          ))}
        </RadioGroup>
      </FormControl>
    </Tooltip>
  );
}

ProfileSelection.propTypes = {
  label: PropTypes.string,
  value: PropTypes.string.isRequired,
  items: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
  onChange: PropTypes.func.isRequired,
  tooltip: PropTypes.string.isRequired
};

ProfileSelection.defaultProps = {
  label: 'Choose'
};

export default ProfileSelection;
