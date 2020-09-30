import React from 'react';
import { useTranslation } from "react-i18next";

import { Button } from '@material-ui/core';
import AddBoxIcon from '@material-ui/icons/AddBox';

import { useStyles } from 'components/buttons/style';

export const AddTournamentButton = (props) => {
  const { t } = useTranslation();
  const classes = useStyles();
  const { onClick } = props;

  return (
    <Button startIcon={<AddBoxIcon />} className={classes.button} variant='outlined' onClick={onClick}>
      {t('Add Tournament')}
    </Button>
  );
};
