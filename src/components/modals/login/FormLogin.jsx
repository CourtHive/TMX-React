import React, { useState } from 'react';
import { useDispatch } from 'react-redux';

import { Button, MenuItem, TextField } from '@material-ui/core';
import { VpnKey, LockOutlined } from '@material-ui/icons';
import { Typography, Link, Avatar, Container, FormControlLabel, Checkbox, Grid } from '@material-ui/core';

import { useStyles } from './style';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { login } from 'services/authentication/authApi';

import { getJwtTokenStorageKey } from 'config/localStorage';
import * as Yup from 'yup';

import { validateToken } from 'services/authentication/validateToken';
import { AppToaster } from 'services/notifications/toaster';
// import { checkEnvSettings } from 'services/settings/checkEnvSettings';
import TMXSelect from 'components/selectors/tmxSelector/TMXSelect';

const JWT_TOKEN_STORAGE_NAME = getJwtTokenStorageKey();

const validationSchema = Yup.object().shape({
  email: Yup.string().email().required(''),
  password: Yup.string().min(8).required('')
});

const noProviderSelection = '-';

export const FormLogin = ({ enableKeys, rememberMe, providers, formChange }) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const defaultValues = {
    email: '',
    password: '',
    remember: '',
    provider: '-'
  };
  const [schemaIsValid, setSchemaIsValid] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState('-');

  const {
    control,
    handleSubmit,
    watch,
    trigger,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues,
    reValidateMode: 'onChange'
  });

  function selectProvider(event) {
    let value = event.target.value;
    setSelectedProvider(value);
  }

  function success(response) {
    dispatch({ type: 'login modal', payload: false });

    const token = response && response.data && response.data.token;
    const decodedToken = validateToken(token);

    if (decodedToken) {
      localStorage.setItem(JWT_TOKEN_STORAGE_NAME, token);
      dispatch({ type: 'auth state', payload: true });
      AppToaster.show({
        icon: 'success',
        intent: 'success',
        message: 'Login Successful'
      });
    } else {
      AppToaster.show({
        icon: 'error',
        intent: 'warning',
        message: 'Not Authorized'
      });
    }
    // checkEnvSettings();
  }

  function failure(message) {
    dispatch({ type: 'login modal', payload: false });
    AppToaster.show({
      icon: 'error',
      intent: 'warning',
      message
    });
  }

  const onSubmit = (data) => {
    const providerId = selectedProvider !== noProviderSelection ? selectedProvider : undefined;
    try {
      login({ ...data, providerId }).then(success, failure);
    } catch (message) {
      AppToaster.show({
        icon: 'error',
        intent: 'warning',
        message
      });
    }
  };

  const forgotPassword = () => {
    formChange({ formName: 'forgot' });
  };

  const { email, password } = watch();
  validationSchema.isValid({ email, password }).then((valid) => setSchemaIsValid(valid));
  const validToSubmit = Boolean(!errors.email && !errors.password && email && schemaIsValid);

  const providerSelection = false;

  return (
    <Container component="main" maxWidth="xs">
      <form className={classes.paper}>
        <Grid container direction="row" justify="center" style={{ width: '100%' }}>
          <Avatar className={classes.avatar}>
            {' '}
            <LockOutlined />{' '}
          </Avatar>
          {enableKeys && (
            <Avatar className={classes.avatar}>
              {' '}
              <VpnKey />{' '}
            </Avatar>
          )}
        </Grid>
        <Typography component="h1" variant="h5">
          {' '}
        </Typography>
        {providerSelection && (
          <TMXSelect
            id="provider"
            fullWidth
            variant="outlined"
            className={classes.editField}
            value={selectedProvider}
            onChange={selectProvider}
          >
            <MenuItem value={noProviderSelection}>
              <b>Select Provider</b>
            </MenuItem>
            {(providers || []).map((t) => (
              <MenuItem key={t.orgId} value={t.orgId}>
                {t.name}
              </MenuItem>
            ))}
          </TMXSelect>
        )}
        <Controller
          name="email"
          control={control}
          defaultValue={defaultValues.password}
          rules={{ required: true }}
          render={({ field }) => (
            <TextField
              autoFocus
              fullWidth
              margin="normal"
              variant="outlined"
              label="Email"
              autoComplete={'email'}
              onChange={async () => {
                await trigger('email');
              }}
              helperText={errors.email && 'Must be valid email'}
              FormHelperTextProps={{ style: { color: 'red' } }}
              className={classes.editField}
              {...field}
            />
          )}
        />
        <Controller
          name="password"
          control={control}
          defaultValue={defaultValues.password}
          rules={{ required: true }}
          render={({ field }) => (
            <TextField
              fullWidth
              type="password"
              margin="normal"
              variant="outlined"
              label="Password"
              onChange={async () => {
                await trigger('password');
              }}
              autoComplete={'current-password'}
              helperText={errors.password && '8 Characters Minimum'}
              FormHelperTextProps={{ style: { color: 'red' } }}
              className={classes.editField}
              {...field}
            />
          )}
        />
        {rememberMe && (
          <FormControlLabel
            control={
              <Controller
                name="remember"
                control={control}
                defaultValue={false}
                rules={{ required: true }}
                render={({ field }) => <Checkbox {...field} />}
              />
            }
            label="Remember Me"
          />
        )}
        <Button
          fullWidth
          type="submit"
          variant="contained"
          color="primary"
          onClick={handleSubmit(onSubmit)}
          disabled={!validToSubmit}
          className={classes.submit}
        >
          Sign In
        </Button>
        <Grid container justify="flex-end" style={{ marginTop: 10 }}>
          <Grid item xs>
            <Link href="#" variant="body2" onClick={forgotPassword}>
              {' '}
              Forgot Password{' '}
            </Link>
          </Grid>
          <Grid item>
            <Link href="#" variant="body2">
              {' '}
              No Account{' '}
            </Link>
          </Grid>
        </Grid>
      </form>
    </Container>
  );
};
