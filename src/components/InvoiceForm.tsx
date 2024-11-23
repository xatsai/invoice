import React from 'react';
import { InvoiceData, currencies } from '../types';
import { CurrencySelect } from './CurrencySelect';
import { AdditionalFields } from './AdditionalFields';

interface InvoiceFormProps {
  invoiceData: InvoiceData;
  onInputChange: (field: keyof InvoiceData, value: any) => void;
}

export function InvoiceForm({
  invoiceData,
  onInputChange
}: InvoiceFormProps) {
  const handleCurrencyChange = (currency: string, customCurrency?: string) => {
    onInputChange('currency', currency);
    if (customCurrency) {
      onInputChange('customCurrency', customCurrency);
    }
  };

  const getCurrencySymbol = () => {
    if (invoiceData.currency === 'custom') {
      return invoiceData.customCurrency;
    }
    return currencies.find(c => c.code === invoiceData.currency)?.symbol || '$';
  };

  return (
    <div className="px-4 sm:px-8 py-6 space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="space-y-6">
          <h3 className="text-lg font-semibold">From:</h3>
          {['fromName', 'fromEmail', 'fromAddress'].map((field) => (
            <div key={field}>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {field.replace('from', '').replace(/([A-Z])/g, ' $1').trim()}
              </label>
              <input
                type="text"
                value={invoiceData[field as keyof InvoiceData]}
                onChange={(e) => onInputChange(field as keyof InvoiceData, e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          ))}
        </div>
        
        <div className="space-y-6">
          <h3 className="text-lg font-semibold">Billed To:</h3>
          {['clientName', 'clientEmail', 'clientAddress'].map((field) => (
            <div key={field}>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {field.replace('client', '').replace(/([A-Z])/g, ' $1').trim()}
              </label>
              <input
                type="text"
                value={invoiceData[field as keyof InvoiceData]}
                onChange={(e) => onInputChange(field as keyof InvoiceData, e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
          <input
            type="date"
            value={invoiceData.date}
            onChange={(e) => onInputChange('date', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
          <input
            type="date"
            value={invoiceData.dueDate}
            onChange={(e) => onInputChange('dueDate', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
        <CurrencySelect
          value={invoiceData.currency}
          customCurrency={invoiceData.customCurrency}
          onChange={handleCurrencyChange}
        />
      </div>

      <div className="mt-8 overflow-x-auto">
        <h3 className="text-lg font-semibold mb-4">Items:</h3>
        <table className="w-full min-w-[600px]">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-4 py-2 text-left">Item</th>
              <th className="px-4 py-2 text-left">Quantity</th>
              <th className="px-4 py-2 text-left">Price</th>
              <th className="px-4 py-2 text-left">Amount</th>
              <th className="px-4 py-2"></th>
            </tr>
          </thead>
          <tbody>
            {invoiceData.items.map((item, index) => (
              <tr key={index}>
                <td className="px-4 py-2">
                  <input
                    type="text"
                    value={item.name}
                    onChange={(e) => {
                      const newItems = [...invoiceData.items];
                      newItems[index].name = e.target.value;
                      onInputChange('items', newItems);
                    }}
                    className="w-full px-2 py-1 border border-gray-300 rounded"
                  />
                </td>
                <td className="px-4 py-2">
                  <input
                    type="number"
                    value={item.quantity}
                    onChange={(e) => {
                      const newItems = [...invoiceData.items];
                      newItems[index].quantity = parseInt(e.target.value);
                      newItems[index].amount = newItems[index].quantity * newItems[index].price;
                      onInputChange('items', newItems);
                    }}
                    className="w-20 px-2 py-1 border border-gray-300 rounded"
                  />
                </td>
                <td className="px-4 py-2">
                  <div className="flex items-center">
                    <span className="mr-1">{getCurrencySymbol()}</span>
                    <input
                      type="number"
                      value={item.price}
                      onChange={(e) => {
                        const newItems = [...invoiceData.items];
                        newItems[index].price = parseFloat(e.target.value);
                        newItems[index].amount = newItems[index].quantity * newItems[index].price;
                        onInputChange('items', newItems);
                      }}
                      className="w-24 px-2 py-1 border border-gray-300 rounded"
                    />
                  </div>
                </td>
                <td className="px-4 py-2">{getCurrencySymbol()}{item.amount.toFixed(2)}</td>
                <td className="px-4 py-2">
                  <button
                    onClick={() => {
                      const newItems = invoiceData.items.filter((_, i) => i !== index);
                      onInputChange('items', newItems);
                    }}
                    className="text-red-600 hover:text-red-800"
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <button
          onClick={() => {
            const newItems = [...invoiceData.items, { name: '', quantity: 1, price: 0, amount: 0 }];
            onInputChange('items', newItems);
          }}
          className="mt-4 px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
        >
          Add Item
        </button>
      </div>

      <div className="mt-6">
        <AdditionalFields
          data={{
            tax: invoiceData.tax,
            discount: invoiceData.discount,
            shipping: invoiceData.shipping
          }}
          onChange={onInputChange}
        />
      </div>

      <div className="mt-6">
        <label className="block text-sm font-medium text-gray-700 mb-1">Note</label>
        <input
          type="text"
          value={invoiceData.note}
          onChange={(e) => onInputChange('note', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
          placeholder="Add a note (optional)"
        />
      </div>
    </div>
  );
}