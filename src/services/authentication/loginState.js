import { validateToken } from 'services/authentication/actions';
import { getJwtTokenStorageKey } from 'config/localStorage';
import { setLogo } from 'services/imageHandlers/getImage';
import { context } from 'services/context';
import { tmxStore } from 'stores/tmxStore';

const JWT_TOKEN_STORAGE_NAME = getJwtTokenStorageKey();

export function getLoginState() {
  const token = localStorage.getItem(JWT_TOKEN_STORAGE_NAME);
  const loginState = validateToken(token);
  if (loginState) {
    tmxStore.dispatch({ type: 'auth state', payload: true });
    context.state.admin = loginState?.roles?.includes('admin');
  }
  return loginState;
}

export function logOut() {
  tmxStore.dispatch({ type: 'auth state', payload: false });
  localStorage.removeItem(JWT_TOKEN_STORAGE_NAME);
  setLogo();
}
