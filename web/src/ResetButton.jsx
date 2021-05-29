import React from 'react';
import PropTypes from 'prop-types';
import { Button, Container, Tooltip } from '@material-ui/core';
import AutorenewIcon from '@material-ui/icons/Autorenew';

function ResetButton(props) {
  const { onClick, disabled } = props;

  return (
    <Container align="left">
      <Tooltip title="Reset controls below to their default settings" arrow>
        <Button size="small" disabled={disabled} startIcon={<AutorenewIcon />} onClick={onClick}>
          defaults
        </Button>
      </Tooltip>
    </Container>
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
