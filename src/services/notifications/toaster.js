import { tmxStore } from 'stores/tmxStore';

/*
  wrapper for legacy AppToaster
*/
export const AppToaster = {
  show: ({ icon, intent, message }) => {
    if (icon) {
      // this needs to be here for legacy calls
    }
    tmxStore.dispatch({
      type: 'toaster state',
      payload: { severity: intent, message }
    });
  }
};
