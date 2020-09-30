import { PersonIdentityModel } from './personIdentityModel';

export interface AssigneeModel {
  standardGivenName: string;
  standardFamilyName: string;
  personUUID: PersonIdentityModel;
}
