import { utilities } from 'tods-competition-factory';
const { formatDate } = utilities.dateTime;

export function calendarRecord(tournamentRecord) {
  const eventCategories = (tournamentRecord.events || [])
    .map((event) => event.category?.categoryName)
    .flat()
    .filter((f) => f);
  const categories = utilities.unique(eventCategories);

  const { endDate, startDate, tournamentName, unifiedTournamentId } = tournamentRecord || {};
  let { tournamentId } = unifiedTournamentId || {};
  if (!tournamentId) tournamentId = tournamentRecord.tournamentId;
  const provider = unifiedTournamentId?.organisationAbbreviation || '';

  return {
    categories,
    tournamentId,
    name: tournamentName,
    startDate: formatDate(startDate),
    endDate: formatDate(endDate),
    provider
  };
}
