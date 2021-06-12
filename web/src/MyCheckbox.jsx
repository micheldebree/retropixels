import React from 'react';
import PropTypes from 'prop-types';
import { Checkbox, FormControlLabel, Tooltip } from '@material-ui/core';

function MyCheckbox(props) {
  const { name, label, value, onChange, tooltip } = props;

  return (
    <Tooltip title={tooltip} arrow>
      <FormControlLabel
        control={
          <Checkbox checked={value} onChange={event => onChange(event.target.checked)} name={`${name}Checkbox`} />
        }
        label={label}
      />
    </Tooltip>
  );
}

MyCheckbox.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  value: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
  tooltip: PropTypes.string.isRequired
};

export default MyCheckbox;
