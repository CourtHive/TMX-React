import { DateRangeModel } from './dateRangeModel';
import { AttributeModel } from './attributeModel';

export interface CertificationModel {
  certType?: string;
  certValidity: DateRangeModel;
  certAttributes: AttributeModel<string>[];
  certVerifierId: string; // provider who produced this certification
}
