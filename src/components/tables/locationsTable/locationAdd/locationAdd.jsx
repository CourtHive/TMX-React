import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useStyles } from './style.js';

import { validationSchema } from './validation';
import TextField from '@material-ui/core/TextField';
import { Grid, Button, Typography } from '@material-ui/core';

import { utilities } from 'tods-competition-factory';
import { yupResolver } from '@hookform/resolvers/yup';

export function LocationAdd(props) {
  const classes = useStyles();
  const { t } = useTranslation();

  const { addLocation, cancel } = props;

  const {
    control,
    handleSubmit,
    formState: { isDirty }
  } = useForm({
    resolver: yupResolver(validationSchema),
    mode: 'onBlur'
  });

  const onSubmit = (data) => {
    const courts = utilities.generateRange(0, data.courts).map((index) => {
      const courtName = `${data.abbreviation} ${index + 1}`;
      const courtId = utilities.UUID();
      return { courtName, courtId };
    });
    const newLocation = {
      venueName: data.venueName,
      venueAbbreviation: data.abbreviation,
      courts
    };

    addLocation && addLocation(newLocation);
  };

  const Submit = () => {
    return (
      <Button variant="outlined" color="primary" className={classes.submit} onClick={handleSubmit(onSubmit)}>
        {t('sbt')}
      </Button>
    );
  };

  const Close = () => {
    return (
      <Button variant="outlined" color="primary" className={classes.submit} onClick={cancel}>
        {t('Close')}
      </Button>
    );
  };

  return (
    <div className={classes.root}>
      <Grid container direction="column">
        <Grid item>
          <Grid container justify="flex-start" direction="column">
            <Grid container direction="row" justify="space-between">
              <Typography variant="h5">{t('Location Details')}</Typography>
            </Grid>
            <Controller
              name="venueName"
              control={control}
              defaultValue=""
              render={({ field: { onChange, value }, fieldState: { error } }) => (
                <TextField
                  required
                  className={classes.editField}
                  id="venueName"
                  label={t('teams.name')}
                  value={value}
                  onChange={onChange}
                  error={!!error}
                  helperText={error?.message}
                />
              )}
            />
            <Controller
              name="abbreviation"
              control={control}
              defaultValue=""
              render={({ field: { onChange, value }, fieldState: { error } }) => (
                <TextField
                  required
                  className={classes.editField}
                  id="abbreviation"
                  label={t('teams.abbreviation')}
                  value={value}
                  onChange={onChange}
                  error={!!error}
                  helperText={error?.message}
                />
              )}
            />
            <Controller
              name="courts"
              control={control}
              defaultValue=""
              render={({ field: { onChange, value }, fieldState: { error } }) => (
                <TextField
                  required
                  className={classes.editField}
                  id="courts"
                  label={t('Courts')}
                  value={value}
                  onChange={onChange}
                  error={!!error}
                  helperText={error && 'Must be number greater than 0'}
                />
              )}
            />
            <Grid container justify="center" alignItems="center">
              {isDirty ? <Submit /> : <Close />}
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
}
