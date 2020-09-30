import React from 'react';
import { useTranslation } from "react-i18next";

import { Button } from '@material-ui/core';
import SyncIcon from '@material-ui/icons/Sync';
import { useStyles } from 'components/buttons/style';

import { synchronizePlayers } from 'components/tables/playersTable/synchronizePlayers';

export const SyncPlayersButton = (props) => {
  const { t } = useTranslation();
  const classes = useStyles();

  return (
    <Button startIcon={<SyncIcon />} className={classes.button} variant='outlined' onClick={synchronizePlayers}>
      {t('Syncronize Players')}
    </Button>
  );
};
