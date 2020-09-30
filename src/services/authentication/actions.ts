import jwtDecode from 'jwt-decode';
import { JWTPayloadModel } from 'models/jwtPayloadModel';

export function validateToken(token: string | null) {
  if (!token) return undefined;

  const decodedToken = jwtDecode(token) as JWTPayloadModel;
  const dateNow = new Date();

  // Token expired
  if (decodedToken.exp < dateNow.getTime() / 1000) return undefined;

  return decodedToken;
}
