import { Directive } from './types/directive';
import { fetchImages } from './imageResolver';
import { itaInvoiceGenerator } from '../templates/itaInvoice/itaInvoiceTemplate';
import { DirectiveAction } from './types/directive/action';
import { ActionType } from './types/directive/enums/actionType';
import { openPDF, savePDF } from '../engine';
//import {emitPDF} from '../engine';

const generatorCollection = [itaInvoiceGenerator];
const generators = Object.assign({}, ...generatorCollection);

async function runAction(docDefinition, action: DirectiveAction) {
  switch (action.type) {
    case ActionType.OPEN:
      openPDF(docDefinition);
      return;
    case ActionType.EMIT:
      //emitPDF();
      break;
    case ActionType.SAVE:
      savePDF(docDefinition, action.saveAsFileName);
      break;
  }
}

export async function pdfEngineImpl(directive: Directive) {
  if (!Object.keys(generators).includes(directive.type)) throw new Error(`Unknown generator type: ${directive.type}`);

  await fetchImages(directive);
  const docDefinition = generators[directive.type](directive);

  return await runAction(docDefinition, directive.action);
}
