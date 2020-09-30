import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';

import { DatePicker } from '@material-ui/pickers';

import { Grid, TextField, Typography } from '@material-ui/core/';
import { MultiComboBox } from 'components/forms/multComboBox';

import { useStyles } from 'components/panels/infoPanel/style';

import { utilities } from 'tods-competition-factory';
const {
  dateTime: { formatDate }
} = utilities;

const categoryDefinitions = [
  { categoryName: 'ALL', type: 'BOTH' },
  { categoryName: 'WTN', type: 'RATING' },
  { categoryName: 'UTR', type: 'RATING' },
  { categoryName: 'U10', type: 'AGE' },
  { categoryName: 'U12', type: 'AGE' },
  { categoryName: 'U14', type: 'AGE' },
  { categoryName: 'U16', type: 'AGE' },
  { categoryName: 'U18', type: 'AGE' },
  { categoryName: 'Adult', type: 'AGE' }
];

export function TournamentOverview(props) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const classes = useStyles();

  const { tournamentRecord } = props;
  const editState = useSelector((state) => state.tmx.editState);

  const startDate = tournamentRecord.startDate;
  const endDate = tournamentRecord.endDate;

  // find categories present in existing events
  const events = tournamentRecord.events || [];
  const categoryReducer = (list, event) => {
    const categoryNames = list.map((member) => member.categoryName);
    return event?.category?.categoryName && categoryNames.includes(event.category.categoryName)
      ? list
      : list.concat(event.category);
  };
  const existingEventCategoryNames = events
    .reduce(categoryReducer, [])
    .map((category) => category?.categoryName)
    .filter((f) => f);

  const tournamentCategories = tournamentRecord.tournamentCategories || [];
  const tournamentCategoryNames = tournamentCategories
    .filter((category) => typeof category?.categoryName === 'string')
    .map((category) => category.categoryName);
  const selectionTitles = tournamentCategoryNames.map((title) => ({ title }));

  const selectionChange = (_, selections) => {
    const selectedCategoryNames = selections.map((selection) =>
      typeof selection === 'string' ? selection : selection.title
    );
    const missingCategoryNames = selectedCategoryNames.reduce(
      (missing, categoryName) =>
        tournamentCategoryNames.includes(categoryName) ? missing : missing.concat(categoryName),
      []
    );

    const newTournamentCategoryNames = selectedCategoryNames.concat(...missingCategoryNames);
    const categories = categoryDefinitions
      .filter((category) => newTournamentCategoryNames.includes(category.categoryName))
      .filter((category) => typeof category.categoryName === 'string');

    dispatch({
      type: 'tournamentEngine',
      payload: { methods: [{ method: 'setTournamentCategories', params: { categories } }] }
    });
  };

  const categoryOptions = categoryDefinitions.map((category) => ({ title: category.categoryName }));
  const [tournamentName, setTournamentName] = useState(tournamentRecord.name);
  const handleTournamentNameKeyDown = (event) => {
    if (event.key === 'Enter') {
      checkTournamentName();
    }
  };
  const handleTournamentNameChange = (event) => setTournamentName(event.target.value);
  const checkTournamentName = () => {
    if (tournamentName !== tournamentRecord.name) {
      dispatch({
        type: 'tournamentEngine',
        payload: { methods: [{ method: 'setTournamentName', params: { name: tournamentName } }] }
      });
    }
  };

  const handleTournamentStartDateChange = (value) => {
    const newStartDate = formatDate(value);
    if (newStartDate !== tournamentRecord.startDate) {
      if (new Date(newStartDate) < new Date(tournamentRecord.startDate)) {
        // TODO: logic to see whether it is valid to change based
        // on existing matches... if scheduled matches will be unscheduled,
        // prompt to confirm...  logic to check should be in engines
      }
      dispatch({
        type: 'tournamentEngine',
        payload: { methods: [{ method: 'setTournamentStartDate', params: { startDate: newStartDate } }] }
      });
    }
  };

  const handleTournamentEndDateChange = (value) => {
    const newEndDate = formatDate(value);
    if (newEndDate !== tournamentRecord.endDate) {
      if (new Date(newEndDate) < new Date(tournamentRecord.endDate)) {
        // TODO: logic to see whether it is valid to change based
        // on existing matches... if scheduled matches will be unscheduled,
        // prompt to confirm...  logic to check should be in engines
      }
      dispatch({
        type: 'tournamentEngine',
        payload: { methods: [{ method: 'setTournamentEndDate', params: { endDate: newEndDate } }] }
      });
    }
  };

  return (
    <>
      <Grid container spacing={3} direction="row" justify="flex-start">
        <Grid item style={{ flexGrow: 1, maxWidth: 500 }}>
          <Typography variant="h1" className={classes.sectionTitle}>
            {t('nm')}
          </Typography>
          <TextField
            autoFocus
            required={true}
            disabled={!editState}
            defaultValue={tournamentRecord.name}
            onChange={handleTournamentNameChange}
            onKeyDown={handleTournamentNameKeyDown}
            onBlur={checkTournamentName}
            fullWidth={true}
          />
          <div className={classes.divider} />
          <Typography variant="h1" className={classes.sectionTitle}>
            {t('Categories')}
          </Typography>
          <MultiComboBox
            freeSolo={false}
            promptActive={true}
            noOptionsText={t('none')}
            options={categoryOptions}
            onChange={selectionChange}
            prompt={`${t('select')}...`}
            disabled={existingEventCategoryNames}
            selections={selectionTitles}
          />
          <div className={classes.divider} />
          <Typography variant="h1" className={classes.sectionTitle}>
            {t('Dates')}
          </Typography>
          <Grid container direction="row" justify="space-between">
            <Grid item style={{ minWidth: 230 }}>
              <div className={classes.divider} />
              <DatePicker
                autoOk
                variant="inline"
                format="yyyy-MM-dd"
                label="Start Date"
                value={startDate}
                disabled={!editState}
                onChange={handleTournamentStartDateChange}
              />
            </Grid>
            <Grid item style={{ minWidth: 230 }}>
              <div className={classes.divider} />
              <DatePicker
                autoOk
                variant="inline"
                format="yyyy-MM-dd"
                label="End Date"
                value={endDate}
                disabled={!editState}
                onChange={handleTournamentEndDateChange}
              />
            </Grid>
          </Grid>
        </Grid>
        <Grid item style={{ maxWidth: 400 }}></Grid>
      </Grid>
    </>
  );
}
