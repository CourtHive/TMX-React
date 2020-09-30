import { TournamentRoles } from './eums/tournamentRoles';
import { AssigneeModel } from './assigneeModel';

export interface TournamentAssigneeModel {
  _id?: string;
  role: TournamentRoles;
  person: AssigneeModel;
}
