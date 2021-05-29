import React from 'react';
import PropTypes from 'prop-types';
import { Tooltip } from '@material-ui/core';
import LiveHelpIcon from '@material-ui/icons/LiveHelp';

function HelpPopup(props) {
  const { content } = props;

  return (
    <Tooltip title={content}>
      <LiveHelpIcon />
    </Tooltip>
  );
}

HelpPopup.propTypes = {
  content: PropTypes.node.isRequired
};

export default HelpPopup;
