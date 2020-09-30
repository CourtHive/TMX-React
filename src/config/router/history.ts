import { createBrowserHistory } from 'history';

export default (history) => createBrowserHistory({
  basename: history
});
