export function itaInvoiceHeader() {
  const header = {
    margin: [40, 30],
    columns: [
      {
        image: 'itaLogo',
        width: 50
      },
      {
        width: 'auto',
        text: 'Invoice',
        style: 'header'
      }
    ]
  };

  return header;
}
