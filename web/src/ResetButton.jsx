import React from 'react';
import PropTypes from 'prop-types';
import { Button, Box, Tooltip } from '@material-ui/core';
import AutorenewIcon from '@material-ui/icons/Autorenew';

function ResetButton(props) {
  const { onClick, disabled } = props;

  return (
    <Box align="left" m={2}>
      <Tooltip title="Reset controls below to their default settings" arrow>
        <Button size="small" variant="outlined" disabled={disabled} startIcon={<AutorenewIcon />} onClick={onClick}>
          defaults
        </Button>
      </Tooltip>
    </Box>
  );
}

ResetButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  disabled: PropTypes.bool
};

ResetButton.defaultProps = {
  disabled: false
};

export default ResetButton;
