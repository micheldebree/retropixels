import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Checkbox, Grid, List, ListItem, ListItemIcon, Container, Box } from '@material-ui/core';
import { Palettes } from 'retropixels-core';
import Brightness1Icon from '@material-ui/icons/Brightness1';
import ProfileSelection from './ProfileSelection';
import ResetButton from './ResetButton';

const paletteOptions = ['colodore', 'pepto'];
const paletteIdDefault = 'colodore';

function PaletteControl(props) {
  const { onChange } = props;

  const enabledDefault = {
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
  };

  const [paletteId, setPaletteId] = useState(paletteIdDefault);
  const [palette, setPalette] = useState(Palettes.all[paletteId]);
  const [enabledMap, setEnabledMap] = useState(enabledDefault);

  useEffect(() => {
    const enabledColors = [];
    for (let i = 0; i < 16; i += 1) {
      if (enabledMap[i]) {
        enabledColors.push(i);
      }
    }
    const newPalette = { ...Palettes.all[paletteId] };
    newPalette.enabled = enabledColors;
    setPalette(newPalette);
  }, [paletteId, enabledMap]);

  useEffect(() => {
    onChange(palette);
  }, [palette, onChange]);

  // TODO: memoize
  const nrEnabled = Object.values(enabledMap).filter(v => v).length;

  const defaultsSet = nrEnabled === palette.colors.length && paletteId === paletteIdDefault;

  function reset() {
    setEnabledMap(enabledDefault);
    setPaletteId(paletteIdDefault);
  }

  function onChanged(index) {
    return () => {
      const newValue = !enabledMap[index];
      if (!newValue && nrEnabled <= 1) {
        return;
      }
      const newEnabledMap = { ...enabledMap };
      newEnabledMap[index] = newValue;
      setEnabledMap(newEnabledMap);
    };
  }

  function subPalette(startIndex) {
    const result = [];
    for (let i = startIndex; i < startIndex + 8; i += 1) {
      const [r, g, b] = palette.colors[i];
      const id = `${r}${g}${b}`;
      result.push(
        <ListItem key={id}>
          <ListItemIcon>
            <Checkbox checked={enabledMap[i]} onChange={onChanged(i)} name={`${id}cb`} />
          </ListItemIcon>
          <Box boxShadow={1} borderRadius="borderRadius">
            <Brightness1Icon fontSize="small" style={{ color: `rgb(${r}, ${g}, ${b})` }} />
          </Box>
        </ListItem>
      );
    }
    return result;
  }

  return (
    <>
      <Grid container>
        <Grid item xs align="left">
          <ResetButton onClick={reset} disabled={defaultsSet}/>
          <Container align="left">
            <ProfileSelection
              label="palette"
              value={paletteId}
              items={paletteOptions}
              onChange={setPaletteId}
              tooltip="Use this palette for quantizing"
            />
          </Container>
        </Grid>
        <Grid item xs>
          <List dense>{subPalette(0)}</List>
        </Grid>
        <Grid item xs>
          <List dense>{subPalette(8)}</List>
        </Grid>
      </Grid>
    </>
  );
}

PaletteControl.propTypes = {
  onChange: PropTypes.func.isRequired
};

export default PaletteControl;
