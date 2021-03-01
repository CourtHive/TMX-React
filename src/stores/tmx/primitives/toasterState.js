export function setToasterState({ draftState, payload }) {
  draftState.toasterState.visible = true;
  Object.assign(draftState.toasterState, payload);
}
