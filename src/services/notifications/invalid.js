import React from 'react';
import { AppToaster } from 'services/notifications/toaster';
import { tmxStore } from 'stores/tmxStore';

import i18n from 'i18next';

export function invalidURLorNotShared() {
  tmxStore.dispatch({ type: 'loading state', payload: false });
  let message = (
    <div>
      {i18n.t('phrases.invalidsheeturl')}
      <b>{i18n.t('or')}</b>
      Sheet needs to be shared so that `Anyone with the link can <i>VIEW</i>`<b>{i18n.t('or')}</b>
      Sheet needs to be shared privately with CourtHive Server
    </div>
  );
  AppToaster.show({ icon: 'error', intent: 'error', message, timeout: 8000 });
}
