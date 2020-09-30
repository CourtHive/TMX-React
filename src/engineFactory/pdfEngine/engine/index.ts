import { tmxStore } from 'stores/tmxStore';
import { exportFx } from 'services/files/exportFx';
import { coms } from 'services/communications/SocketIo/coms';

export function openPDF(docDefinition) {
  const { pdfMake } = window as any;
  pdfMake.createPdf(docDefinition).open();
  tmxStore.dispatch({ type: 'loading state', payload: false });
}

export function emitPDF(docDefinition, eventId, callback) {
  const { pdfMake } = window as any;

  const pdfDocGenerator = pdfMake.createPdf(docDefinition);
  pdfDocGenerator.getBase64((data) => {
    coms.emitTmx({ action: 'pdf', payload: { eventId, data } }, callback);
    tmxStore.dispatch({ type: 'loading state', payload: false });
  });
}

export function savePDF(docDefinition, filename) {
  const { pdfMake } = window as any;
  const pdfDocGenerator = pdfMake.createPdf(docDefinition);
  pdfDocGenerator.getBase64((data) => {
    const blob = exportFx.b64toBlob(data, 'application/pdf');
    exportFx.saveBlob(blob, filename || 'default.pdf');
    tmxStore.dispatch({ type: 'loading state', payload: false });
  });
}
