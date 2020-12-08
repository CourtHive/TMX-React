import { AttributeModel } from './attributeModel';

export interface ScaleModel {
  providerId: string;
  scaleName: string;
  scaleType: string;
  scaleValue: number;
  // valueBasis for U14 Ranking of #1 could be attribute: 'points', value: 2000
  valueBasis: AttributeModel<number>[];
  createdAt: Date;
}
