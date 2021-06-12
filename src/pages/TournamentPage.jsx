import React from 'react';
import { TournamentRoot } from 'components/tournament/TournamentRoot';

import { useLoadTournament } from 'hooks/useLoadTournament';
import { useSelector } from 'react-redux';

const TournamentPage = (props) => {
  const { tabIndex, match } = props;

  const dbLoaded = useSelector((state) => state.tmx.dbLoaded);
  const selectedTournamentId = useSelector((state) => state.tmx.selectedTournamentId);
  const tournamentRecord = useSelector((state) => state.tmx.records[selectedTournamentId]);
  const tournamentId = match?.params?.tournamentId;

  useLoadTournament(tournamentRecord, tournamentId);

  console.log({ tournamentRecord });

  return dbLoaded && tournamentRecord ? (
    <TournamentRoot tournamentRecord={tournamentRecord} tabIndex={tabIndex} params={match?.params} />
  ) : (
    <>No Tournament</>
  );
};

export default TournamentPage;
