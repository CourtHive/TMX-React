import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { Dialog, DialogContent } from '@material-ui/core';
import { FormLogin } from './FormLogin';
import { FormForgot } from './FormForgot';
import { FormReset } from './FormReset';

export const LoginModal = (props) => {
  const dispatch = useDispatch();
  const loginModal = useSelector((state) => state.tmx.loginModal);
  const [formData, setForm] = useState({ formName: 'login', email: '' });

  const cancelAction = () => {
    dispatch({ type: 'login modal', payload: false });
  };

  const formChange = ({ formName, email }) => {
    setForm({ formName, email });
  };

  return (
    <Dialog disableBackdropClick={false} open={loginModal} maxWidth={'md'} onClose={cancelAction}>
      <DialogContent>
        {formData.formName === 'login' && <FormLogin formChange={formChange} {...props} />}
        {formData.formName === 'forgot' && <FormForgot formChange={formChange} {...props} />}
        {formData.formName === 'reset' && <FormReset formChange={formChange} email={formData.email} {...props} />}
      </DialogContent>
    </Dialog>
  );
};
