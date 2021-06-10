import React from 'react';

import AlertDialog from 'components/dialogs/alertDialog';
import { AppToaster } from 'components/dialogs/AppToaster';
import { TMXcalendar } from 'components/calendar/CalendarDisplay';

function HomePage() {
  return (
    <div id="main" className="noselect">
      <AppToaster />
      <AlertDialog />
      <TMXcalendar />
    </div>
  );
}

export default HomePage;
