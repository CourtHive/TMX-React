import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';

import { LTAB_OVERVIEW, LTAB_COURTS, LTAB_MEDIA } from 'stores/tmx/types/tabs';

export function LocationOptions() {
  const dispatch = useDispatch();
  const locationView = useSelector((state) => state.tmx.visible.locationView) || 'overview';

  const handleOnChange = (_, newView) => {
    dispatch({ type: 'set location view', payload: newView });
  };
  
  return (
      <>
        <ToggleButtonGroup
          value={locationView}
          exclusive
          onChange={handleOnChange}
          aria-label="text alignment"
          style={{height: 36}}
        >
          <ToggleButton value={LTAB_OVERVIEW}>
            Overview
          </ToggleButton>
          <ToggleButton value={LTAB_COURTS}>
            Courts
          </ToggleButton>
          <ToggleButton value={LTAB_MEDIA}>
            Media
          </ToggleButton>
        </ToggleButtonGroup>
      </>
  );
}
