// import { tournamentEngine, fixtures } from 'competitionFactory';
import { tournamentEngine, fixtures } from 'tods-competition-factory';
const { countries } = fixtures;

export function generatePlayerTableData(props) {
  const {
    classes,
    tableData,
    participants,
    selectedTeam,
    selectedGender,
    teamParticipants,
    groupParticipants,
    selectedSignInStatus,
    selectedGroupingParticipantIds
  } = props;

  const getGender = (sex) => {
    return sex && sex[0].toUpperCase();
  };

  const statusFilter = (participant) => {
    const signedIn = tournamentEngine.getParticipantSignInStatus(participant);
    if (selectedSignInStatus === 'false' && signedIn) return false;
    return !(selectedSignInStatus === 'true' && !signedIn);
  };

  const participantFilter = (participant) => {
    if (selectedGender === 'X' && selectedSignInStatus === '-' && !selectedTeam) return true;
    if (selectedGender !== 'X' && getGender(participant.person.sex) !== selectedGender) return false;
    if (selectedTeam && selectedGroupingParticipantIds.indexOf(participant.participantId) < 0) return false;
    return statusFilter(participant);
  };

  const renderName = (participant) => {
    const { person } = participant;
    if (person) {
      const firstName = person.standardGivenName;
      const lastName = person.standardFamilyName;
      let participantName = `${firstName} ${lastName}`;
      if (person.otherName) participantName += ` (${person.otherName})`;
      return participantName;
    } else {
      return participant.participantName;
    }
  };

  const renderNationality = (participant) => {
    const { person } = participant;
    if (person && person.nationalityCode) {
      const code = person.nationalityCode.toUpperCase();
      const country = countries.find((country) => {
        if (country.ioc === code) return true;
        if (country.iso === code) return true;
        return false;
      });
      const countryName = country?.label;
      return countryName;
    }
  };

  const renderTeamName = (participant) => {
    const { participantId } = participant;
    const playerTeam = teamParticipants.find((team) => {
      return team.individualParticipantIds?.includes(participantId);
    });
    return playerTeam?.participantName;
  };

  const renderGroupNames = (participant) => {
    const { participantId } = participant;
    const playerGroups = groupParticipants.filter((group) => {
      return group.individualParticipants?.includes(participantId);
    });
    const groupNames = playerGroups.map((group) => group.name).join(', ');
    return groupNames || '';
  };

  const checkedParticipantIds = (tableData?.filter((participant) => participant.checked) || []).map(
    (p) => p.participantId
  );

  const data = participants
    .filter(participantFilter)
    .map((participant) => {
      const sex = (participant.person?.sex || '')[0];
      const { participantId, person } = participant;
      const signedIn = tournamentEngine.getParticipantSignInStatus(participant);
      let className = sex === 'M' ? classes.male : sex === 'F' ? classes.female : null;
      if (!signedIn) className += ` ${classes.notSignedIn}`;
      const checked = checkedParticipantIds.includes(participantId);
      return {
        checked,
        signedIn,
        className,
        participantId,
        sex: person?.sex,
        id: participantId,
        ioc: person?.nationalityCode,
        otherName: person?.otherName,
        name: renderName(participant),
        firstName: person?.standardGivenName,
        lastName: person?.standardFamilyName,
        nationality: renderNationality(participant),
        teamName: renderTeamName(participant),
        groups: renderGroupNames(participant)
      };
    })
    .map((participant, i) => ({ ...participant, index: i + 1 }));

  return data;
}
