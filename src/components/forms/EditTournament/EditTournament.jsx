import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm, Controller } from 'react-hook-form';
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

import { utilities } from 'tods-competition-factory';
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
    indoorOutdoor: 'o',
    surfaceCategory: 'H',
    startDate: new Date(),
    endDate: new Date()
  };
  const { control, register, handleSubmit, watch, setValue, errors } = useForm({
    validationSchema,
    defaultValues,
    mode: 'onChange'
  });
  const currentStart = watch('startDate');
  const currentEnd = watch('endDate');
  if (currentEnd < currentStart) setValue('endDate', currentStart);
  useEffect(() => {
    register({ name: 'indoorOutdoor' });
    register({ name: 'surfaceCategory' });
  }, [register]);

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
    { text: t('indoors'), value: 'i' },
    { text: t('outdoors'), value: 'o' }
  ];
  const surfaceOptions = [
    { text: t('surfaces.clay'), value: 'C' },
    { text: t('surfaces.hard'), value: 'H' },
    { text: t('surfaces.grass'), value: 'G' },
    { text: t('surfaces.carpet'), value: 'R' }
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
        <TextField
          name="tournamentName"
          required
          inputRef={register}
          helperText={errors.tournamentName && 'Required'}
          label={t('nm')}
          className={classes.editField}
          id="customTournamentName"
        />
        <Controller
          autoOk
          name="startDate"
          control={control}
          variant="inline"
          format="yyyy-MM-dd"
          label={t('start')}
          className={classes.editField}
          id="tournamentStartDate"
          as={<DatePicker />}
        />
        <Controller
          autoOk
          name="endDate"
          control={control}
          variant="inline"
          format="yyyy-MM-dd"
          label={t('end')}
          className={classes.editField}
          id="tournamentEndDate"
          minDate={currentStart}
          as={<DatePicker />}
        />
        <ControlledSelector
          defaultValue={defaultValues.indoorOutdoor}
          name="indoorOutdoor"
          control={control}
          options={inOutOptions}
          label={t('indoorOutdoor')}
          id="tournamentInOut"
        />
        <ControlledSelector
          defaultValue={defaultValues.surfaceCategory}
          name="surfaceCategory"
          control={control}
          options={surfaceOptions}
          label={t('events.surfaceCategory')}
          id="tournamentSurface"
        />
        <Grid container direction="row">
          <div className={classes.grow} />
          <SubmitButton id="submitNewTournament" className={classes.submit} />
        </Grid>
      </Grid>
    </div>
  );
}
