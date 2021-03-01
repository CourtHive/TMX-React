import { env } from 'config/defaults';

import { db } from 'services/storage/db';
import i18n from 'i18next';
import { coms } from 'services/communications/SocketIo/coms';
import { fetchFx } from 'services/communications/Axios/fetchFx';
import { updateCalendar } from 'services/storage/updateCalendar';

import { AppToaster } from 'services/notifications/toaster';

export function refreshTournaments({ merge, deleteReplace } = {}) {
  if (coms.onLine()) {
    if (deleteReplace) {
      db.db.tournaments
        .toCollection()
        .delete()
        .then(fetchNew, () => {});
    } else {
      fetchNew();
    }
  } else {
    return AppToaster.show({ icon: 'info-sign', intent: 'warning', message: i18n.t('phrases.noconnection') });
  }

  function fetchNew() {
    fetchFx.fetchNewTournaments(merge).then((tournaments) => updateCalendar({ tournaments, merge }), checkServer);
  }
  function checkServer(err) {
    if (env.server.sync.tournaments) {
      // pull in tournaments from CourtHive Server
    } else {
      return AppToaster.show({ icon: 'error', intent: 'error', message: i18n.t('tournaments.noauth') });
    }
  }
}
