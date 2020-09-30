import axios from 'axios';
import { env } from 'config/defaults';
import { token } from 'config/bearerToken';
import i18n from 'i18next';
import { defineLink } from 'components/forms/linkEntry/linkEntry';
import { updateCalendar } from 'services/storage/updateCalendar';

export function fetchTournament() {
  defineLink({
    link: '',
    validate: false,
    title: i18n.t('tournaments.id'),
    callback: processIDexternal
  });

  function processIDexternal(tournamentId) {
    const headers = {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json'
    };

    const chcsRootURL = process.env.REACT_APP_CHCS_ROOT_URL;
    const chcsServerPath = process.env.REACT_APP_CHCS_SERVER_PATH || '';
    const endpoint = `${chcsRootURL}${chcsServerPath}/access/tournament`;
    const providerId = env.org?.ouid;

    axios
      .post(endpoint, { providerId, tournamentId, headers }, { withCredentials: true })
      .then(responseHandler, failure);

    function responseHandler(result) {
      if (result.data) {
        const { tournament } = result.data;
        const tournaments = [tournament];
        updateCalendar({ tournaments, merge: true });
      } else {
        console.log('error', { result });
      }
    }

    function failure(result) {
      console.log('failure:', { result });
    }
  }
}
