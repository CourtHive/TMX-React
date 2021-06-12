import { serverUrl } from 'config/urls';
import { baseApi } from './baseApi';

export async function login({ email, password, providerId }) {
  return baseApi.post(`${serverUrl}/authentication/login`, {
    email,
    password,
    providerId
  });
}

export async function getProviders() {
  return baseApi.post(`${serverUrl}/authentication/providers`, {});
}

export async function passwordResetRequest({ email }) {
  return baseApi.post(`${serverUrl}/authentication/passwordResetRequest`, { email });
}

export async function passwordReset({ email, newpassword, code }) {
  return baseApi.post(`${serverUrl}/authentication/passwordReset`, { email, newpassword, code });
}

export async function generateToken({ email, tournamentId, expirationDate }) {
  return baseApi.post(`${serverUrl}/authentication/generateToken`, {
    email,
    tournamentId,
    expirationDate
  });
}

export async function getDelegationCode({ tournamentId, expirationDate, provider }) {
  return baseApi.post(`${serverUrl}/authentication/delegationCode`, {
    tournamentId,
    expirationDate,
    provider
  });
}
