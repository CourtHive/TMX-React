import { getJwtTokenStorageKey } from 'config/localStorage';
import { validateToken } from 'services/authentication/actions';

const JWT_TOKEN_STORAGE_NAME = getJwtTokenStorageKey();

export function getLoginState() {
  const token = localStorage.getItem(JWT_TOKEN_STORAGE_NAME);
  const loginState = validateToken(token);
  return loginState;
}
