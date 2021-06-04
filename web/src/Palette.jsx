import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Checkbox, FormControlLabel, Grid, List, ListItem, ListItemIcon, ListItemText } from '@material-ui/core';
import { Palette } from 'retropixels-core';
import Brightness1Icon from '@material-ui/icons/Brightness1';

function PaletteControl(props) {
  const { palette, onChange } = props;

  const [enabledMap, setEnabledMap] = useState({
    0: true,
    1: true,
    2: true,
    3: true,
    4: true,
    5: true,
    6: true,
    7: true,
    8: true,
    9: true,
    10: true,
    11: true,
    12: true,
    13: true,
    14: true,
    15: true
  });

  function onChanged(index) {
    return () => {
      enabledMap[index] = !enabledMap[index];
      const enabledColors = [];
      for (let i = 0; i < 16; i++) {
        if (enabledMap[i]) {
          enabledColors.push(i);
        }
      }
      if (enabledColors.length < 2) {
        enabledMap[index] = !enabledMap[index];
      } else {
        setEnabledMap(enabledMap);
        onChange(enabledColors);
      }
    };
  }

  function subPalette(startIndex) {
    const result = [];
    for (let i = startIndex; i < startIndex + 8; i++) {
      const r = palette.colors[i][0];
      const g = palette.colors[i][1];
      const b = palette.colors[i][2];
      result.push(
        <ListItem key={`color${r}${g}${b}`}>
          <ListItemIcon>
            <Checkbox checked={enabledMap[i]} onChange={onChanged(i)} name={`color${i}cb`} />
          </ListItemIcon>
          <Brightness1Icon fontSize="small" style={{ color: `rgb(${r}, ${g}, ${b})` }} />
        </ListItem>
      );
    }
    return result;
  }

  return (
    <>
      <Grid container>
        <Grid item>
          <List dense="true">{subPalette(0)}</List>
        </Grid>
        <Grid item>
          <List dense="true">{subPalette(8)}</List>
        </Grid>
      </Grid>
    </>
  );
}

PaletteControl.propTypes = {
  palette: PropTypes.instanceOf(Palette).isRequired,
  onChange: PropTypes.func.isRequired
};

export default PaletteControl;
