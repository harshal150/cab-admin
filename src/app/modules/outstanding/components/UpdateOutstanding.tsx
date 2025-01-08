import React, { FC, useState } from 'react';

interface UpdateOutstandingProps {
  invoice: any;
  onClose: () => void;
  onSave: (updatedInvoice: any) => void;
}

const UpdateOutstanding: FC<UpdateOutstandingProps> = ({ invoice, onClose, onSave }) => {
  const [arrear, setArrear] = useState<number>(invoice.arrear); // Set initial value from invoice
  const [interestOnArrears, setInterestOnArrears] = useState<number>(invoice.interestOnArrears);
  const [advancePayment, setAdvancePayment] = useState<number>(invoice.advancePayment);
  const [amountPaid, setAmountPaid] = useState<number>(parseFloat(invoice.amountPaid.replace('₹', '').replace(',', '')));
  const [modeOfPayment, setModeOfPayment] = useState<string>(invoice.modeOfPayment);
  const [amountBeingCollected, setAmountBeingCollected] = useState<number>(invoice.amountBeingCollected);
  const [paymentReferenceId, setPaymentReferenceId] = useState<string>(invoice.paymentReferenceId);
  const [remark, setRemark] = useState<string>(invoice.remark || '');
  const [payerName, setPayerName] = useState<string>(invoice?.payerName || '');

  const finalPayableAmount = arrear + interestOnArrears + advancePayment + amountPaid;

  const handleSave = () => {
    const updatedInvoice = {
      ...invoice,
      arrear,
      interestOnArrears,
      advancePayment,
      amountPaid,
      modeOfPayment,
      amountBeingCollected,
      paymentReferenceId,
      remark,
      finalPayableAmount, // Calculating the final amount
    };
    onSave(updatedInvoice); // Pass the updated invoice to the parent component
  };

  return (
    <div className="modal show d-block" tabIndex={-1} style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Update Outstanding of {payerName}</h5>
            <button type="button" className="btn-close" aria-label="Close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <form>
              <div className="table-responsive">
                <table className="table table-bordered">
                  <tbody>
                    <tr>
                      <td><strong>Total Amount (₹)</strong></td>
                      <td>
                        <input
                          type="text"
                          className="form-control"
                          value={invoice.invoiceAmount.replace('₹', '')}
                          disabled
                        />
                      </td>
                    </tr>
                    <tr>
                      <td><strong>Arrear (₹)</strong></td>
                      <td>
                        <input
                          type="number"
                          className="form-control"
                          value={arrear}
                          onChange={(e) => setArrear(Number(e.target.value))}
                        />
                      </td>
                    </tr>
                    <tr>
                      <td><strong>Interest on Arrears (₹)</strong></td>
                      <td>
                        <input
                          type="number"
                          className="form-control"
                          value={interestOnArrears}
                          onChange={(e) => setInterestOnArrears(Number(e.target.value))}
                        />
                      </td>
                    </tr>
                    <tr>
                      <td><strong>Advance Payment Amount (₹)</strong></td>
                      <td>
                        <input
                          type="number"
                          className="form-control"
                          value={advancePayment}
                          onChange={(e) => setAdvancePayment(Number(e.target.value))}
                        />
                      </td>
                    </tr>
                    <tr>
                      <td><strong>Amount Paid (₹)</strong></td>
                      <td>
                        <input
                          type="text"
                          className="form-control"
                          value={amountPaid}
                          disabled
                        />
                      </td>
                    </tr>
                    <tr>
                      <td><strong>Final Payable Amount (₹)</strong></td>
                      <td>
                        <input
                          type="text"
                          className="form-control"
                          value={finalPayableAmount.toFixed(2)} // Display the final payable amount with 2 decimal places
                          disabled
                        />
                      </td>
                    </tr>
                    <tr>
                      <td><strong>Mode of Payment</strong></td>
                      <td>
                        <select
                          className="form-select"
                          value={modeOfPayment}
                          onChange={(e) => setModeOfPayment(e.target.value)}
                        >
                          <option value="cash">Cash</option>
                          <option value="cheque">Cheque</option>
                          <option value="NEFT">NEFT</option>
                          <option value="RTGS">RTGS</option>
                          <option value="IMPS">IMPS</option>
                          <option value="UPI">UPI</option>
                          <option value="other">Other</option>
                        </select>
                      </td>
                    </tr>
                    <tr>
                      <td><strong>Amount Being Collected (₹)</strong></td>
                      <td>
                        <input
                          type="number"
                          className="form-control"
                          value={amountBeingCollected}
                          onChange={(e) => setAmountBeingCollected(Number(e.target.value))}
                        />
                      </td>
                    </tr>
                    <tr>
                      <td><strong>Payment Reference ID</strong></td>
                      <td>
                        <input
                          type="text"
                          className="form-control"
                          value={paymentReferenceId}
                          disabled
                        />
                      </td>
                    </tr>
                    <tr>
                      <td><strong>Remark</strong></td>
                      <td>
                        <textarea
                          className="form-control"
                          value={remark}
                          onChange={(e) => setRemark(e.target.value)}
                          rows={1}
                        />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </form>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>Close</button>
            <button type="button" className="btn btn-primary" onClick={handleSave}>Proceed</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateOutstanding;
