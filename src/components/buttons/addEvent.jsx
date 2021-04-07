import React from 'react';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { Button } from '@material-ui/core';
import AddBoxIcon from '@material-ui/icons/AddBox';

import { useStyles } from 'components/buttons/style';

export const AddEventButton = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const classes = useStyles();

  const addEvent = () => {
    dispatch({ type: 'visible drawer', payload: 'event' });
  };

  return (
    <Button startIcon={<AddBoxIcon />} className={classes.button} variant="outlined" onClick={addEvent}>
      {t('Add Event')}
    </Button>
  );
};
