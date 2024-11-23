import React, { useState } from 'react';
import { Download, Eye, Computer, Linkedin } from 'lucide-react';
import Confetti from 'react-confetti';
import { jsPDF } from 'jspdf';
import { InvoiceForm } from './components/InvoiceForm';
import { InvoicePreview } from './components/InvoicePreview';
import { InvoiceData, currencies } from './types';

function App() {
  const [showConfetti, setShowConfetti] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [invoiceData, setInvoiceData] = useState<InvoiceData>({
    fromName: '',
    fromEmail: '',
    fromAddress: '',
    clientName: '',
    clientEmail: '',
    clientAddress: '',
    items: [{ name: '', quantity: 1, price: 0, amount: 0 }],
    note: '',
    date: new Date().toISOString().split('T')[0],
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    invoiceNumber: `INV-${Math.floor(Math.random() * 10000)}`,
    currency: 'USD',
    customCurrency: '',
    tax: { type: 'percent', value: 0 },
    discount: { type: 'percent', value: 0 },
    shipping: 0
  });

  const loadSampleData = () => {
    setInvoiceData({
      fromName: 'John Smith',
      fromEmail: 'john.smith@example.com',
      fromAddress: '456 Business Ave, New York, NY 10001',
      clientName: 'Sarah Johnson',
      clientEmail: 'sarah@company.com',
      clientAddress: '789 Client Street, Los Angeles, CA 90001',
      items: [
        { name: 'Web Design', quantity: 1, price: 1500, amount: 1500 },
        { name: 'Logo Design', quantity: 1, price: 500, amount: 500 },
        { name: 'Hosting (Monthly)', quantity: 12, price: 25, amount: 300 }
      ],
      note: 'Thank you for your business!',
      date: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      invoiceNumber: `INV-${Math.floor(Math.random() * 10000)}`,
      currency: 'USD',
      customCurrency: '',
      tax: { type: 'percent', value: 10 },
      discount: { type: 'percent', value: 5 },
      shipping: 25
    });
  };

  const handleInputChange = (field: keyof InvoiceData, value: any) => {
    setInvoiceData(prev => ({ ...prev, [field]: value }));
  };

  const calculateTotal = () => {
    const subtotal = invoiceData.items.reduce((sum, item) => sum + item.amount, 0);
    let total = subtotal;

    if (invoiceData.tax.type === 'percent') {
      total += subtotal * (invoiceData.tax.value / 100);
    } else {
      total += invoiceData.tax.value;
    }

    if (invoiceData.discount.type === 'percent') {
      total -= subtotal * (invoiceData.discount.value / 100);
    } else {
      total -= invoiceData.discount.value;
    }

    total += invoiceData.shipping;

    return total;
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    const total = calculateTotal();
    const currencySymbol = invoiceData.currency === 'custom' 
      ? invoiceData.customCurrency 
      : currencies.find(c => c.code === invoiceData.currency)?.symbol || '$';

    // Set font styles
    doc.setFont('helvetica');
    doc.setFontSize(24);
    doc.text('INVOICE', 105, 20, { align: 'center' });
    
    // Invoice details
    doc.setFontSize(12);
    doc.text(`Invoice #: ${invoiceData.invoiceNumber}`, 20, 40);
    doc.text(`Date: ${invoiceData.date}`, 20, 50);
    doc.text(`Due Date: ${invoiceData.dueDate}`, 20, 60);
    
    // From section
    doc.text('From:', 20, 80);
    doc.text(invoiceData.fromName, 20, 90);
    doc.text(invoiceData.fromAddress, 20, 100);
    doc.text(invoiceData.fromEmail, 20, 110);
    
    // Bill To section
    doc.text('Billed To:', 120, 80);
    doc.text(invoiceData.clientName, 120, 90);
    doc.text(invoiceData.clientAddress, 120, 100);
    doc.text(invoiceData.clientEmail, 120, 110);
    
    // Items table
    const startY = 130;
    doc.line(20, startY, 190, startY);
    doc.text('Item', 20, startY + 10);
    doc.text('Qty', 100, startY + 10);
    doc.text('Price', 130, startY + 10);
    doc.text('Amount', 160, startY + 10);
    doc.line(20, startY + 15, 190, startY + 15);
    
    let currentY = startY + 25;
    invoiceData.items.forEach(item => {
      doc.text(item.name, 20, currentY);
      doc.text(item.quantity.toString(), 100, currentY);
      doc.text(`${currencySymbol}${item.price.toFixed(2)}`, 130, currentY);
      doc.text(`${currencySymbol}${item.amount.toFixed(2)}`, 160, currentY);
      currentY += 10;
    });
    
    doc.line(20, currentY + 5, 190, currentY + 5);
    
    // Calculations
    currentY += 15;
    const subtotal = invoiceData.items.reduce((sum, item) => sum + item.amount, 0);
    doc.text(`Subtotal: ${currencySymbol}${subtotal.toFixed(2)}`, 130, currentY);
    
    currentY += 10;
    if (invoiceData.tax.value > 0) {
      const taxText = invoiceData.tax.type === 'percent' 
        ? `Tax (${invoiceData.tax.value}%): ${currencySymbol}${(subtotal * invoiceData.tax.value / 100).toFixed(2)}`
        : `Tax: ${currencySymbol}${invoiceData.tax.value.toFixed(2)}`;
      doc.text(taxText, 130, currentY);
      currentY += 10;
    }

    if (invoiceData.discount.value > 0) {
      const discountText = invoiceData.discount.type === 'percent'
        ? `Discount (${invoiceData.discount.value}%): -${currencySymbol}${(subtotal * invoiceData.discount.value / 100).toFixed(2)}`
        : `Discount: -${currencySymbol}${invoiceData.discount.value.toFixed(2)}`;
      doc.text(discountText, 130, currentY);
      currentY += 10;
    }

    if (invoiceData.shipping > 0) {
      doc.text(`Shipping: ${currencySymbol}${invoiceData.shipping.toFixed(2)}`, 130, currentY);
      currentY += 10;
    }

    doc.setFontSize(14);
    doc.text(`Total: ${currencySymbol}${total.toFixed(2)}`, 130, currentY + 10);
    
    if (invoiceData.note) {
      doc.setFontSize(12);
      doc.text('Note:', 20, currentY + 35);
      doc.text(invoiceData.note, 20, currentY + 45);
    }
    
    return doc;
  };

  const handleDownload = () => {
    const doc = generatePDF();
    doc.save(`invoice-${invoiceData.invoiceNumber}.pdf`);
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 5000);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-6 sm:py-12 px-4 sm:px-6 lg:px-8 flex flex-col">
      {showConfetti && <Confetti />}
      {showPreview && (
        <InvoicePreview
          invoiceData={invoiceData}
          onClose={() => setShowPreview(false)}
        />
      )}
      
      <div className="max-w-4xl mx-auto w-full bg-white rounded-xl shadow-lg overflow-hidden flex-1">
        <div className="px-4 sm:px-8 py-6 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-center gap-4">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Invoice Generator</h1>
          <button
            onClick={loadSampleData}
            className="w-full sm:w-auto px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Load Sample Data
          </button>
        </div>

        <InvoiceForm
          invoiceData={invoiceData}
          onInputChange={handleInputChange}
        />

        <div className="px-4 sm:px-8 py-6 bg-gray-50 flex flex-col sm:flex-row justify-end gap-4">
          <button
            onClick={() => setShowPreview(true)}
            className="w-full sm:w-auto flex items-center justify-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            <Eye className="w-5 h-5 mr-2" />
            Preview Invoice
          </button>
          <button
            onClick={handleDownload}
            className="w-full sm:w-auto flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Computer className="w-5 h-5 mr-2" />
            Download Invoice
          </button>
        </div>
      </div>

      <footer className="max-w-4xl mx-auto w-full mt-8 text-center text-gray-600">
        <p className="text-sm flex items-center justify-center gap-2">
          <Linkedin className="w-4 h-4" />
          Follow us on LinkedIn:{' '}
          <a 
            href="https://www.linkedin.com/in/ritik-bhardwaj-2293301ab/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800"
          >
            Ritik
          </a>
          {' '}&bull;{' '}
          <a 
            href="https://linkedin.com/in/arpit-jain-01/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800"
          >
            Arpit
          </a>
        </p>
      </footer>
    </div>
  );
}

export default App;