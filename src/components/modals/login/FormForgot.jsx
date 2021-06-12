import React, { useState } from 'react';
import { useDispatch } from 'react-redux';

import { Button, TextField } from '@material-ui/core';
import { Typography, Link, Container, Grid } from '@material-ui/core';

import { useStyles } from './style';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { passwordResetRequest } from 'services/authentication/authApi';

import * as Yup from 'yup';
import { AppToaster } from 'services/notifications/toaster';

export const validationSchema = Yup.object().shape({
  email: Yup.string().email().required('')
});

export const FormForgot = ({ formChange }) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const defaultValues = { email: '' };
  const [schemaIsValid, setSchemaIsValid] = useState(false);

  const {
    control,
    handleSubmit,
    watch,
    triggerValidation,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues,
    reValidateMode: 'onChange'
  });

  function success(response) {
    const success = response?.data === 'success';
    const icon = success ? 'success' : 'error';
    const intent = success ? 'success' : 'warning';
    const message = success ? 'Recovery Email Sent' : response?.data || 'Error';
    AppToaster.show({
      icon,
      intent,
      message
    });
    if (success) {
      formChange({ formName: 'reset', email });
    } else {
      dispatch({ type: 'login modal', payload: false });
    }
  }

  function failure(message) {
    AppToaster.show({
      icon: 'error',
      intent: 'warning',
      message
    });
  }

  const onSubmit = (data) => {
    try {
      passwordResetRequest({ ...data }).then(success, failure);
    } catch (message) {
      AppToaster.show({
        icon: 'error',
        intent: 'warning',
        message
      });
    }
  };

  const loginForm = () => {
    formChange({ formName: 'login' });
  };

  const { email } = watch();
  validationSchema.isValid({ email }).then((valid) => setSchemaIsValid(valid));
  const validToSubmit = Boolean(!errors.email && email && schemaIsValid);

  return (
    <Container component="main" maxWidth="xs">
      <form className={classes.paper}>
        <Typography className={classes.editField} component="h1" variant="h5">
          {'Password Recovery'}
        </Typography>
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
                await triggerValidation('email');
              }}
              helperText={errors.email && 'Must be valid email'}
              FormHelperTextProps={{ style: { color: 'red' } }}
              className={classes.editField}
              {...field}
            />
          )}
        />
        <Button
          fullWidth
          type="submit"
          variant="contained"
          color="primary"
          onClick={handleSubmit(onSubmit)}
          disabled={!validToSubmit}
          className={classes.submit}
        >
          Request Code
        </Button>
        <Grid container justify="flex-end" style={{ marginTop: 10 }}>
          <Grid item xs>
            <Link href="#" variant="body2" onClick={loginForm}>
              {' '}
              Login{' '}
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
