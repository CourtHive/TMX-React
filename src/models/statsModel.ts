import { AttributeModel } from './attributeModel';

export interface StatsModel {
  statType: string;
  statValue?: number;
  statComponents: AttributeModel<number>[];
}
