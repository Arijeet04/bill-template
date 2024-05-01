import React, { useState } from 'react';

const PrintButton = ({ onClick, disabled }) => (
  <button onClick={onClick} className="print-button" disabled={disabled}>
    Print
  </button>
);

const Receipt = () => {
  const [isPrinted, setIsPrinted] = useState(false);

  const receiptData = {
    restaurantName: 'MAGIC CHEF',
    address: 'S.G. Palya, Bengaluru, Karnataka-560029',
    customerName: 'Arijeet Das Chowdhury',
    invoiceNo: 3435,
    date: '17 Apr 2024',
    table: '#2',
    items: [
      { name: 'Chicken Chilli', price: 180, qty: 4 },
      { name: 'Hakka Noodles', price: 150, qty: 2 },
      { name: 'Dragon Chicken', price: 200, qty: 1 },
      { name: 'Aloo Masala', price: 120, qty: 2 },
      { name: 'Altham Chicken', price: 130, qty: 2 },
    ],
    cgst: 1.5,
    sgst: 1.5,
    mode: 'Cash',
    time: '11:11',
  };

  const calculateTotal = () => {
    const subTotal = receiptData.items.reduce(
      (acc, item) => acc + item.price * item.qty,
      0
    );
    const cgstAmount = (subTotal * receiptData.cgst) / 100;
    const sgstAmount = (subTotal * receiptData.sgst) / 100;
    const total = subTotal + cgstAmount + sgstAmount;
    return total.toFixed(2);
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    const receiptContent = document.querySelector('.receipt-container').outerHTML;

    const printDocument = `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Print Receipt</title>
          <style>
            @page {
              size: 3.5in 350px; /* Set the page size to 3.5 inches width and 350 pixels height */
              margin: 0;
            }
            body {
              font-family: Arial, sans-serif;
              margin: 0;
              padding: 0;
            }
            .receipt-container {
              width: 850px; /* Set the width of the receipt container to 850px */
              height: 350px; /* Set the height of the receipt container to 350px */
              margin: auto;
              padding: 20px;
              border: 1px solid #ccc;
            }
          </style>
        </head>
        <body>
          ${receiptContent}
        </body>
      </html>
    `;

    printWindow.document.write(printDocument);
    printWindow.document.close();
    printWindow.print();
    printWindow.close();
    setIsPrinted(true);
  };

  return (
    <div className="receipt-container">
      <div className="header">
        <h2>{receiptData.restaurantName}</h2>
        <p>{receiptData.address}</p>
      </div>
      <div className="customer-info">
        <p>Name: {receiptData.customerName}</p>
        <p>Invoice No: {receiptData.invoiceNo}</p>
        <p>Date: {receiptData.date}</p>
        <p>Table: {receiptData.table}</p>
      </div>
      <table>
        <thead>
          <tr>
            <th>Item</th>
            <th>Price</th>
            <th>Qty</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {receiptData.items.map((item, index) => (
            <tr key={index}>
              <td>{item.name}</td>
              <td>₹{item.price}</td>
              <td>{item.qty}</td>
              <td>₹{item.price * item.qty}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="totals">
        <p>Sub-Total: ₹{receiptData.items.reduce((acc, item) => acc + item.price * item.qty, 0)}</p>
        <p>CGST: {receiptData.cgst}% ₹{((receiptData.items.reduce((acc, item) => acc + item.price * item.qty, 0) * receiptData.cgst) / 100).toFixed(2)}</p>
        <p>SGST: {receiptData.sgst}% ₹{((receiptData.items.reduce((acc, item) => acc + item.price * item.qty, 0) * receiptData.sgst) / 100).toFixed(2)}</p>
      </div>
      <div className="footer">
        <p>Mode: {receiptData.mode}</p>
        <p>Total: ₹{calculateTotal()}</p>
        <p>**SAVE PAPER SAVE NATURE !!</p>
        <p>Time: {receiptData.time}</p>
      </div>
      <PrintButton onClick={handlePrint} disabled={isPrinted} />
    </div>
  );
};

export default Receipt;
