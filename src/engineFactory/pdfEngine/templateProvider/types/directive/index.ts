import { DirectiveAction } from './action';
import { ImageRef } from './imageRef';
import { DirectiveType } from './enums/directiveType';

export interface Directive {
  type: DirectiveType;
  action: DirectiveAction;
  imageRefs?: ImageRef[];
  resolvedImages?: any;
  docDefinition?: any;
  props?: any;
}
