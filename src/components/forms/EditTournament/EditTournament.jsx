import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import { Drawer, Grid, Button, TextField } from '@material-ui/core';
import { DatePicker } from '@material-ui/pickers';
import { validationSchema } from './validation';
import { env } from 'config/defaults';
import { useStyles } from './style';

import { Tooltip, Toolbar, IconButton } from '@material-ui/core';
import LoadFile from '@material-ui/icons/Publish';

import { importTournamentRecord, saveNewTournament } from 'functions/tournament/tournament';
import { ControlledSelector } from 'components/selectors/ControlledSelector';

import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import { utilities, surfaceConstants, venueConstants } from 'tods-competition-factory';
const { formatDate } = utilities.dateTime;

export function EditTournamentDrawer() {
  const dispatch = useDispatch();
  const drawer = useSelector((state) => state.tmx.visible.drawer);
  const closeDrawer = () => {
    dispatch({ type: 'visible drawer', payload: undefined });
  };
  return (
    <Drawer anchor="right" open={drawer === 'tournament'} onClose={closeDrawer}>
      <EditTournament callback={closeDrawer} />
    </Drawer>
  );
}

export function EditTournament(props) {
  const { callback } = props;
  const classes = useStyles();
  const { t } = useTranslation();

  const defaultValues = {
    tournamentName: t('tournaments.new'),
    indoorOutdoor: venueConstants.OUTDOOR,
    surfaceCategory: surfaceConstants.CLAY,
    startDate: new Date(),
    endDate: new Date()
  };
  const { handleSubmit, control, watch, setValue } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues,
    mode: 'onChange'
  });
  const { startDate: currentStart, endDate: currentEnd } = watch();
  if (currentEnd < currentStart) setValue('endDate', currentStart);

  const SubmitButton = (props) => {
    const { className, id } = props;
    const onSubmit = (data) => {
      if (env.org && env.org.abbr && data.unifiedTournamentId) {
        data.unifiedTournamentId.organisation = {
          organisationId: env.org.ouid,
          organisationName: env.org.name,
          organisationAbbreviation: env.org.abbr
        };
      }
      data.startDate = formatDate(data.startDate);
      data.endDate = formatDate(data.endDate);
      saveNewTournament(data);
      callback();
    };
    return (
      <Button id={id} variant="outlined" className={className} onClick={handleSubmit(onSubmit)}>
        Submit
      </Button>
    );
  };
  const importTournament = () => {
    importTournamentRecord({ callback: () => console.log('fetched') });
    callback();
  };

  const inOutOptions = [
    { text: t('indoors'), value: venueConstants.INDOOR },
    { text: t('outdoors'), value: venueConstants.OUTDOOR }
  ];
  const surfaceOptions = [
    { text: t('surfaces.clay'), value: surfaceConstants.CLAY },
    { text: t('surfaces.hard'), value: surfaceConstants.HARD },
    { text: t('surfaces.grass'), value: surfaceConstants.GRASS },
    { text: t('surfaces.carpet'), value: surfaceConstants.CARPET },
    { text: t('surfaces.artificial'), value: surfaceConstants.ARTIFICIAL }
  ];

  return (
    <div className={classes.editPanel}>
      <Grid container direction="column">
        <Toolbar>
          <div className={classes.grow} />
          <Tooltip title={t('tournaments.import')}>
            <IconButton color="inherit" onClick={importTournament}>
              <LoadFile />
            </IconButton>
          </Tooltip>
        </Toolbar>
        <Controller
          name="tournamentName"
          control={control}
          defaultValue=""
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <TextField
              required
              className={classes.editField}
              id="customTournamentName"
              label={t('nm')}
              value={value}
              onChange={onChange}
              error={!!error}
              helperText={error ? 'Tournament Name is required' : null}
            />
          )}
        />
        <Controller
          name="startDate"
          control={control}
          defaultValue=""
          rules={{ required: 'Date is required' }}
          render={({ field: { onChange, value } }) => (
            <DatePicker
              autoOk
              variant="inline"
              format="yyyy-MM-dd"
              label={t('start')}
              className={classes.editField}
              id="tournamentStartDate"
              value={value}
              onChange={onChange}
            />
          )}
        />
        <Controller
          name="endDate"
          control={control}
          defaultValue=""
          rules={{ required: 'Date is required' }}
          render={({ field: { onChange, value } }) => (
            <DatePicker
              autoOk
              variant="inline"
              format="yyyy-MM-dd"
              label={t('end')}
              className={classes.editField}
              id="tournamentEndDate"
              value={value}
              onChange={onChange}
            />
          )}
        />

        <ControlledSelector
          defaultValue={defaultValues.surfaceCategory}
          name="surfaceCategory"
          control={control}
          options={surfaceOptions}
          label={t('events.surfaceCategory')}
          id="tournamentSurface"
        />

        <ControlledSelector
          defaultValue={defaultValues.indoorOutdoor}
          name="indoorOutdoor"
          control={control}
          options={inOutOptions}
          label={t('indoorOutdoor')}
          id="tournamentInOut"
        />

        <Grid container direction="row">
          <div className={classes.grow} />
          <SubmitButton id="submitNewTournament" className={classes.submit} />
        </Grid>
      </Grid>
    </div>
  );
}
