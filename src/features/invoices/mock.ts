import type {InvoiceRow} from './types';

export const MOCK_INVOICES: InvoiceRow[] = Array.from({length: 15}).map((_, i) => {
  const sl = i + 1;
  const invoiceNumber =
    sl % 3 === 0 ? `5331-${5000 + sl}` : sl % 3 === 1 ? `14906-${5300 + sl}` : `8032-${7700 + sl}`;

  return {
    id: `inv_${sl}`,
    sl,
    title:
      sl % 2 === 0
        ? 'Lorem ipsum dolor sit amet'
        : 'Lorem ipsum dolor sit amet consectetur.',
    invoiceNumber,
    viewUrl: '/mock/invoice-sample.pdf',
    downloadUrl: '/mock/invoice-sample.pdf',
  };
});
