import { AssigneeModel } from './assigneeModel';
import { TournamentAssigneeModel } from './tournamentAssigneeModel';

export interface TournamentCalendarModel {
  _id?: string;
  tournamentId?: string;
  unifiedTournamentId?: any;
  sorterId?: string;
  providerId?: string;
  tournamentDirector?: AssigneeModel;
  name?: string;
  start?: Date;
  end?: Date;
  rank?: string;
  category?: string;
  notes?: string;
  officials?: TournamentAssigneeModel[];
  candidates?: AssigneeModel[];
}
