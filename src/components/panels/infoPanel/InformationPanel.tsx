import React from 'react';
import { useSelector } from 'react-redux';

import { TournamentView } from 'components/panels/infoPanel/tournamentView';
import { TournamentNotes } from 'components/panels/infoPanel/tournamentNotes';
import { TournamentMedia } from 'components/panels/infoPanel/tournamentMedia';
import { TournamentActions } from 'components/panels/infoPanel/tournamentActions';
import { TournamentOverview } from 'components/panels/infoPanel/tournamentOverview';

import { TTAB_OVERVIEW, TTAB_NOTES, TTAB_MEDIA, TTAB_ACTIONS } from 'stores/tmx/types/tabs';
import { useStyles } from 'components/panels/infoPanel/style';

export const InformationPanel = () => {
  const classes = useStyles();
  
  const tournamentView = useSelector((state: any) => state.tmx.visible.tournamentView);
  const selectedTournamentId = useSelector((state: any) => state.tmx.selectedTournamentId);
  const tournamentRecord = useSelector((state: any) => state.tmx.records[selectedTournamentId]);

  return (
    <>  
      <TournamentView />
      <div className={classes.divider} />
      { tournamentView === TTAB_OVERVIEW && <TournamentOverview tournamentRecord={tournamentRecord} /> }
      { tournamentView === TTAB_NOTES && <TournamentNotes tournamentRecord={tournamentRecord} /> }
      { tournamentView === TTAB_MEDIA && <TournamentMedia tournamentRecord={tournamentRecord} /> }
      { tournamentView === TTAB_ACTIONS && <TournamentActions tournamentRecord={tournamentRecord} /> }
    </>
  )
};
