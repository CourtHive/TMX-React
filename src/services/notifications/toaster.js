import { tmxStore } from 'stores/tmxStore';

/*
  wrapper for legacy AppToaster
*/
export const AppToaster = {
  show: ({ icon, intent, message }) => {
    tmxStore.dispatch({
      type: 'toaster state',
      payload: { severity: intent, message }
    });    
  }
}