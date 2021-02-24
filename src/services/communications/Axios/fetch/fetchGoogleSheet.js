import axios from 'axios';
import { token } from 'config/bearerToken';
import { googleSheets as gs } from './googleSheets';

import { tmxStore } from 'stores/tmxStore';

export function fetchGoogleSheet({ url }) {
  return new Promise((resolve, reject) => {
    const sheetId = extractSheetId(url);
    if (!sheetId) return reject('No Sheet ID');

    tmxStore.dispatch({ type: 'loading state', payload: true });
    const loadingComplete = () => {
      tmxStore.dispatch({ type: 'loading state', payload: false });
    };

    const headers = {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json'
    };

    const chcsRootURL = process.env.REACT_APP_CHCS_ROOT_URL;
    const chcsServerPath = process.env.REACT_APP_CHCS_SERVER_PATH || '';
    const endpoint = `${chcsRootURL}${chcsServerPath}/access/google/sheet`;

    axios
      .post(endpoint, { sheetId, headers }, { withCredentials: true })
      .then((result) => responseHandler(result.data));

    function responseHandler(data) {
      loadingComplete();

      if (data && data.rows) {
        const sheetType = gs.identifySheetType(data.rows);

        if (sheetType === 'players') {
          const { participants } = gs.processSheetPlayers(data.rows);
          const source = { provider: 'google', url };
          tmxStore.dispatch({
            type: 'tournamentEngine',
            payload: {
              methods: [
                {
                  method: 'addParticipants',
                  params: { participants, source }
                }
              ]
            }
          });
          resolve();
        } else {
          resolve();
        }
      } else {
        console.log('failed', { data });
        reject();
      }
    }
  });
}

function extractSheetId(url) {
  const parts = url.split('/');
  if (parts.indexOf('docs.google.com') < 0 || parts.indexOf('spreadsheets') < 0) return undefined;
  return parts.reduce((p, c) => (!p || c.length > p.length ? c : p), undefined);
}
