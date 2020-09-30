import React from 'react';
import { useTranslation } from "react-i18next";
import { useSelector, useDispatch } from 'react-redux';

import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import { TTAB_OVERVIEW, TTAB_NOTES, TTAB_MEDIA, TTAB_ACTIONS } from 'stores/tmx/types/tabs';

export function InfoButtonGroup() {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const tournamentView = useSelector((state: any) => state.tmx.visible.tournamentView);
  const handleOnChange = (_, newView) => {
    dispatch({ type: 'set tournament view', payload: newView })
  }

  return (
    <ToggleButtonGroup
      value={tournamentView}
      exclusive
      onChange={handleOnChange}
      aria-label="text alignment"
      style={{height: 36}}
    >
      <ToggleButton value={TTAB_OVERVIEW}>
        {t('Overview')}
      </ToggleButton>
      <ToggleButton value={TTAB_NOTES}>
        {t('Notes')}
      </ToggleButton>
      <ToggleButton value={TTAB_MEDIA}>
        {t('Media')}
      </ToggleButton>
      <ToggleButton value={TTAB_ACTIONS}>
        {t('Actions')}
      </ToggleButton>
    </ToggleButtonGroup>
  )
}

