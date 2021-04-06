import React from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useStyles } from './style';

import { generateRange } from 'functions/arrays';
import { validationSchema } from './validation';
import TextField from '@material-ui/core/TextField';
import { Grid, Button, Typography } from '@material-ui/core';

import { utilities } from 'tods-competition-factory';

export function LocationAdd(props) {
  const classes = useStyles();
  const { t } = useTranslation();

  const { addLocation, cancel } = props;

  const { register, handleSubmit, formState, errors } = useForm({ validationSchema, mode: 'onBlur' });

  const onSubmit = (data) => {
    const courts = generateRange(0, data.courts).map((index) => {
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
            <TextField
              name="venueName"
              required
              inputRef={register}
              error={Boolean(errors.venueName)}
              helperText={errors.venueName && errors.venueName.message}
              label={t('teams.name')}
            />
            <TextField
              name="abbreviation"
              inputRef={register}
              error={Boolean(errors.abbreviation)}
              helperText={errors.abbreviation && errors.abbreviation.message}
              label={t('teams.abbreviation')}
            />
            <TextField
              name="courts"
              inputRef={register}
              error={Boolean(errors.courts)}
              helperText={errors.courts && errors.courts.message}
              label={t('Courts')}
            />
            <Grid container justify="center" alignItems="center">
              {formState.dirty ? <Submit /> : <Close />}
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
}
