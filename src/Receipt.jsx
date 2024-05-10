import React, { useEffect, useState } from "react";
import { useParam, useSearchParams } from "react-router-dom";
import "./App.css";

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
    const orderId = searchParams?.get("order_id");
    const productId = searchParams?.get("product_id");

    const url = `http://127.0.0.1:8000/api/v1/order_print?product_id=${productId}&order_id=${orderId}`;
    //use saga to call
    const fetchData = async () => {
      try {
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
  }, []);

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
              <p>FSSAI: {receiptData.fssai}</p>
              <p>GSTIN: {receiptData.gstin}</p>
            </div>
            <div className="dotted-line"></div>
            <div className="receipt-details">
              <h3>RECEIPT</h3>
              <div className="customer-info">
                <p>Date: {receiptData.date}</p>
                <p>Time: {receiptData.time}</p>
                <p>Bill ID: {receiptData.bill_id}</p>
                <p>Table No: {receiptData.table_no}</p>
              </div>
              <div className="dotted-line"></div>
              <div className="order-items">
                <div className="order-item">
                  <p>Item</p>
                  <p>Price</p>
                  <p>Qty</p>
                  <p>Total</p>
                </div>
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
              <div className="additional-info">
                <p>Payment Method: {receiptData.payment_method}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Receipt;
