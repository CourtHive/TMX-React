export function itaInvoiceFooter() {
  const footer = {
    margin: [40, 0],
    style: 'footer',
    columns: [
      {
        stack: [
          {
            canvas: [
              {
                type: 'line',
                x1: 0,
                y1: 5,
                x2: 515,
                y2: 5,
                lineWidth: 0.5
              }
            ]
          },
          'Intercollegiate Tennis Coaches Association',
          '1130 East University Drive, #115',
          'Tempe, AZ  85281-8402',
          'PH:  1-888-810-4412'
        ]
      }
    ]
  };

  return footer;
}
