import React, { useEffect, useState } from 'react';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
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
      label="Hires"
    />
  );
}

HiresCheckbox.propTypes = {
  onChange: PropTypes.func.isRequired
};

export default HiresCheckbox;
