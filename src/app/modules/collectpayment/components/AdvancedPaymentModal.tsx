import React, { FC, useState, useEffect } from 'react';

interface AdvancedPaymentModalProps {
  show: boolean;
  handleClose: () => void;
  selectedPayer: any; // Payer selected from the dropdown
  handleSave: (data: any) => void;
}

const AdvancedPaymentModal: FC<AdvancedPaymentModalProps> = ({ show, handleClose, selectedPayer, handleSave }) => {
  const [balance, setBalance] = useState<string>('0');
  const [modeOfPayment, setModeOfPayment] = useState<string>('cash');
  const [amountBeingCollected, setAmountBeingCollected] = useState<string>('0');
  const [remark, setRemark] = useState<string>('');

  useEffect(() => {
    if (selectedPayer) {
      setBalance('0'); // Reset balance when payer changes (you can fetch the balance dynamically here)
      setAmountBeingCollected('0');
    }
  }, [selectedPayer]);

  const handleSaveClick = () => {
    const paymentData = {
      payerName: selectedPayer ? selectedPayer.label : '',
      balance,
      modeOfPayment,
      amountBeingCollected,
      remark,
    };

    handleSave(paymentData);
    handleClose(); // Close the modal after saving
  };

  return (
    <>
      {show && (
        <div className="modal show d-block" tabIndex={-1} style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Advanced Payment for {selectedPayer?.label}</h5>
                <button type="button" className="btn-close" aria-label="Close" onClick={handleClose}></button>
              </div>
              <div className="modal-body">
                <div className="table-responsive">
                  <table className="table">
                    <tbody>
                      <tr>
                        <td><strong>Name:</strong></td>
                        <td>{selectedPayer?.label}</td>
                      </tr>
                      <tr>
                        <td><strong>Balance (₹):</strong></td>
                        <td>
                          <input
                            type="number"
                            className="form-control"
                            value={balance}
                            onChange={(e) => setBalance(e.target.value)}
                            placeholder="Enter balance"
                          />
                        </td>
                      </tr>
                      <tr>
                        <td><strong>Mode of Payment:</strong></td>
                        <td>
                          <select
                            className="form-select"
                            value={modeOfPayment}
                            onChange={(e) => setModeOfPayment(e.target.value)}
                          >
                            <option value="cash">Cash</option>
                            <option value="cheque">Cheque</option>
                            <option value="NKGSB">NKGSB</option>
                            <option value="ICICI">ICICI</option>
                            <option value="ICICI NEFT">ICICI NEFT</option>
                            <option value="ICICI Netbanking">ICICI Netbanking</option>
                            <option value="Other NEFT">Other NEFT</option>
                          </select>
                        </td>
                      </tr>
                      <tr>
                        <td><strong>Amount Being Collected (₹):</strong></td>
                        <td>
                          <input
                            type="number"
                            className="form-control"
                            value={amountBeingCollected}
                            onChange={(e) => setAmountBeingCollected(e.target.value)}
                            placeholder="Enter amount being collected"
                          />
                        </td>
                      </tr>
                      <tr>
                        <td><strong>Remark:</strong></td>
                        <td>
                          <textarea
                            className="form-control"
                            value={remark}
                            onChange={(e) => setRemark(e.target.value)}
                            rows={3}
                            placeholder="Enter remark"
                          />
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={handleClose}>Close</button>
                <button type="button" className="btn btn-primary" onClick={handleSaveClick}>Save Payment</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AdvancedPaymentModal;
