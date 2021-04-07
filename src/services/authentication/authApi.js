import { baseApi } from './baseApi';

export async function login(emailAddress, password) {
  return baseApi.post('/auth/login', {
    email: emailAddress,
    password
  });
}

export async function setPassword(password, setPasswordToken) {
  return baseApi.post('/auth/set-password', {
    setPasswordToken,
    password
  });
}

export async function confirmEmail(emailConfirmationId) {
  return baseApi.get(`/auth/confirm/${emailConfirmationId}`);
}

export async function forgotPassword(emailAddress) {
  return baseApi.post('/auth/forgot-password', { emailAddress });
}

export async function resetPassword(emailAddress, password, code) {
  return baseApi.post('/auth/reset-password', { emailAddress, password, code });
}
