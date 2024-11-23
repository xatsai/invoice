import React from 'react';
import { InvoiceData, currencies } from '../types';

interface InvoicePreviewProps {
  invoiceData: InvoiceData;
  onClose: () => void;
}

export function InvoicePreview({ invoiceData, onClose }: InvoicePreviewProps) {
  const getCurrencySymbol = () => {
    if (invoiceData.currency === 'custom') {
      return invoiceData.customCurrency;
    }
    return currencies.find(c => c.code === invoiceData.currency)?.symbol || '$';
  };

  const currencySymbol = getCurrencySymbol();

  const calculateSubtotal = () => {
    return invoiceData.items.reduce((sum, item) => sum + item.amount, 0);
  };

  const calculateTax = (subtotal: number) => {
    if (invoiceData.tax.type === 'percent') {
      return subtotal * (invoiceData.tax.value / 100);
    }
    return invoiceData.tax.value;
  };

  const calculateDiscount = (subtotal: number) => {
    if (invoiceData.discount.type === 'percent') {
      return subtotal * (invoiceData.discount.value / 100);
    }
    return invoiceData.discount.value;
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const tax = calculateTax(subtotal);
    const discount = calculateDiscount(subtotal);
    return subtotal + tax - discount + invoiceData.shipping;
  };

  const subtotal = calculateSubtotal();
  const tax = calculateTax(subtotal);
  const discount = calculateDiscount(subtotal);
  const total = calculateTotal();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-8">
          <div className="flex justify-between items-start mb-8">
            <h1 className="text-4xl font-bold">INVOICE</h1>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>

          <div className="flex justify-between mb-8">
            <div>
              <p className="text-gray-600">Date:</p>
              <p className="font-medium">{invoiceData.date}</p>
              <p className="text-gray-600 mt-2">Due Date:</p>
              <p className="font-medium">{invoiceData.dueDate}</p>
              <p className="text-gray-600 mt-2">Invoice #:</p>
              <p className="font-medium">{invoiceData.invoiceNumber}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 mb-8">
            <div>
              <h2 className="text-gray-600 mb-2">From:</h2>
              <p className="font-medium">{invoiceData.fromName}</p>
              <p>{invoiceData.fromAddress}</p>
              <p>{invoiceData.fromEmail}</p>
            </div>
            <div>
              <h2 className="text-gray-600 mb-2">Billed To:</h2>
              <p className="font-medium">{invoiceData.clientName}</p>
              <p>{invoiceData.clientAddress}</p>
              <p>{invoiceData.clientEmail}</p>
            </div>
          </div>

          <table className="w-full mb-8">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-4 py-2 text-left">Item</th>
                <th className="px-4 py-2 text-left">Quantity</th>
                <th className="px-4 py-2 text-left">Price</th>
                <th className="px-4 py-2 text-right">Amount</th>
              </tr>
            </thead>
            <tbody>
              {invoiceData.items.map((item, index) => (
                <tr key={index} className="border-b">
                  <td className="px-4 py-2">{item.name}</td>
                  <td className="px-4 py-2">{item.quantity}</td>
                  <td className="px-4 py-2">{currencySymbol}{item.price.toFixed(2)}</td>
                  <td className="px-4 py-2 text-right">{currencySymbol}{item.amount.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="w-1/2 ml-auto">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>{currencySymbol}{subtotal.toFixed(2)}</span>
              </div>

              {invoiceData.tax.value > 0 && (
                <div className="flex justify-between text-gray-600">
                  <span>
                    Tax {invoiceData.tax.type === 'percent' ? `(${invoiceData.tax.value}%)` : ''}:
                  </span>
                  <span>+{currencySymbol}{tax.toFixed(2)}</span>
                </div>
              )}

              {invoiceData.discount.value > 0 && (
                <div className="flex justify-between text-gray-600">
                  <span>
                    Discount {invoiceData.discount.type === 'percent' ? `(${invoiceData.discount.value}%)` : ''}:
                  </span>
                  <span>-{currencySymbol}{discount.toFixed(2)}</span>
                </div>
              )}

              {invoiceData.shipping > 0 && (
                <div className="flex justify-between text-gray-600">
                  <span>Shipping:</span>
                  <span>+{currencySymbol}{invoiceData.shipping.toFixed(2)}</span>
                </div>
              )}

              <div className="flex justify-between font-bold text-lg pt-2 border-t">
                <span>Total:</span>
                <span>{currencySymbol}{total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {invoiceData.note && (
            <div className="mt-8">
              <h2 className="text-gray-600 mb-2">Note:</h2>
              <p>{invoiceData.note}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}