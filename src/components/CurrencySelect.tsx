import React from 'react';
import { currencies } from '../types';

interface CurrencySelectProps {
  value: string;
  customCurrency: string;
  onChange: (currency: string, customCurrency?: string) => void;
}

export function CurrencySelect({ value, customCurrency, onChange }: CurrencySelectProps) {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newValue = e.target.value;
    onChange(newValue);
  };

  const handleCustomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange('custom', e.target.value);
  };

  return (
    <div className="flex items-center space-x-2">
      <select
        value={value}
        onChange={handleChange}
        className="px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
      >
        {currencies.map((currency) => (
          <option key={currency.code} value={currency.code}>
            {currency.code} ({currency.symbol}) - {currency.name}
          </option>
        ))}
        <option value="custom">Custom Currency</option>
      </select>
      
      {value === 'custom' && (
        <input
          type="text"
          value={customCurrency}
          onChange={handleCustomChange}
          placeholder="Enter currency symbol"
          className="px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
        />
      )}
    </div>
  );
}