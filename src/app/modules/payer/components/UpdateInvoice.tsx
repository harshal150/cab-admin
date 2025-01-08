import React, { FC, useEffect, useState } from 'react';

interface UpdateInvoiceProps {
  show: boolean;
  handleClose: () => void;
  invoiceData: any; // You can replace `any` with the actual type if needed
  handleUpdate: (updatedInvoice: any) => void;
}

const UpdateInvoice: FC<UpdateInvoiceProps> = ({ show, handleClose, invoiceData, handleUpdate }) => {
    const [payerFlatNo, setPayerFlatNo] = useState<string>(invoiceData?.status || 'Pending');
    const [payerWing, setpayerWing] = useState<string>(invoiceData?.invoiceAmount || '0');
    const [payerName, setPayerName] = useState<string>(invoiceData?.payerName || '');

  
    // Ensure state is updated when invoiceData changes
    useEffect(() => {
        
      if (invoiceData) {
        setPayerFlatNo(invoiceData.flatNo);
        setPayerName(invoiceData.payerName);
        setpayerWing(invoiceData.wing);

        console.log("data: " ,invoiceData );
      }
    }, [invoiceData]);
  
    const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => setPayerFlatNo(e.target.value);
    const handlepayerWingChange = (e: React.ChangeEvent<HTMLInputElement>) => setpayerWing(e.target.value);
  
    const handleSubmit = () => {
      const updatedInvoice = {
        ...invoiceData,
        flatNo: payerFlatNo,
        invoiceAmount: payerWing,
      };
      handleUpdate(updatedInvoice); // Send the updated invoice data back to the parent component
      handleClose(); // Close the modal
    };
    const handlePlayerNameChange = (e: React.ChangeEvent<HTMLInputElement>) => setPayerName(e.target.value);
  
    
  
    return (
      <>
        {show && (
          <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Update Details of {payerName}</h5>
                  <button type="button" className="btn-close" aria-label="Close" onClick={handleClose}></button>
                </div>
                <div className="modal-body">
                  <div className="table-responsive">
                    <table className="table">
                      <tbody>
                      <tr>
                          <td><strong>Payer Name:</strong></td>
                          <td>
                            <input
                              type="text"
                              className="form-control"
                              value={payerName}
                              onChange={handlePlayerNameChange}
                              placeholder="Enter late fee amount"
                              min="0"
                            />
                          </td>
                        </tr>
                        <tr>
                          <td><strong>Flat No:</strong></td>
                          <td>
                            <select value={payerFlatNo} onChange={handleStatusChange} className="form-select">
                              <option value="Pending">{payerFlatNo}</option>
                              
                            </select>
                          </td>
                        </tr>
                        <tr>
                          <td><strong>Wing:</strong></td>
                          <td>
                            <select value={payerWing} onChange={handleStatusChange} className="form-select">
                              <option value="Pending">{payerWing}</option>
                              
                            </select>
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
