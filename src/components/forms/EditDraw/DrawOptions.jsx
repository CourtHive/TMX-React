import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import { DTAB_DRAW, DTAB_COMPETITORS, DTAB_SETTINGS } from 'stores/tmx/types/tabs';

export function DrawOptions(props) {
  const dispatch = useDispatch();
  const drawView = useSelector((state) => state.tmx.visible.drawView);

  const handleOnChange = (_, newView) => {
    dispatch({ type: 'set draw view', payload: newView });
  };

  /*
  // TODO: this should come from drawEngine
  const scoresPresent = matchUps.filter(f=>f).reduce((p, c) => c.matchUp && c.matchUp.score ? true : p, false);
  const remakeDrawVisible = editState && !scoresPresent && drawDefinition.approved && !tc.isAdHoc({e: drawDefinition});
  */

  return (
    <>
      <ToggleButtonGroup
        value={drawView}
        exclusive
        onChange={handleOnChange}
        aria-label="text alignment"
        style={{ height: 36 }}
      >
        <ToggleButton value={DTAB_DRAW} aria-label="draw">
          Draw
        </ToggleButton>
        <ToggleButton value={DTAB_COMPETITORS} aria-label="competitors">
          Competitors
        </ToggleButton>
        <ToggleButton value={DTAB_SETTINGS} aria-label="settings">
          Settings
        </ToggleButton>
      </ToggleButtonGroup>
    </>
  );
}
