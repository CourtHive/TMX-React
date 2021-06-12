import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import i18n from 'i18next';

import { Button, Dialog, DialogContent, TextField } from '@material-ui/core';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import { Typography, Link, Avatar, Container, FormControlLabel, Checkbox, Grid } from '@material-ui/core';

import { useStyles } from './style';
import { useForm } from 'react-hook-form';
import { validationSchema } from './validation';
import { login } from 'services/authentication/authApi';
import { AppToaster } from 'services/notifications/toaster';

import { context } from 'services/context';
import { populateCalendar } from 'functions/calendar';
// import { saveMyTournaments } from 'services/officiating/tournaments';
import { displayTournament } from 'functions/tournament/tournamentDisplay';

import { getJwtTokenStorageKey } from 'config/localStorage';
import { validateToken } from 'services/authentication/actions';
import { yupResolver } from '@hookform/resolvers/yup';

const JWT_TOKEN_STORAGE_NAME = getJwtTokenStorageKey();

export const Login = () => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const defaultValues = { emailAddress: '', paassword: '', remember: '' };
  const loginModal = useSelector((state) => state.tmx.loginModal);

  const { register, handleSubmit, watch, formState } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues,
    mode: 'onBlur'
  });
  const { errors } = formState || {};
  const cancelAction = () => {
    dispatch({ type: 'login modal', payload: false });
  };
  function success(response) {
    dispatch({ type: 'login modal', payload: false });

    const token = response && response.data && response.data.token;
    const decodedToken = validateToken(token);

    if (decodedToken) {
      localStorage.setItem(JWT_TOKEN_STORAGE_NAME, token);
      AppToaster.show({ icon: 'tick', intent: 'success', message: 'Login successful' });
      // saveMyTournaments();

      setTimeout(() => {
        if (context.tournamentId) {
          displayTournament({ tournamentId: context.tournamentId });
        } else {
          populateCalendar();
        }
      }, 500);
    } else {
      AppToaster.show({ icon: 'error', intent: 'warning', message: 'Not Authorized' });
    }
  }
  function failure(error) {
    AppToaster.show({ icon: 'error', intent: 'error', message: error });
  }
  const onSubmit = (data) => {
    try {
      login(data.emailAddress, data.password).then(success, failure);
    } catch (error) {
      AppToaster.show({ icon: 'error', intent: 'error', message: error });
    }
  };
  const { password } = watch();
  // const validToSubmit = Boolean(!formState.dirty || errors.emailAddress || errors.password || !password || password.length < 8);
  const validToSubmit = Boolean(
    !formState.dirty || errors.emailAddress || errors.password || !password || password.length < 1
  );

  return (
    <Dialog disableBackdropClick={false} open={loginModal} maxWidth={'md'} onClose={cancelAction}>
      <DialogContent>
        <Container component="main" maxWidth="xs">
          <div className={classes.paper}>
            <Avatar className={classes.avatar}>
              {' '}
              <LockOutlinedIcon />{' '}
            </Avatar>
            <Typography component="h1" variant="h5">
              {' '}
              {i18n.t('sgi')}{' '}
            </Typography>
            <TextField
              autoFocus
              fullWidth
              name="emailAddress"
              margin="normal"
              variant="outlined"
              inputRef={register}
              autoComplete={'emailAddress'}
              label={i18n.t('emailAddress')}
              defaultValue={defaultValues.emailAddress}
              helperText={errors.emailAddress && 'Must be valid emailAddress'}
              FormHelperTextProps={{ style: { color: 'red' } }}
              className={classes.editField}
            />
            <TextField
              fullWidth
              type="password"
              name="password"
              margin="normal"
              variant="outlined"
              inputRef={register}
              label={i18n.t('passwd')}
              autoComplete={'current-password'}
              defaultValue={defaultValues.password}
              helperText={errors.password && '8 Characters Minimum'}
              FormHelperTextProps={{ style: { color: 'red' } }}
              className={classes.editField}
            />
            <FormControlLabel
              control={<Checkbox name="remember" inputRef={register} color="primary" />}
              label={i18n.t('phrases.remember_me')}
            />
            <Button
              fullWidth
              type="submit"
              variant="contained"
              color="primary"
              onClick={handleSubmit(onSubmit)}
              disabled={validToSubmit}
              className={classes.submit}
            >
              {i18n.t('sgi')}
            </Button>
            <Grid container justify="flex-end" style={{ marginTop: 10, display: 'none' }}>
              <Grid item xs>
                <Link href="#" variant="body2">
                  {' '}
                  {i18n.t('Forgot Password')}{' '}
                </Link>
              </Grid>
              <Grid item>
                <Link href="#" variant="body2">
                  {' '}
                  {i18n.t('No Account')}{' '}
                </Link>
              </Grid>
            </Grid>
          </div>
        </Container>
      </DialogContent>
    </Dialog>
  );
};
