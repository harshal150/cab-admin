import React, { FC, useEffect, useState } from 'react';

interface UpdateInvoiceProps {
  show: boolean;
  handleClose: () => void;
  invoiceData: any; // You can replace `any` with the actual type if needed
  handleUpdate: (updatedInvoice: any) => void;
}

const UpdateInvoice: FC<UpdateInvoiceProps> = ({ show, handleClose, invoiceData, handleUpdate }) => {
    const [invoiceStatus, setInvoiceStatus] = useState<string>(invoiceData?.status || 'Pending');
    const [payableAmount, setPayableAmount] = useState<string>(invoiceData?.invoiceAmount || '0');
    const [lateFeeAmount, setLateFeeAmount] = useState<string>(invoiceData?.lateFeeAmount || '0');
    const [payerName, setPayerName] = useState<string>(invoiceData?.payerName || '');

  
    // Ensure state is updated when invoiceData changes
    useEffect(() => {
        
      if (invoiceData) {
        setInvoiceStatus(invoiceData.status);
        setPayableAmount(invoiceData.invoiceAmount);
        setLateFeeAmount(invoiceData.lateFeeAmount); // Set lateFeeAmount correctly

        console.log("data: " ,invoiceData );
      }
    }, [invoiceData]);
  
    const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => setInvoiceStatus(e.target.value);
    const handlePayableAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => setPayableAmount(e.target.value);
    const handleLateFeeChange = (e: React.ChangeEvent<HTMLInputElement>) => setLateFeeAmount(e.target.value);
  
    const handleSubmit = () => {
      const updatedInvoice = {
        ...invoiceData,
        status: invoiceStatus,
        invoiceAmount: payableAmount,
        lateFeeAmount: lateFeeAmount,
      };
      handleUpdate(updatedInvoice); // Send the updated invoice data back to the parent component
      handleClose(); // Close the modal
    };
  
    return (
      <>
        {show && (
          <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Update Invoice of {payerName}</h5>
                  <button type="button" className="btn-close" aria-label="Close" onClick={handleClose}></button>
                </div>
                <div className="modal-body">
                  <div className="table-responsive">
                    <table className="table">
                      <tbody>
                        <tr>
                          <td><strong>Invoice Status:</strong></td>
                          <td>
                            <select value={invoiceStatus} onChange={handleStatusChange} className="form-select">
                              <option value="Pending">Pending</option>
                              <option value="Paid">Paid</option>
                            </select>
                          </td>
                        </tr>
                        <tr>
                          <td><strong>Payable Amount:</strong></td>
                          <td>
                            <input
                              type="number"
                              className="form-control"
                              value={payableAmount}
                              onChange={handlePayableAmountChange}
                              placeholder="Enter payable amount"
                              min="0"
                            />
                          </td>
                        </tr>
                        <tr>
                          <td><strong>Late Fee Amount:</strong></td>
                          <td>
                            <input
                              type="number"
                              className="form-control"
                              value={lateFeeAmount}
                              onChange={handleLateFeeChange}
                              placeholder="Enter late fee amount"
                              min="0"
                            />
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={handleClose}>Close</button>
                  <button type="button" className="btn btn-primary" onClick={handleSubmit}>Update Changes</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </>
    );
  };
  


export default UpdateInvoice;
