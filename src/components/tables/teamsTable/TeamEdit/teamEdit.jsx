import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useImage } from 'react-image';
import { useStyles } from './style';

import { useForm } from 'react-hook-form';
import { validationSchema } from './validation';
import TextField from '@material-ui/core/TextField';
import { Grid, Button, Typography } from '@material-ui/core';
import { yupResolver } from '@hookform/resolvers/yup';

const LOGO = 'Logo';

export function TeamEdit(props) {
  const classes = useStyles();
  const { t } = useTranslation();

  const { teamParticipant, updateTeam, cancel } = props;

  const onlineProfiles = teamParticipant?.onlineProfiles || [];
  const teamLogoProfile = onlineProfiles.find((profile) => profile.type === LOGO);
  const teamLogoLink = teamLogoProfile?.identifier;

  const defaultValues = {
    participantName: teamParticipant?.participantName,
    code: teamParticipant?.participantProfile?.code,
    abbreviation: teamParticipant?.participantProfile?.abbreviation,
    logoLink: teamLogoLink
  };

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors, isDirty }
  } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues,
    mode: 'onBlur'
  });

  const [logoLink, setLogoLink] = useState(teamLogoLink);
  const onSubmit = (data) => {
    const updatedParticipant = Object.assign({}, teamParticipant);
    updatedParticipant.participantName = data.participantName;
    updatedParticipant.participantProfile = Object.assign({}, teamParticipant.participantProfile, {
      code: data.code,
      abbreviation: data.abbreviation
    });

    let modified = false;
    const logoProfile = { type: LOGO, identifier: data.logoLink };
    updatedParticipant.onlineProfiles = onlineProfiles.map((profile) => {
      if (profile.type !== LOGO) return profile;
      modified = true;
      return logoProfile;
    });
    if (!modified) updatedParticipant.onlineProfiles.push(logoProfile);

    updateTeam && updateTeam(updatedParticipant);
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

  const handleLogoKeyDown = (event) => {
    if (event.key === 'Enter') {
      handleLogoBlur();
    }
  };

  const handleLogoBlur = () => {
    const values = getValues();
    setLogoLink(values.logoLink);
  };

  function TeamLogo(props) {
    const { srcList, imageWidth } = props;
    const { src, error } = useImage({
      useSuspense: false,
      srcList
    });

    return error ? null : <img width={imageWidth} height="auto" src={src} alt="teamLogo" />;
  }

  if (!teamParticipant) return null;
  return (
    <div className={classes.root}>
      <Grid container direction="column">
        <Grid item>
          <Grid container justify="flex-start" direction="column">
            <Grid container direction="row" justify="space-between">
              <Typography variant="h5">{t('Team Details')}</Typography>
              <TeamLogo srcList={logoLink} imageWidth={50} />
            </Grid>
            <TextField
              name="participantName"
              required
              inputRef={register}
              error={Boolean(errors.participantName)}
              helperText={errors.participantName && errors.participantName.message}
              label={t('teams.name')}
              defaultValue={defaultValues.participantName}
            />
            <TextField
              name="abbreviation"
              inputRef={register}
              error={Boolean(errors.abbreviation)}
              helperText={errors.abbreviation && errors.abbreviation.message}
              label={t('teams.abbreviation')}
              defaultValue={defaultValues.otherName}
            />
            <TextField
              name="code"
              inputRef={register}
              error={Boolean(errors.code)}
              helperText={errors.code && errors.code.message}
              label={t('teams.code')}
              defaultValue={defaultValues.code}
            />
            <TextField
              name="logoLink"
              inputRef={register}
              error={Boolean(errors.logoLink)}
              helperText={errors.logoLink && errors.logoLink.message}
              label={t('Team Logo (URL)')}
              defaultValue={defaultValues.logoLink}
              onKeyDown={handleLogoKeyDown}
              onBlur={handleLogoBlur}
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
