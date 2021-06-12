import React, { useState } from 'react';
import { useDispatch } from 'react-redux';

import { Button, TextField } from '@material-ui/core';
import { Typography, Link, Container, Grid } from '@material-ui/core';

import { useStyles } from './style';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { passwordReset } from 'services/authentication/authApi';
import { AppToaster } from 'services/notifications/toaster';

import * as Yup from 'yup';

export const validationSchema = Yup.object().shape({
  code: Yup.string().min(6).required(''),
  newpassword: Yup.string().min(8).required('')
});

export const FormReset = ({ formChange, email }) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const defaultValues = { code: '', newpassword: '' };
  const [schemaIsValid, setSchemaIsValid] = useState(false);

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

  function success(response) {
    const success = response?.data === 'success';
    const intent = success ? 'success' : 'error';
    const message = success ? 'Password has been reeset' : response?.data || 'Error';
    AppToaster.show({
      icon: 'success',
      intent,
      message
    });
    if (success) {
      formChange({ formName: 'login' });
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
      passwordReset({ ...data, email }).then(success, failure);
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

  const { code, newpassword } = watch();
  validationSchema.isValid({ code, newpassword }).then((valid) => setSchemaIsValid(valid));
  const validToSubmit = Boolean(!errors.code && !errors.newpassword && code && schemaIsValid);

  return (
    <Container component="main" maxWidth="xs">
      <form className={classes.paper}>
        <Typography className={classes.editField} component="h1" variant="h5">
          {'New Password'}
        </Typography>
        <Controller
          name="code"
          control={control}
          rules={{ required: true }}
          render={({ field }) => (
            <TextField
              autoFocus
              fullWidth
              margin="normal"
              variant="outlined"
              label="Code"
              onChange={async () => {
                await trigger('code');
              }}
              helperText={errors.code && 'Must be valid code'}
              FormHelperTextProps={{ style: { color: 'red' } }}
              className={classes.editField}
              {...field}
            />
          )}
        />
        <Controller
          name="newpassword"
          control={control}
          rules={{ required: true }}
          render={({ field }) => (
            <TextField
              fullWidth
              type="password"
              margin="normal"
              variant="outlined"
              label="New Password"
              onChange={async () => {
                await trigger('newpassword');
              }}
              helperText={errors.newpassword && '8 Characters Minimum'}
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
          Submit
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
