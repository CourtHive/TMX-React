import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useStyles } from 'components/styles';

import AlertDialog from 'components/dialogs/alertDialog';
import { AppToaster } from 'components/dialogs/AppToaster';
import { TournamentRoot } from 'components/tournament/TournamentRoot';
import { TMXcalendar } from 'components/calendar/CalendarDisplay';

import SPLASH from 'images/splash.png';

const SplashImage = <img src={SPLASH} style={{ width: '100%', maxWidth: '800px' }} alt="tmxLogo" />;

function HomePage() {
  const classes = useStyles();
  const [showContent, setShowContent] = useState(false);
  const selectedTournamentId = useSelector((state: any) => state.tmx.selectedTournamentId);
  const tournamentRecord = useSelector((state: any) => state.tmx.records[selectedTournamentId]);
  const tournamentId = tournamentRecord?.unifiedTournamentId?.tournamentId || tournamentRecord?.tournamentId;

  useEffect(() => {
    setTimeout(() => setShowContent(true), 1000);
  }, []);

  return (
    <div id="main" className="noselect">
      <AppToaster />
      <AlertDialog />
      {showContent ? (
        tournamentId ? (
          <TournamentRoot />
        ) : (
          <TMXcalendar />
        )
      ) : (
        <div id="splash" className={classes.splash}>
          {SplashImage}
        </div>
      )}
    </div>
  );
}

export default HomePage;
