import React from 'react';
import { useTranslation } from 'react-i18next';
//import { useImage } from 'react-image';
import { useStyles } from './style';

import { useForm } from 'react-hook-form';
import { validationSchema } from './validation';
//import TextField from '@material-ui/core/TextField';
import { Grid, Button, Typography } from '@material-ui/core';
import { yupResolver } from '@hookform/resolvers/yup';
import { ControlledTextField } from 'components/ControlledTextField';

const LOGO = 'Logo';

export function GroupEdit(props) {
  const classes = useStyles();
  const { t } = useTranslation();

  const { groupParticipant, updateGroup, cancel } = props;

  const onlineProfiles = groupParticipant?.onlineProfiles || [];
  const groupLogoProfile = onlineProfiles.find((profile) => profile.type === LOGO);
  const groupLogoLink = groupLogoProfile?.identifier;

  const defaultValues = {
    name: groupParticipant?.participantName,
    abbreviation: groupParticipant?.participantProfile?.abbreviation,
    logoLink: groupLogoLink
  };

  const {
    control,
    handleSubmit,
    formState
    //    getValues,
  } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues,
    mode: 'onBlur'
  });

  //  const [logoLink, setLogoLink] = useState(groupLogoLink);
  const onSubmit = (data) => {
    const updatedParticipant = Object.assign({}, groupParticipant);
    updatedParticipant.name = data.name;
    updatedParticipant.participantProfile = Object.assign({}, groupParticipant.participantProfile, {
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

    updateGroup && updateGroup(updatedParticipant);
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

  /*
  const handleLogoKeyDown = (event) => {
    if (event.key === 'Enter') {
      handleLogoBlur();
    }
  };

  const handleLogoBlur = () => {
    const values = getValues();
    setLogoLink(values.logoLink);
  };

  function GroupLogo(props) {
    const { srcList, imageWidth } = props;
    const { src, error } = useImage({
      useSuspense: false,
      srcList
    });

    return error ? null : <img width={imageWidth} height="auto" src={src} alt="GroupLogo" />;
  }
  */

  if (!groupParticipant) return null;
  return (
    <div className={classes.root}>
      <Grid container direction="column">
        <Grid item>
          <Grid container justify="flex-start" direction="column">
            <Grid container direction="row" justify="space-between">
              <Typography variant="h5">{t('Group Details')}</Typography>
            </Grid>
            <ControlledTextField control={control} name={'name'} label={t('teams.name')} />
            <ControlledTextField control={control} name={'abbreviation'} label={t('teams.name')} />
            <ControlledTextField control={control} name={'logoLink'} label={t('Team Logo (URL)')} />
            <Grid container justify="center" alignItems="center">
              {formState.isDirty ? <Submit /> : <Close />}
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
}
/*
              <GroupLogo srcList={logoLink} imageWidth={50} />
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
*/
