import jwtDecode from 'jwt-decode';

export function validateToken(token) {
  if (!token) return undefined;

  const decodedToken = jwtDecode(token);
  const dateNow = new Date();

  // Token expired
  if (decodedToken.exp < dateNow.getTime() / 1000) return undefined;

  return decodedToken;
}
