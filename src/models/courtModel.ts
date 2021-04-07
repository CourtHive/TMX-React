import { BusinessHoursModel } from './businessHoursModel';
import { CourtEventModel } from './courtEventModel';

export interface CourtModel {
  id: string;
  name: string;
  businessHours: BusinessHoursModel[];
  events: CourtEventModel[];
}
