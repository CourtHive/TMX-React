import React from 'react';
import { useTranslation } from 'react-i18next';

import { Button, MenuItem, Drawer, Grid, TextField, Typography } from '@material-ui/core';
import { validationSchema } from './validation';
import { Controller, useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { useStyles } from './style';

import { ControlledSelector } from 'components/selectors/ControlledSelector';
import { matchUpFormats } from 'functions/scoring/matchUpFormats';

import { env } from 'config/defaults';
import { nearestPow2 } from 'functions/draws';

import { getStatusGroup } from 'functions/events';
import { validRoundRobinGroupSize } from 'functions/draws';

import { utilities } from 'tods-competition-factory';
import { yupResolver } from '@hookform/resolvers/yup';

export function EditDrawDrawer(props) {
  const { callback, selectedEvent } = props;

  const drawer = useSelector((state) => state.tmx.visible.drawer);
  const open = drawer === 'draw';

  const onClose = () => {
    callback();
  };
  const submitValues = (value) => {
    callback(value);
  };

  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <NewDraw submitValues={submitValues} selectedEvent={selectedEvent} />
    </Drawer>
  );
}

export function NewDraw(props) {
  const { submitValues, selectedEvent } = props;

  const classes = useStyles();
  const { t } = useTranslation();
  const approved = getStatusGroup({ selectedEvent }) || [];
  const approvedDrawSize = Math.max(2, nearestPow2(approved.length));
  const groupsDefault = (approved.length && Math.ceil(approved.length / 4)) || 1;

  const defaultValues = {
    seedsCount: 0,
    customName: '',
    drawSize: approvedDrawSize,
    drawType: 'SINGLE_ELIMINATION',
    automated: 'automated',
    scoring: 'standard',
    groups: groupsDefault,
    groupSize: 4
  };
  const { control, /*register,*/ getValues, setValue, watch, handleSubmit } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues,
    mode: 'onChange'
  });

  const automationOptions = [
    { text: t('manual'), value: 'manual' },
    { text: t('adr'), value: 'automated' }
  ];

  // const selectedStructure = watch('drawType', 'SINGLE_ELIMINATION');
  const { drawType: selectedStructure } = watch() || 'SINGLE_ELIMINATION';
  const defaultDrawSize = selectedStructure === 'DOUBLE_ELIMINATION' ? '12' : defaultValues.drawSize;

  const structureOptions = getStructureOptions();
  if (structureOptions.map((o) => o.value).indexOf(selectedStructure) < 0) {
    const firstOption = structureOptions[0].value;
    setValue('drawType', firstOption);
  }

  // const groupSize = watch('groupSize', 4);
  const { groupSize } = watch() || 4;
  const minimumGroups = Math.ceil(approved.length / groupSize);
  const maximumGroups = Math.floor(approved.length / (groupSize - 1));
  const groupsRange = utilities.generateRange(minimumGroups, maximumGroups + 1);
  const groupsOptions = groupsRange.map((o) => ({ text: o, value: o }));

  const seedsCount = getValues().seedsCount;
  const groups = getValues().groups;
  if (groupsOptions && groupsOptions.length && groupsOptions.map((o) => o.value).indexOf(groups) < 0) {
    const firstOption = groupsOptions[0].value;
    setValue('groups', firstOption);
    if (['ROUND ROBIN', 'ROUND ROBIN PLAYOFF'].includes(selectedStructure) && seedsCount < firstOption) {
      setValue('seedsCount', firstOption);
    }
  }

  // const drawSize = watch('drawSize', 32);
  const { drawSize } = watch() || 32;
  const seedRange = getSeedRange({ drawSize, selectedStructure });
  if (seedRange.indexOf(seedsCount) < 0) {
    setValue('seedsCount', seedRange[0]);
  }

  const seedOptions = seedRange.map((o) => ({ text: o, value: o }));
  const drawSizeVales =
    selectedStructure === 'DOUBLE_ELIMINATION' ? [6, 12, 24, 48] : [2, 4, 8, 16, 32, 64, 128, 256, 512, 1024];
  const drawSizeOptions = drawSizeVales.map((o) => ({ text: o, value: o }));

  const bracketSizes = env.draws.rr_draw.brackets;
  const lowerRange = bracketSizes.min_bracket_size;
  const upperRange = Math.min(bracketSizes.max_bracket_size, approved.length);
  const groupSizeRange = utilities
    .generateRange(lowerRange, upperRange + 1)
    .filter((v) => validRoundRobinGroupSize(approved.length, v));
  const groupSizeOptions = groupSizeRange.map((o) => ({ text: o, value: o }));

  function renderMatchFormat(f) {
    return (
      <MenuItem key={f.key} value={f.key}>
        <ul className={classes.matchFormatList}>
          <li className={classes.matchUpFormat}>{f.name}</li>
          {f.desc ? (
            <li key={`${f.key}_1`} style={{ fontSize: 10 }}>
              {f.desc}
            </li>
          ) : (
            ''
          )}
          {f.desc2 ? (
            <li key={`${f.key}_2`} style={{ fontSize: 10 }}>
              {f.desc2}
            </li>
          ) : (
            ''
          )}
        </ul>
      </MenuItem>
    );
  }

  const scoringItems = matchUpFormats().formats.map(renderMatchFormat);

  const SubmitButton = () => {
    const onSubmit = () => {
      const values = getValues();
      values.automated = values.automated === 'automated';
      values.matchUpFormat = matchUpFormats().lookup(values.scoring);
      values.drawSize = parseInt(values.drawSize);
      submitValues(values);
    };
    return (
      <Button variant="outlined" className={classes.submit} onClick={handleSubmit(onSubmit)}>
        {' '}
        {t('sbt')}{' '}
      </Button>
    );
  };

  const disableSizeOption = selectedStructure === 'ADHOC';

  return (
    <div className={classes.editPanel}>
      <Grid container direction="column">
        <Typography align="left" component="h2" className={classes.formTitle}>
          {t('actions.add_draw') || 'Add Draw'}
        </Typography>
        <Controller
          name="customName"
          control={control}
          defaultValue=""
          render={({ field: { onChange, value } }) => (
            <TextField
              required
              className={classes.editField}
              id="customDrawName"
              label={t('events.customname')}
              value={value}
              onChange={onChange}
            />
          )}
        />
        <ControlledSelector
          defaultValue={defaultValues.drawType}
          name="drawType"
          control={control}
          options={structureOptions}
          label={t('draws.structure')}
        />
        {disableSizeOption ? (
          ''
        ) : (
          <Grid container direction="row" justify="space-between" alignItems="center" className={classes.grow}>
            {selectedStructure === 'FEED IN' ? (
              <Controller
                name="drawSize"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <TextField
                    className={classes.editField}
                    id="drawSize"
                    label={t('events.draw_size')}
                    value={value}
                    onChange={onChange}
                  />
                )}
              />
            ) : (
              <ControlledSelector
                defaultValue={defaultDrawSize}
                name="drawSize"
                control={control}
                options={drawSizeOptions}
                override={'formControlNumber'}
                label={t('events.draw_size')}
              />
            )}
            <ControlledSelector
              defaultValue={defaultValues.seedsCount}
              name="seedsCount"
              control={control}
              options={seedOptions}
              override={'formControlNumber'}
              label={t('draws.seedrange')}
            />
          </Grid>
        )}
        {!['ROUND ROBIN', 'ROUND ROBIN PLAYOFF'].includes(selectedStructure) ? (
          ''
        ) : (
          <Grid container direction="row" className={classes.grow}>
            <ControlledSelector
              defaultValue={defaultValues.groupSize}
              name="groupSize"
              control={control}
              options={groupSizeOptions}
              override={'formControlNumber'}
              label={'Group Size'}
            />
            <ControlledSelector
              defaultValue={defaultValues.groups}
              name="groups"
              control={control}
              options={groupsOptions}
              override={'formControlNumber'}
              label={'Groups'}
            />
          </Grid>
        )}
        <ControlledSelector
          defaultValue={defaultValues.scoring}
          name="scoring"
          control={control}
          items={scoringItems}
          label={t('scoring.label')}
        />
        {selectedStructure === 'ADHOC' ? (
          ''
        ) : (
          <ControlledSelector
            defaultValue={defaultValues.automated}
            name="automated"
            control={control}
            options={automationOptions}
            label={t('Draw Creation')}
          />
        )}
        <Grid id="submitNewDraw" container direction="row" className={classes.grow}>
          <div className={classes.grow} />
          <SubmitButton id="FooButton" className={classes.submit} />
          <div className={classes.grow} />
        </Grid>
      </Grid>
    </div>
  );

  function getStructureOptions() {
    const structureOptions = [
      { text: t('Single Elimination'), value: 'SINGLE_ELIMINATION' },
      { text: t('Double Elimination'), value: 'DOUBLE_ELIMINATION' },
      { text: t('draws.feedin'), value: 'FEED_IN' },
      { text: t('draws.compass'), value: 'COMPASS' },
      { text: t('Olympic'), value: 'OLYMPIC' },
      { text: t('Playoff'), value: 'PLAYOFF' },
      { text: t('Feed In Championship'), value: 'FEED_IN_CHAMPIONSHIP' },
      { text: t('FIC-SF'), value: 'FEED_IN_CHAMPIONSHIP_TO_SF' },
      { text: t('FIC-QF'), value: 'FEED_IN_CHAMPIONSHIP_TO_QF' },
      { text: t('FIC-R16'), value: 'FEED_IN_CHAMPIONSHIP_TO_R16' },
      { text: t('MODIFIED_FEED_IN_CHAMPIONSHIP'), value: 'MODIFIED_FEED_IN_CHAMPIONSHIP' },
      { text: t('Curtis Consolation'), value: 'CURTIS_CONSOLATION' },
      { text: t('FIRST_MATCH_LOSER_CONSOLATION'), value: 'FIRST_MATCH_LOSER_CONSOLATION' },
      { text: t('Round Robin'), value: 'ROUND_ROBIN' },
      { text: t('RRWP'), value: 'ROUND_ROBIN_WITH_PLAYOFF' },
      { text: t('Adhoc'), value: 'ADHOC' }
    ];
    return structureOptions;
  }
}

function getSeedRange({ drawSize, selectedStructure }) {
  if (selectedStructure === 'FEED IN') {
    const validSeeds = utilities.generateRange(1, Math.ceil(drawSize / 2) + 1);
    return validSeeds;
  }
  const validSeeds = [0, 2, 4, 8, 16, 32, 64];
  return validSeeds.filter((seeds) => seeds <= Math.ceil(drawSize / 2));
}
