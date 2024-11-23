import React from 'react';
import { InvoiceData } from '../types';

interface AdditionalFieldsProps {
  data: Pick<InvoiceData, 'tax' | 'discount' | 'shipping'>;
  onChange: (field: keyof Pick<InvoiceData, 'tax' | 'discount' | 'shipping'>, value: any) => void;
}

export function AdditionalFields({ data, onChange }: AdditionalFieldsProps) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Tax</label>
          <div className="flex space-x-2">
            <select
              value={data.tax.type}
              onChange={(e) => onChange('tax', { ...data.tax, type: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="percent">Percentage</option>
              <option value="amount">Amount</option>
            </select>
            <input
              type="number"
              value={data.tax.value}
              onChange={(e) => onChange('tax', { ...data.tax, value: parseFloat(e.target.value) })}
              className="w-24 px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              placeholder={data.tax.type === 'percent' ? '% value' : 'Amount'}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Discount</label>
          <div className="flex space-x-2">
            <select
              value={data.discount.type}
              onChange={(e) => onChange('discount', { ...data.discount, type: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="percent">Percentage</option>
              <option value="amount">Amount</option>
            </select>
            <input
              type="number"
              value={data.discount.value}
              onChange={(e) => onChange('discount', { ...data.discount, value: parseFloat(e.target.value) })}
              className="w-24 px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              placeholder={data.discount.type === 'percent' ? '% value' : 'Amount'}
            />
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Shipping</label>
        <input
          type="number"
          value={data.shipping}
          onChange={(e) => onChange('shipping', parseFloat(e.target.value))}
          className="w-24 px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
          placeholder="Amount"
        />
      </div>
    </div>
  );
}