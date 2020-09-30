import { Gender } from './eums/gender';
import { ResidenceModel } from './residenceModel';
import { CertificationModel } from './certificationModel';
import { PersonIdentityModel } from './personIdentityModel';
import { ScaleModel } from './scaleModel';
import { SuspensionModel } from './suspensionModel';
import { StatsModel } from './statsModel';
import { RolesModel } from './rolesModel';
import { ComsModels } from './comsModel';

export interface PersonModel {
  personUUIDs: PersonIdentityModel[];
  passportGivenName: string;
  passportFamilyName: string;
  standardGivenName: string;
  standardFamilyName: string;
  otherName: string;
  birthDate: Date;
  genderCode: Gender;
  nationalityCode: string;
  residence: ResidenceModel;
  scaleValues: ScaleModel[];
  suspensions: SuspensionModel[];
  certifications: CertificationModel[];
  roles: RolesModel[];
  stats: StatsModel[];
  coms: ComsModels[];
  socialMediaHandles: string[];
  avatarUrl: string;
  uuids?: string[];
  normalizedSearchStrings: string[];
}
