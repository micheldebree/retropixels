import React, { useEffect, useState } from 'react';
import { FormControlLabel, Checkbox } from '@material-ui/core';
import PropTypes from 'prop-types';

function HiresCheckbox(props) {
  const { onChange } = props;

  const [checked, setChecked] = useState(false);

  function handleOnChange() {
    setChecked(!checked);
  }

  useEffect(() => {
    onChange(checked);
  }, [checked]);

  return (
    <FormControlLabel
      control={<Checkbox checked={checked} onChange={handleOnChange} name="hiresCheckbox" />}
      label="hires"
    />
  );
}

HiresCheckbox.propTypes = {
  onChange: PropTypes.func.isRequired
};

export default HiresCheckbox;
