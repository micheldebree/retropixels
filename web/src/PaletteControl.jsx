import React, { useState, useEffect, useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';
import { Checkbox, Grid, List, ListItem, ListItemIcon, Container, Box } from '@mui/material';
import { Palettes } from 'retropixels-core';
import Brightness1Icon from '@mui/icons-material/Brightness1';
import MyRadioButtons from './MyRadioButtons';
import ResetButton from './ResetButton';

const paletteOptions = ['PALette', 'colodore', 'pepto'];
const paletteIdDefault = 'PALette';

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

function PaletteControl(props) {
  const { onChange } = props;

  const [paletteId, setPaletteId] = useState(paletteIdDefault);
  const [palette, setPalette] = useState(Palettes.all[paletteId]);
  const [enabledMap, setEnabledMap] = useState(enabledDefault);

  const enabledColors = useMemo(() => Object.keys(enabledMap).filter(k => enabledMap[k]), [enabledMap]);

  useEffect(() => {
    const newPalette = { ...Palettes.all[paletteId] };
    newPalette.enabled = enabledColors;
    setPalette(newPalette);
  }, [paletteId, enabledColors]);

  useEffect(() => {
    onChange(palette);
  }, [palette, onChange]);

  const defaultsSet = enabledColors.length === palette.colors.length && paletteId === paletteIdDefault;

  const reset = useCallback(() => {
    setEnabledMap(enabledDefault);
    setPaletteId(paletteIdDefault);
  }, []);

  function onChanged(index) {
    return () => {
      const newValue = !enabledMap[index];
      if (!newValue && enabledColors.length <= 1) {
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
    <Grid container>
      <Grid item xs={12} align="left">
        <ResetButton onClick={reset} disabled={defaultsSet} />
        <Container align="left">
          <MyRadioButtons
            label="palette"
            value={paletteId}
            items={paletteOptions}
            onChange={setPaletteId}
            tooltip="Use this palette for quantizing"
          />
        </Container>
      </Grid>
      <Grid item xs={6}>
        <List dense>{subPalette(0)}</List>
      </Grid>
      <Grid item xs={6}>
        <List dense>{subPalette(8)}</List>
      </Grid>
    </Grid>
  );
}

PaletteControl.propTypes = {
  onChange: PropTypes.func.isRequired
};

export default PaletteControl;
