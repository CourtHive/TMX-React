import { ContactChannel } from './eums/contactChannel';

export interface ComsModels {
  comsDescription: string;
  comsType?: ContactChannel;
  comsValue?: string;
}
