import { baseApi } from './baseApi';

export async function login(emailAddress: string, password: string) {
  return baseApi.post('/auth/login', {
    email: emailAddress,
    password,
  });
}

export async function setPassword(password: string, setPasswordToken: string) {
  return baseApi.post('/auth/set-password', {
    setPasswordToken,
    password,
  });
}

export async function confirmEmail(emailConfirmationId: string) {
  return baseApi.get(`/auth/confirm/${emailConfirmationId}`);
}

export async function forgotPassword(emailAddress: string) {
  return baseApi.post('/auth/forgot-password', { emailAddress });
}

export async function resetPassword(emailAddress: string, password: string, code: string) {
  return baseApi.post('/auth/reset-password', { emailAddress, password, code });
}
