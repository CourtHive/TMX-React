import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useStyles } from './styles';

import { AppToaster } from 'services/notifications/toaster';

import { CountrySelect } from 'components/selectors/CountrySelect';
import { ParticipantTeam } from 'components/selectors/ParticipantTeam';

import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import { DatePicker } from '@material-ui/pickers';

import { Button, Grid, TextField } from '@material-ui/core';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';

import { utilities, participantTypes, participantRoles, fixtures } from 'tods-competition-factory';
const { offsetDate, formatDate, timeUTC } = utilities.dateTime;

const { INDIVIDUAL } = participantTypes;
const { COMPETITOR } = participantRoles;
const { countries } = fixtures;

function GenderSelect(props) {
  const { sex, onChange } = props;
  const genderValue = (sex || '')[0];
  const { t } = useTranslation();

  const handleChange = (event) => {
    onChange(event.target.value);
  };

  return (
    <FormControl component="fieldset">
      <FormLabel component="legend">Gender</FormLabel>
      <RadioGroup aria-label="sex" name="sex" value={genderValue || 'X'} onChange={handleChange}>
        <FormControlLabel value="F" control={<Radio />} label={t('genders.female')} />
        <FormControlLabel value="M" control={<Radio />} label={t('genders.male')} />
        <FormControlLabel value="X" control={<Radio />} label={t('genders.other')} />
      </RadioGroup>
    </FormControl>
  );
}

export function PersonForm(props) {
  const { teamParticipants } = props;
  const { callback, participantId /*minimumBirthYear, maximumBirthYear, title*/ } = props;
  const [person, setPerson] = useState(props.person || {});
  const { t } = useTranslation();
  const classes = useStyles();

  const playerTeam = teamParticipants?.find((team) => {
    return team.participantIds?.includes(participantId);
  });
  const [selectedTeam, setSelectedTeam] = useState(playerTeam);
  const handleTeamChange = (selection) => {
    setSelectedTeam(selection);
  };

  const submitFx = () => {
    const fx = callback && typeof callback === 'function';
    const validName = person.standardGivenName && person.standardFamilyName;
    if (!validName) {
      return AppToaster.show({ icon: 'error', intent: 'error', message: t('Name Required') });
    }
    if (fx) {
      const participantData = {
        participantId: person.participantId,
        participantType: INDIVIDUAL,
        participantRole: COMPETITOR,
        participantName: `${person.standardGivenName} ${person.standardFamilyName}`,
        person
      };
      const teamId = selectedTeam?.participantId;
      callback({ participantData, teamId });
    }
  };
  const cancelFx = () => {
    if (callback && typeof callback === 'function') callback({});
  };

  const changeHandler = (key) => {
    return (e) => {
      const value = e && e.target && e.target.value;
      setPerson({ ...person, [key]: value });
    };
  };
  const handleGenderChange = (sex) => {
    setPerson({ ...person, sex });
  };
  const handleDateChange = (date) => {
    if (date) {
      const birthDate = formatDate(timeUTC(date));
      setPerson({ ...person, birthDate });
    }
  };

  const handleSubmit = (evt) => evt.preventDefault();

  /*
   const minDate = (minimumBirthYear && offsetDate(`${minimumBirthYear}-01-01`)) || offsetDate('1930-01-01');
   const maxDate = maximumBirthYear && offsetDate(`${maximumBirthYear}-01-01`);
   const range = { after: minDate, before: maxDate, }
   */

  const iocSelected = (_, selection) => {
    if (selection && selection.ioc) setPerson({ ...person, nationalityCode: selection.ioc });
  };

  const defaultDate = (value) => {
    return value ? offsetDate(value) : null;
  };
  const selectedCountry = countries.reduce((selectedCountry, country) => {
    return country.ioc === person.nationalityCode ? country : selectedCountry;
  }, countries[0]);

  return (
    <form className={classes.root} noValidate autoComplete="off" onSubmit={handleSubmit}>
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <Grid container spacing={3} direction="row">
          <Grid item xs={6} className={classes.minimums}>
            <TextField
              autoFocus
              required={true}
              label={t('fnm')}
              defaultValue={person.standardGivenName || ''}
              onChange={changeHandler('standardGivenName')}
              fullWidth={true}
            />
          </Grid>
          <Grid item xs={6} className={classes.minimums}>
            <TextField
              required={true}
              label={t('lnm')}
              defaultValue={person.standardFamilyName || ''}
              onChange={changeHandler('standardFamilyName')}
              fullWidth={true}
            />
          </Grid>
        </Grid>
        <Grid container spacing={3} direction="row" className={classes.row}>
          <Grid item xs={6} className={classes.minimums}>
            <GenderSelect sex={person.sex} onChange={handleGenderChange} />
          </Grid>
          <Grid item xs={6} className={classes.minimums}>
            <Grid container direction="column">
              <Grid item className={classes.minimums}>
                <TextField
                  label={t('nnm')}
                  defaultValue={person.otherName || ''}
                  onChange={changeHandler('otherName')}
                  fullWidth={true}
                />
              </Grid>
              <Grid item style={{ width: '100%', marginTop: '1em' }}>
                <DatePicker
                  autoOk
                  className={classes.datePicker}
                  variant="inline"
                  format="yyyy-MM-dd"
                  label="Birthday"
                  value={defaultDate(person.birthDate)}
                  onChange={handleDateChange}
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <Grid container spacing={3} direction="row" className={classes.row}>
          <Grid item xs={6} className={classes.minimums}>
            <CountrySelect
              label={t('cnt')}
              onChange={iocSelected}
              options={countries}
              noOptionsText={t('noresults')}
              selection={selectedCountry}
            />
          </Grid>
          <Grid item xs={6} className={classes.minimums}>
            <ParticipantTeam
              id={'participantTeamSelector'}
              label={t('Team')}
              onChange={handleTeamChange}
              options={teamParticipants}
              noOptionsText={t('noresults')}
              selection={selectedTeam}
            />
          </Grid>
        </Grid>
        <Grid container spacing={3} direction="row" className={classes.row}>
          <Grid item xs={6} className={classes.minimums}>
            <TextField
              label={t('cty')}
              defaultValue={person.city || ''}
              onChange={changeHandler('city')}
              fullWidth={true}
            />
          </Grid>
          <Grid item xs={6} className={classes.minimums}>
            <TextField
              label={t('state')}
              defaultValue={person.state || ''}
              onChange={changeHandler('state')}
              fullWidth={true}
            />
          </Grid>
        </Grid>
        <Grid container spacing={3} direction="row" className={classes.row}>
          <Grid item xs={6} className={classes.minimums}>
            <TextField
              label={t('phn')}
              defaultValue={person.telephone || ''}
              onChange={changeHandler('telephone')}
              fullWidth={true}
            />
          </Grid>
          <Grid item xs={6} className={classes.minimums}>
            <TextField
              label={t('emailAddress')}
              defaultValue={person.emailAddress || ''}
              onChange={changeHandler('emailAddress')}
              fullWidth={true}
            />
          </Grid>
        </Grid>
        <Grid container spacing={3} direction="row" className={classes.row}>
          <Grid item xs={12}></Grid>
        </Grid>
        <Grid
          container
          spacing={3}
          direction="row"
          justify="flex-end"
          alignItems="flex-end"
          style={{ marginTop: '.5em' }}
        >
          <Grid container item xs={12} justify="flex-end" alignItems="flex-end">
            <Button onClick={() => cancelFx()} color="secondary" variant="outlined" className={classes.spaceLeft}>
              {' '}
              {t('ccl')}{' '}
            </Button>
            <Button onClick={() => submitFx()} color="primary" variant="outlined" className={classes.spaceLeft}>
              {' '}
              {t('sbt')}{' '}
            </Button>
          </Grid>
        </Grid>
      </MuiPickersUtilsProvider>
    </form>
  );
}

export default PersonForm;
