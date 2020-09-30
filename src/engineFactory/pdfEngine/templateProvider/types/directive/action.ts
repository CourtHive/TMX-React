import { ActionType } from './enums/actionType';

export interface DirectiveAction {
  type: ActionType;
  saveAsFileName?: string;
}
