// import { drawEngine, matchUpTypes } from 'competitionFactory';
import { drawEngine, matchUpTypes } from 'tods-competition-factory';
const { DOUBLES, SINGLES, TEAM } = matchUpTypes;

export function hasDoubles({ matchUps }) {
  return matchUps.some((matchUp) => matchUp.matchUpType === DOUBLES);
}

export function hasSingles({ matchUps }) {
  return matchUps.some((matchUp) => matchUp.matchUpType === SINGLES);
}

export function hasTeams({ matchUps }) {
  return matchUps.some((matchUp) => matchUp.matchUpType === TEAM);
}

export function hasNationalities({ participants }) {
  return participants.reduce((hasNationalities, participant) => {
    const individualParticipants = participant.person ? [participant] : participant.individualParticipants || [];
    const nationalityCodes = individualParticipants.reduce((nationalityCodes, participant) => {
      const nationalityCode = participant.person && participant.person.nationalityCode;
      return nationalityCodes || Boolean(nationalityCode);
    }, undefined);
    return hasNationalities || nationalityCodes;
  }, undefined);
}

function instanceCount(values) {
  return values.reduce((a, c) => {
    if (!a[c]) a[c] = 0;
    a[c]++;
    return a;
  }, {});
}
export function feedAnalysis({ matchUps }) {
  const { roundMatchUps } = drawEngine.getRoundMatchUps({ matchUps });
  const roundCounts = Object.keys(roundMatchUps).map((round) => roundMatchUps[round].length);
  const roundAnalysis = roundCounts.reduce(
    (p, value) => {
      const counter = value !== p.value ? p.counter + 1 : p.counter;
      const guide = p.guide.concat(counter);
      const fed = p.fed.concat(value === p.value ? 1 : 0);
      return { value, counter, guide, fed };
    },
    { value: 0, counter: 0, guide: [], fed: [] }
  );
  const feedRounds = roundAnalysis.fed.reduce((feedRounds, candidate, i) => {
    return candidate ? feedRounds.concat(i) : feedRounds;
  }, []);
  const repeatMax = Math.max(...Object.values(instanceCount(roundCounts)));
  return { feedIn: repeatMax > 1, roundGuide: roundAnalysis.guide, fedCount: roundAnalysis.fed, feedRounds };
}

export function scanData({ matchUps, participants }) {
  const dataScan = { drawPositions: true };
  if (participants) {
    dataScan.drawEntry = participants.reduce((p, c) => c.entry || p, undefined) ? true : false;
    dataScan.playerRankings = participants.reduce((p, c) => c.rank || p, undefined) ? true : false;
    dataScan.playerRatings = participants.reduce((p, c) => c.rating || p, undefined) ? true : false;
  }
  if (matchUps) {
  }
  return dataScan;
}
