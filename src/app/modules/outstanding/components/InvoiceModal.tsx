import React, { FC, useEffect, useState } from 'react';

interface InvoiceModalProps {
  show: boolean;
  handleClose: () => void;
  invoiceData: any; // Replace with actual type if needed
}

const InvoiceModal: FC<InvoiceModalProps> = ({ show, handleClose, invoiceData }) => {
  const [invoiceDetails, setInvoiceDetails] = useState<any>(invoiceData);

  useEffect(() => {
    setInvoiceDetails(invoiceData); // Update invoice details when prop changes
  }, [invoiceData]);

  return (
    <>
      {show && (
        <div className="modal show d-block" tabIndex={-1} style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
          <div className="modal-dialog" style={{ maxWidth: '80%', width: '100%' }}>
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Invoice - {invoiceDetails?.invoiceNo}</h5>
                <button type="button" className="btn-close" aria-label="Close" onClick={handleClose}></button>
              </div>
              <div className="modal-body" style={{ fontFamily: 'Arial, sans-serif', padding: '20px' }}>
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                  <img
                    src="https://menkoff.com/assets/brand-sample.png"
                    alt="Company Logo"
                    style={{ height: '50px' }}
                  />
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ margin: 0, color: '#6B7280' }}>Date</p>
                    <p style={{ margin: 0, fontWeight: 'bold', color: '#1E293B' }}>{invoiceDetails?.dateCreated}</p>
                    <p style={{ margin: 0, color: '#6B7280' }}>Invoice #</p>
                    <p style={{ margin: 0, fontWeight: 'bold', color: '#1E293B' }}>{invoiceDetails?.invoiceNo}</p>
                  </div>
                </div>

                {/* Supplier and Customer Details */}
                <div style={{ backgroundColor: '#F1F5F9', padding: '20px', marginBottom: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div>
                      <p style={{ margin: 0, fontWeight: 'bold', color: '#1E293B' }}>Supplier Company INC</p>
                      <p style={{ margin: 0 }}>Number: 23456789</p>
                      <p style={{ margin: 0 }}>VAT: 23456789</p>
                      <p style={{ margin: 0 }}>6622 Abshire Mills</p>
                      <p style={{ margin: 0 }}>Port Orlofurt, 05820</p>
                      <p style={{ margin: 0 }}>United States</p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <p style={{ margin: 0, fontWeight: 'bold', color: '#1E293B' }}>Customer Company</p>
                      <p style={{ margin: 0 }}>Number: 123456789</p>
                      <p style={{ margin: 0 }}>VAT: 23456789</p>
                      <p style={{ margin: 0 }}>9552 Vandervort Spurs</p>
                      <p style={{ margin: 0 }}>Paradise, 43325</p>
                      <p style={{ margin: 0 }}>United States</p>
                    </div>
                  </div>
                </div>

                {/* Items Table */}
                <div style={{ marginBottom: '20px' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr>
                        <th style={{ borderBottom: '2px solid #1E293B', padding: '10px', textAlign: 'left' }}>#</th>
                        <th style={{ borderBottom: '2px solid #1E293B', padding: '10px', textAlign: 'left' }}>
                          Product Details
                        </th>
                        <th style={{ borderBottom: '2px solid #1E293B', padding: '10px', textAlign: 'right' }}>Price</th>
                        <th style={{ borderBottom: '2px solid #1E293B', padding: '10px', textAlign: 'center' }}>Qty.</th>
                        <th style={{ borderBottom: '2px solid #1E293B', padding: '10px', textAlign: 'center' }}>VAT</th>
                        <th style={{ borderBottom: '2px solid #1E293B', padding: '10px', textAlign: 'right' }}>
                          Subtotal
                        </th>
                        <th style={{ borderBottom: '2px solid #1E293B', padding: '10px', textAlign: 'right' }}>
                          Subtotal + VAT
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td style={{ padding: '10px' }}>1</td>
                        <td style={{ padding: '10px' }}>Monthly Accounting Services</td>
                        <td style={{ padding: '10px', textAlign: 'right' }}>$150.00</td>
                        <td style={{ padding: '10px', textAlign: 'center' }}>1</td>
                        <td style={{ padding: '10px', textAlign: 'center' }}>20%</td>
                        <td style={{ padding: '10px', textAlign: 'right' }}>$150.00</td>
                        <td style={{ padding: '10px', textAlign: 'right' }}>$180.00</td>
                      </tr>
                      {/* Additional Rows */}
                    </tbody>
                  </table>
                </div>

                {/* Summary Section */}
                <div style={{ textAlign: 'right', marginBottom: '20px' }}>
                  <div style={{ marginBottom: '10px', display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#6B7280' }}>Net Total:</span>
                    <span style={{ fontWeight: 'bold', color: '#1E293B' }}>$320.00</span>
                  </div>
                  <div style={{ marginBottom: '10px', display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#6B7280' }}>VAT Total:</span>
                    <span style={{ fontWeight: 'bold', color: '#1E293B' }}>$64.00</span>
                  </div>
                  <div style={{ backgroundColor: '#1E293B', padding: '10px', color: '#FFFFFF', fontWeight: 'bold' }}>
                    <span>Total:</span>
                    <span style={{ float: 'right' }}>$384.00</span>
                  </div>
                </div>

                {/* Notes */}
                <div style={{ marginBottom: '20px' }}>
                  <p style={{ fontWeight: 'bold', color: '#1E293B' }}>Notes</p>
                  <p style={{ fontStyle: 'italic' }}>
                    Lorem ipsum is placeholder text commonly used in the graphic, print, and publishing industries for
                    previewing layouts and visual mockups.
                  </p>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={handleClose}>
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default InvoiceModal;
