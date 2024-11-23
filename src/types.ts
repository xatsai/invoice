export interface InvoiceItem {
  name: string;
  quantity: number;
  price: number;
  amount: number;
}

export interface InvoiceData {
  fromName: string;
  fromEmail: string;
  fromAddress: string;
  clientName: string;
  clientEmail: string;
  clientAddress: string;
  items: InvoiceItem[];
  note: string;
  date: string;
  dueDate: string;
  invoiceNumber: string;
  currency: string;
  customCurrency: string;
  tax: {
    type: 'percent' | 'amount';
    value: number;
  };
  discount: {
    type: 'percent' | 'amount';
    value: number;
  };
  shipping: number;
}

export const currencies = [
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
  { code: 'CNY', symbol: '¥', name: 'Chinese Yuan' },
  { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
  { code: 'CAD', symbol: '$', name: 'Canadian Dollar' },
  { code: 'AUD', symbol: '$', name: 'Australian Dollar' },
  { code: 'CHF', symbol: 'Fr', name: 'Swiss Franc' },
  { code: 'HKD', symbol: '$', name: 'Hong Kong Dollar' },
];