import React, { FC, useEffect, useState } from 'react';
import { KTSVG } from '../../../../_metronic/helpers';
import { Col, Row } from 'react-bootstrap';

interface InvoiceModalProps {
  show: boolean;
  handleClose: () => void;
  invoiceData: any; // Replace with actual type if needed
}

const InvoiceModal: FC<InvoiceModalProps> = ({ show, handleClose, invoiceData }) => {
  // Default state
  const [invoiceDetails, setInvoiceDetails] = useState<any>(invoiceData);

  useEffect(() => {
    setInvoiceDetails(invoiceData); // Set the data when invoiceData changes
  }, [invoiceData]);

  return (
    <>
      {show && (
        <div className="modal show d-block" tabIndex={-1} style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
          <div className="modal-dialog" style={{ maxWidth: '40%', width: '100%' }}>
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Invoice - {invoiceDetails?.invoiceNo}</h5>
                <button type="button" className="btn-close" aria-label="Close" onClick={handleClose}></button>
              </div>
              <div className="modal-body">
                <div className="receipt-main" style={{ backgroundColor: '#ffffff', padding: '20px' }}>
                  {/* Invoice Header */}
                  <Row>
  <Col xs={6} className="d-flex align-items-center">
    <div id="logo">
      <img
        src="https://payplatter.in/images/logo.png" // Replace with actual image source
        alt="Logo"
        style={{ height: '50px' }}
      />
    </div>
  </Col>
  <Col xs={6} className="text-right d-flex justify-content-end align-items-center">
    <div>
      <h5>PayPlatter Club</h5>
      <p>9898989898</p>
      <p>
        <a href="mailto:housing@gmail.com">housing@gmail.com</a>
      </p>
      <p>Hinjewadi, Pune, 411057, India</p>
    </div>
  </Col>
</Row>

                  <hr />
                  {/* Invoice Details */}
                  <div className="row">
                    <div className="col-xs-6">
                      <div>
                        <p><strong>Invoice No:</strong> {invoiceDetails?.invoiceNo}</p>
                        <p><strong>Generated Date:</strong> {invoiceDetails?.dateCreated}</p>
                      </div>
                    </div>
                    <div className="col-xs-6 text-right">
                      <h1>INVOICE</h1>
                    </div>
                  </div>
                  <hr />
                  {/* Invoice Items */}
                  <div>
                    <table className="table table-bordered"  width="100%">
                      <thead>
                        <tr>
                          <th>DESCRIPTION</th>
                          <th>MERCHANT</th>
                          <th>LATE FEE TYPE</th>
                          <th>DUE DATE</th>
                          <th>TOTAL</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>{invoiceDetails?.paymentType}</td>
                          <td>PayPlatter Club</td>
                          <td>Not Applicable</td>
                          <td>{invoiceDetails?.dueDate}</td>
                          <td className="text-danger">
                            <strong>{invoiceDetails?.invoiceAmount}</strong>
                          </td>
                        </tr>
                      </tbody>
                      <tfoot>
                        <tr>
                          <td colSpan={4} className="text-right"><strong>SUBTOTAL</strong></td>
                          <td>{invoiceDetails?.invoiceAmount}</td>
                        </tr>
                        <tr>
                          <td colSpan={4} className="text-right"><strong>IGST 0.0%</strong></td>
                          <td>0.0</td>
                        </tr>
                        <tr>
                          <td colSpan={4} className="text-right"><h2><strong>GRAND TOTAL:</strong></h2></td>
                          <td className="text-danger"><h2><strong>{invoiceDetails?.invoiceAmount}</strong></h2></td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                  <hr />
                  {/* Footer */}
                  <footer>
                    Invoice created on a computer, valid without the signature and seal.
                  </footer>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={handleClose}>Close</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default InvoiceModal;
