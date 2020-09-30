import axios from 'axios';
import { token } from 'config/bearerToken';

export function fetchURL({url, codepage}) {
    return new Promise((resolve, reject) => {
        let headers = {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json'
        };

        const chcsRootURL = process.env.REACT_APP_CHCS_ROOT_URL;
        const chcsServerPath = process.env.REACT_APP_CHCS_SERVER_PATH || '';
        const endpoint = `${chcsRootURL}${chcsServerPath}/access/fetch`;

        axios
            .post( endpoint, { url, codepage, headers }, { withCredentials: true })
            .then(responseHandler, failure);

        function responseHandler(result) {
            if (result.data) {
                resolve(result.data);
            } else {
                return reject(result);
            }
        }
        
        function failure(result) { console.log('failure:', {result}); }
    });
}
