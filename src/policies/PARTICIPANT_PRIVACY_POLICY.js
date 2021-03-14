import { policyConstants } from 'tods-competition-factory';

const { POLICY_TYPE_PARTICIPANT } = policyConstants;

export const PARTICIPANT_PRIVACY_DEFAULT = {
  [POLICY_TYPE_PARTICIPANT]: {
    policyName: 'Participant Privacy Policy',
    participant: {
      name: true,
      contacts: false,
      individualParticipants: true,
      individualParticipantIds: true,
      onlineResources: false,
      participantName: true,
      participantOtherName: true,
      participantId: true,
      participantRole: true,
      participantStatus: true,
      penalties: false,
      representing: true,
      participantRoleResponsabilities: false,
      participantType: true,
      person: {
        addresses: true,
        biographicalInformation: false,
        birthDate: false,
        contacts: false,
        nationalityCode: true,
        nativeFamilyName: false,
        nativeGivenName: false,
        onlineResources: false,
        otherNames: true,
        parentOrganisationId: false,
        passportFamilyName: false,
        passportGivenName: false,
        personId: false,
        personOtherIds: false,
        previousNames: false,
        sex: false,
        standardFamilyName: true,
        standardGivenName: true,
        status: false,
        tennisId: false,
        wheelchair: true
      }
    }
  }
};

export default PARTICIPANT_PRIVACY_DEFAULT;
