import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';

import { useStyles } from 'components/selectors/style';
import TMXSelect from 'components/selectors/tmxSelector/TMXSelect';

export const CourtSelector = (props) => {
  const { onChange } = props;
  const classes = useStyles();
  const { t } = useTranslation();

  const [court, changeCourt] = useState('-');
  const autoDrawOptions = useSelector((state) => state.tmx.actionData.autoDraw);
  const courtOptions = (autoDrawOptions && autoDrawOptions.courtOptions) || [];

  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP
      }
    }
  };
  const handleChange = (event) => {
    const value = event.target.value;
    changeCourt(value);
    if (onChange && typeof onChange === 'function') onChange(value);
  };
  const Selector = () => (
    <FormControl variant="standard" className={classes.formControl}>
      <InputLabel> {t('crt')} </InputLabel>
      <TMXSelect onChange={handleChange} value={court} MenuProps={MenuProps}>
        <MenuItem value="-">
          {' '}
          <em>{t('schedule.allcourts')}</em>{' '}
        </MenuItem>
        {courtOptions.map((t) => (
          <MenuItem key={t.value} value={t.value}>
            {t.text}
          </MenuItem>
        ))}
      </TMXSelect>
    </FormControl>
  );
  return <Selector />;
};
