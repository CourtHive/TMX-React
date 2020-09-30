import React from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import MenuItem from '@material-ui/core/MenuItem';

import { useStyles } from 'components/selectors/style';
import TMXSelect from 'components/selectors/tmxSelector/TMXSelect';

export const SignedInSelector = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const selectedStatus = useSelector((state: any) => state.tmx.select.participants.signedIn);
  const selectStatus = (event) => dispatch({ type: 'participant signedIn', payload: event.target.value });
  const options = [
    { text: t('signin.signedin'), value: 'true' },
    { text: t('signin.notsignedin'), value: 'false' }
  ];

  const Selector = () => (
    <TMXSelect className={classes.select} value={selectedStatus} onChange={selectStatus}>
      <MenuItem value="-">
        {' '}
        <em>{t('reg')}</em>{' '}
      </MenuItem>
      {options.map((t) => (
        <MenuItem key={t.text} value={t.value}>
          {t.text}
        </MenuItem>
      ))}
    </TMXSelect>
  );
  return <Selector />;
};
