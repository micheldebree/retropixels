import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';

function ProfileSelection(props) {
  const { label, initialValue, items, onChange } = props;

  const [value, setValue] = useState(initialValue);

  const handleChange = event => {
    setValue(event.target.value);
  };

  useEffect(() => {
    onChange(value);
  }, [value, onChange]);

  return (
    <FormControl component="fieldset">
      <FormLabel component="legend">{label}</FormLabel>
      <RadioGroup aria-label={label} name={`select${label}`} value={value} onChange={handleChange}>
        {items.map(i => (
          <FormControlLabel value={i} control={<Radio />} label={i} />
        ))}
      </RadioGroup>
    </FormControl>
  );
}

ProfileSelection.propTypes = {
  label: PropTypes.string,
  initialValue: PropTypes.string.isRequired,
  items: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
  onChange: PropTypes.func.isRequired
};

ProfileSelection.defaultProps = {
  label: 'Choose'
};

export default ProfileSelection;
