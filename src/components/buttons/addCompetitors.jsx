import React from 'react';
import { useTranslation } from 'react-i18next';

import { Button } from '@material-ui/core';
import GroupAddIcon from '@material-ui/icons/GroupAdd';

import { useStyles } from 'components/buttons/style';

export const AddCompetitorsButton = (props) => {
  const { t } = useTranslation();
  const classes = useStyles();
  const { onClick } = props;

  return (
    <Button startIcon={<GroupAddIcon />} className={classes.button} variant="outlined" onClick={onClick}>
      {t('Add Participants')}
    </Button>
  );
};
