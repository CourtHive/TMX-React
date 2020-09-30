import { context } from './context';
import { tmxStore } from '../stores/tmxStore';

let content;

function selectDisplay(which) {
  setState('tmxcontent', which);
  setState('splash', which);
  setState('mytournaments', which);
}
function setState(id, which) {
  const display = id === which;
  const docnode = document.getElementById(id);
  if (docnode) docnode.style.display = display ? 'flex' : 'none';
}

function clearContext() {
  if (context.tournamentId) {
    context.ee.emit('emitTmx', {
      action: 'leaveTournament',
      payload: { tournamentId: context.tournamentId }
    });
    context.tournamentId = undefined;
  }
}

export const contentEquals = (what) => {
  return what ? what === content : content;
};
export const showSplash = () => {
  clearContext();
  selectDisplay('splash');
  tmxStore.dispatch({ type: 'edit state', payload: false });
  tmxStore.dispatch({ type: 'display splash' });
  tmxStore.dispatch({ type: 'clear tournament' });
};
export const showContent = (what) => {
  content = what;
  selectDisplay('tmxcontent');
  tmxStore.dispatch({ type: 'display tournament' });
};
export const showCalendar = () => {
  clearContext();
  selectDisplay('mytournaments');
  tmxStore.dispatch({ type: 'display calendar' });
  tmxStore.dispatch({ type: 'clear tournament' });
  tmxStore.dispatch({ type: 'edit state', payload: false });
};
