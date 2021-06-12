import React from 'react';
import ReactDOM from 'react-dom';
import { useTranslation } from 'react-i18next';

import IconButton from '@material-ui/core/IconButton';
import ClearIcon from '@material-ui/icons/Clear';
import InputAdornment from '@material-ui/core/InputAdornment';
import { Button, Dialog, DialogTitle, DialogActions, DialogContent, TextField } from '@material-ui/core';

import { useForm } from 'react-hook-form';
import { validationSchema as linkSchema } from './validation';
import { yupResolver } from '@hookform/resolvers/yup';

let ANCHORID = 'dialogAnchor';

export const LinkEntry = ({ validate = true, onClose, onCancel, initialValues }) => {
  const defaults = { link: '' };
  const { t } = useTranslation();
  const defaultValues = Object.assign(defaults, initialValues);
  const [isOpen, setOpen] = React.useState(true);

  const validationSchema = validate ? linkSchema : undefined;
  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues,
    mode: 'onBlur'
  });
  const cancelAction = () => {
    setOpen(false);
    if (onCancel && typeof onCancel === 'function') onCancel();
  };
  const onSubmit = (data) => {
    setOpen(false);
    if (onClose && typeof onClose === 'function') onClose(data.link);
  };

  return (
    <Dialog disableBackdropClick={false} open={isOpen} maxWidth={'md'} onClose={cancelAction}>
      <DialogTitle>
        <div style={{ minWidth: 400 }}>{initialValues.title}</div>
      </DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          fullWidth
          name={'link'}
          variant="outlined"
          inputRef={register}
          label={initialValues.label}
          placeholder={initialValues.prompt || ''}
          helperText={errors.link && errors.link.message}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label="clear input field"
                  onClick={() => {
                    setValue('link', '');
                  }}
                  edge="end"
                >
                  <ClearIcon />
                </IconButton>
              </InputAdornment>
            )
          }}
        />
      </DialogContent>
      <DialogActions style={{ marginBottom: '1em' }}>
        <Button onClick={cancelAction} color="secondary" variant="outlined">
          {' '}
          {t('ccl')}{' '}
        </Button>
        <Button onClick={handleSubmit(onSubmit)} disabled={false} color="primary" variant="outlined">
          {' '}
          {t('save')}{' '}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export function defineLink({ validate, link, title, prompt, callback }) {
  let anchor = getAnchor();
  let cleanUp = () => ReactDOM.unmountComponentAtNode(anchor);
  let onClose = (link) => {
    cleanUp();
    if (callback && typeof callback === 'function') {
      callback(link);
    }
  };

  let initialValues = { link, title, prompt };
  if (anchor) {
    ReactDOM.render(
      <LinkEntry
        title={title}
        onClose={onClose}
        onCancel={cleanUp}
        validate={validate}
        initialValues={initialValues}
      />,
      anchor
    );
  }
}

function getAnchor() {
  let anchor = document.getElementById(ANCHORID);

  if (!anchor) {
    let el = document.createElement('div');
    el.setAttribute('id', ANCHORID);
    el.setAttribute('style', 'position: absolute;');
    document.body.appendChild(el);
    anchor = document.getElementById(ANCHORID);
  }

  return anchor;
}
