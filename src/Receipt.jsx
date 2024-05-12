import React, { useEffect, useState } from "react";
import { useParam, useSearchParams } from "react-router-dom";
import "./App.css";
import QRCode from 'qrcode.react';

const formattingString = (name) => {
  if (name.length > 30) {
    const firstLine = name.substring(0, 8);
    const remaining = name.substring(8);
    return firstLine + "-\n" + formattingString(remaining);
  } else {
    return name;
  }
};

const Receipt = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [receiptData, setReceiptData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [items, setItems] = useState(null);
  useEffect(() => {
    
    //use saga to call
    const fetchData = async () => {
      try {
      const orderId = searchParams?.get("order_id");
      console.log(orderId);
      const productId = searchParams?.get("product_id");
      console.log(productId);

      const url = `http://127.0.0.1:8000/api/v1/order_print?product_id=${productId}&order_id=${orderId}`;
      
        const response = await fetch(url, {
          method: "GET",
        });

        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const jsonData = await response.json();
        setReceiptData(jsonData);
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };
    fetchData();
  
  }, [searchParams]);

  const renderItems = () => {
    const validJSON = receiptData?.items.replace(/'/g, '"');
    const data = JSON.parse(validJSON);

    return data.map((item) => (
      <div key={item.name} className="order-item">
        <p>{formattingString(item.name)}</p>
        <p>₹{item.amount}</p>
        <p>{item.quantity}</p>
        <p>₹{item.total}</p>
      </div>
    ));
  };

  return (
    <>
      {receiptData && (
        <div className="receipt-wrapper">
          <div className="receipt-container">
            <div className="header">
              <h2>{receiptData.name}</h2>
              <p>{receiptData.address}</p>
              <p><b>FSSAI:</b> {receiptData.fssai}</p>
              <p><b>GSTIN:</b> {receiptData.gstin}</p>
            </div>
            <div className="dotted-line"></div>
            <div className="receipt-details">
              
              <div className="customer-info">
              <p><b>Date</b>:{receiptData.date}</p>
                <p><b>Time</b>: {receiptData.time}</p>
                <p><b>Bill ID</b>: {receiptData.bill_id}</p>
                <p><b>Table No</b>: {receiptData.table_no}</p>
              </div>
              <div className="dotted-line"></div>
              <div className="order-items">
                <div className="order-item">
                  <p>Product Name</p>
                  <p>Price</p>
                  <p>Qty</p>
                  <p>Total</p>
                </div>
                <div className="dotted-line"></div>               
                {renderItems()}
              </div>
              <div className="dotted-line"></div>
              <div className="total-amount">
                <p>Sub-Total: ₹{receiptData.total.toFixed(2)}</p>
                <p>SGST @ 2.50%: ₹{receiptData["sgst @ 2.50%"].toFixed(2)}</p>
                <p>CGST @ 2.50%: ₹{receiptData["cgst @ 2.50%"].toFixed(2)}</p>
                <p>Round Off: ₹{receiptData.round_off.toFixed(2)}</p>
                <p className="total">
                  Total: ₹{receiptData.total_with_tax.toFixed(2)}
                </p>
              </div>
              <div className="dotted-line"></div>
              <div className="additional-info">
                <p><b>Payment Method:</b> {receiptData.payment_method}</p>
              </div>
              <div className="qr-code">
                <img
                  src={`data:image/png;base64,${receiptData.qr_image}`}
                  alt="QR Code"
                />
              
                <p><strong>Thank you See You Again !!!!!</strong></p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Receipt;
