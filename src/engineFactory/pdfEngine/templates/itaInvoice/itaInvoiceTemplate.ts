import { itaInvoiceHeader } from './itaInvoiceHeader';
import { itaInvoiceFooter } from './itaInvoiceFooter';
import { Directive } from '../../templateProvider/types/directive';

const tableBorderLayout = {
  hLineWidth: () => 1,
  vLineWidth: () => 1,
  hLineColor: () => '#D5D5D5',
  vLineColor: () => '#D5D5D5'
};

function formatBillingAddress(billingAddress) {
  let addressSegments = [];

  addressSegments.push(billingAddress?.name || '');
  addressSegments.push(`${billingAddress?.streetNr || ''} ${billingAddress?.street || ''}`);
  addressSegments.push(`${billingAddress?.city || ''} ${billingAddress?.postalCode || ''}`);

  return [
    {
      style: 'tableCell',
      stack: addressSegments
    }
  ];
}

function formatInvoiceItems(invoiceItems) {
  if (!invoiceItems || invoiceItems.length === 0) return ['', '', ''];

  let invoiceItemTableRows = [];

  invoiceItems.forEach((invItem) => {
    invoiceItemTableRows.push([
      { text: `${invItem.date || ''}`, style: 'tableCell' },
      { text: `${invItem.description || ''}`, style: 'tableCell' },
      { text: `${invItem.amount || ''}`, style: 'tableCell' }
    ]);
  });

  return invoiceItemTableRows;
}

export function itaInvoiceTemplate(directive: Directive) {
  const { billingAddress, invoiceDetails, invoiceItems } = directive.props;

  var docDefinition = {
    pageSize: 'A4',
    pageOrientation: 'portrait',
    pageMargins: [40, 90, 40, 60],

    header: itaInvoiceHeader(),
    footer: itaInvoiceFooter(),

    content: [
      {
        margin: [0, 50, 0, 0],
        layout: tableBorderLayout,
        table: {
          headerRows: 1,
          heights: ['*', 80],
          widths: ['35%'],

          body: [[{ text: 'BILL TO', style: 'tableHeader' }], formatBillingAddress(billingAddress)]
        }
      },
      {
        margin: [0, 10, 0, 0],
        layout: tableBorderLayout,
        table: {
          headerRows: 1,
          widths: ['auto', 'auto', 'auto', 'auto', '*', 'auto'],
          body: [
            [
              { text: 'INVOICE #', style: 'tableHeader' },
              { text: 'DATE', style: 'tableHeader' },
              { text: 'TOTAL DUE', style: 'tableHeader' },
              { text: 'DUE DATE', style: 'tableHeader' },
              { text: 'TERMS', style: 'tableHeader' },
              { text: 'ENCLOSED', style: 'tableHeader' }
            ],

            [
              {
                text: `${invoiceDetails?.invoiceNr || ''}`,
                style: 'tableCell'
              },
              {
                text: `${invoiceDetails?.invoiceDate || ''}`,
                style: 'tableCell'
              },
              { text: `${invoiceDetails?.totalDue || ''}`, style: 'tableCell' },
              { text: `${invoiceDetails?.dueDate || ''}`, style: 'tableCell' },
              { text: `${invoiceDetails?.terms || ''}`, style: 'tableCell' },
              { text: `${invoiceDetails?.enclosed || ''}`, style: 'tableCell' }
            ]
          ]
        }
      },

      {
        margin: [0, 100, 0, 0],
        layout: tableBorderLayout,
        table: {
          headerRows: 1,
          widths: ['auto', '*', 'auto'],
          body: [
            [
              { text: 'DATE', style: 'tableHeader' },
              { text: 'DESCRIPTION', style: 'tableHeader' },
              { text: 'AMOUNT', style: 'tableHeader' }
            ],
            ...formatInvoiceItems(invoiceItems)
          ]
        }
      },
      {
        columns: [
          {},
          {
            layout: 'noBorders',
            table: {
              headerRows: 0,
              widths: ['*', '*'],
              body: [
                [
                  { text: 'PAYMENT', style: 'tableCell' },
                  {
                    text: `${invoiceDetails.payment || ''}`,
                    style: 'rightAlignedTableCell'
                  }
                ],

                [
                  { text: 'BALANCE DUE', style: 'tableCell' },
                  {
                    text: `$${invoiceDetails.balanceDue || ''}`,
                    style: 'rightAlignedTitleTableCell'
                  }
                ]
              ]
            }
          }
        ]
      }
    ],
    styles: {
      header: {
        fontSize: 22,
        bold: true,
        margin: [10, 5, 0, 0]
      },
      footer: {
        fontSize: 8
      },
      tableHeader: {
        fillColor: '#DCE9F0',
        color: '#5494BC',
        margin: [10, 0, 0, 0],
        bold: true
      },
      tableCell: {
        color: 'black',
        margin: [10, 0, 0, 0]
      },
      rightAlignedTableCell: {
        color: 'black',
        alignment: 'right'
      },
      rightAlignedTitleTableCell: {
        color: 'black',
        alignment: 'right',
        bold: true,
        fontSize: 20
      }
    },
    images: directive.resolvedImages
  };

  return docDefinition;
}

export const itaInvoiceGenerator = {
  itaInvoice: itaInvoiceTemplate
};
