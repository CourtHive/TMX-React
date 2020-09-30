import axios from 'axios';
import { env } from 'config/defaults';
import { token } from 'config/bearerToken';

export function fetchCalendar() {
  return new Promise((resolve, reject) => {
    const headers = {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json'
    };

    const chcsRootURL = process.env.REACT_APP_CHCS_ROOT_URL;
    const chcsServerPath = process.env.REACT_APP_CHCS_SERVER_PATH || '';
    const endpoint = `${chcsRootURL}${chcsServerPath}/access/calendar`;
    const providerId = env.org && env.org.ouid;
    if (!providerId) reject({ error: 'Missing Provider Id' });

    axios.post(endpoint, { providerId, headers }, { withCredentials: true }).then(responseHandler, failure);

    function responseHandler(result) {
      if (result.data) {
        resolve(result.data);
      } else {
        return reject(result);
      }
    }

    function failure(result) {
      console.log('failure:', { result });
    }
  });
}
