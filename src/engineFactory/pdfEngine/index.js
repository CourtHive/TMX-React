import { fetchImages } from 'engineFactory/pdfEngine/resources/fetchImages';
import { pdfDrawGenerator } from 'engineFactory/pdfEngine/generators/pdfDrawGenerator';
import { matchListGenerator } from 'engineFactory/pdfEngine/generators/matchListGenerator';
import { emitPDF, savePDF, openPDF } from 'services/files/pdf/pdfExport';

const actions = {
  save: (directive) =>
    new Promise((resolve) => {
      const docDefinition = directive.docDefinition;
      const filename = directive.props.filename || 'export.pdf';
      savePDF({ docDefinition, filename });
      resolve();
    }),
  open: (directive) =>
    new Promise((resolve) => {
      const docDefinition = directive.docDefinition;
      openPDF({ docDefinition });
      resolve();
    }),
  emit: (directive) =>
    new Promise((resolve) => {
      const docDefinition = directive.docDefinition;
      const { euid, callback } = directive.props;
      emitPDF({ docDefinition, euid, callback });
      resolve();
    })
};

const generatorArray = [pdfDrawGenerator, matchListGenerator];

const generators = Object.assign({}, ...generatorArray);

const createEngine = (handlers) => (directive) => {
  return new Promise((resolve, reject) => {
    function generateDocDefinition(images) {
      Object.assign(directive, { images });
      handlers[directive.type](directive).then(success, reject);
    }

    function success({ docDefinition }) {
      if (!Object.keys(actions).includes(directive.action)) {
        return resolve({ docDefinition });
      }
      Object.assign(directive, { docDefinition });
      actions[directive.action](directive).then(resolve, reject);
    }
    if (!Object.keys(handlers).includes(directive.type)) {
      reject();
    }
    try {
      fetchImages(directive).then(generateDocDefinition, reject);
    } catch (err) {
      reject(err);
    }
  });
};

export default createEngine(generators);
