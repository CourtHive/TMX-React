import { PersonRole } from './eums/personRole';

export interface JWTPayloadModel {
  /**User Id */
  personId: string;
  /**User full name */
  name: string;
  /**Person first name */
  fName: string;
  /**Person last name */
  lName: string;
  /**User roles*/
  roles: PersonRole[];
  /**Token creation date (issued at)*/
  iat: number;
  /**Token expiry*/
  exp: number;
  /**Token issuer*/
  iss: string;
}
