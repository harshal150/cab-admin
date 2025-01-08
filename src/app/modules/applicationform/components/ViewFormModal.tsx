import React from "react";
import { Modal, Button } from "react-bootstrap";

interface ViewFormModalProps {
  show: boolean;
  onClose: () => void;
  rowData: any; // Contains all the data to be displayed in the modal
}

const ViewFormModal: React.FC<ViewFormModalProps> = ({ show, onClose, rowData }) => {
  if (!rowData) {
    return null; // Safeguard against empty data
  }

  return (
    <Modal show={show} onHide={onClose} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>View Form</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {/* Summary Section */}
        <div className="summary-section">
          <img
            src="https://payplatter.in/images/logo.png"
            alt="Logo"
            className="summary-logo"
          />
          <p>
            <strong>From Number:</strong> {rowData.srNo || "N/A"} &nbsp;&nbsp;&nbsp;
            <strong>Date:</strong> {rowData.date || "N/A"} &nbsp;&nbsp;&nbsp;
            <strong>Transaction ID:</strong> {rowData.transactionId || "N/A"}
          </p>
        </div>

        {/* Section: Personal Details */}
        <div className="form-view-container">
          <h3>Personal Details</h3>
          <div className="fieldset-content">
            <div className="form-group">
              <label>First Name:</label>
              <span>{rowData.personalDetails?.firstName || "N/A"}</span>
            </div>
            <div className="form-group">
              <label>Last Name:</label>
              <span>{rowData.personalDetails?.lastName || "N/A"}</span>
            </div>
            <div className="form-group">
              <label>Email ID:</label>
              <span>{rowData.personalDetails?.emailId || "N/A"}</span>
            </div>
          </div>

          {/* Section: Document Upload */}
          <h3>Document Upload</h3>
          <div className="fieldset-content">
            <div className="form-group">
              <label>Fee Receipt:</label>
              <span>{rowData.documentUpload?.feeReceipt || "Not Uploaded"}</span>
            </div>
            <div className="form-group">
              <label>Application Form:</label>
              <span>{rowData.documentUpload?.applicationForm || "Not Uploaded"}</span>
            </div>
          </div>

          {/* Section: Bank Details */}
          <h3>Bank Details</h3>
          <div className="fieldset-content">
            <div className="form-group">
              <label>Bank Name:</label>
              <span>{rowData.bankDetails?.bankName || "N/A"}</span>
            </div>
            <div className="form-group">
              <label>Account Number:</label>
              <span>{rowData.bankDetails?.accountNumber || "N/A"}</span>
            </div>
            <div className="form-group">
              <label>IFSC Code:</label>
              <span>{rowData.bankDetails?.ifscCode || "N/A"}</span>
            </div>
            <div className="form-group">
              <label>Branch Address:</label>
              <span>{rowData.bankDetails?.branchAddress || "N/A"}</span>
            </div>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Close
        </Button>
      </Modal.Footer>

      {/* Inline Styles */}
      <style>
        {`
          .summary-section {
            display: flex;
            align-items: center;
            padding: 10px 20px;
            background-color: #f9f9f9;
            border: 1px solid #ddd;
            border-radius: 8px;
            margin-bottom: 20px;
          }
          .summary-logo {
            width: 40px;
            height: 40px;
            margin-right: 15px;
          }
          .form-view-container {
            max-height: 70vh;
            overflow-y: auto;
          }
          .fieldset-content {
            margin-bottom: 20px;
            padding: 10px 20px;
            border: 1px solid #ddd;
            border-radius: 8px;
            background-color: #f9f9f9;
          }
          .form-group {
            display: flex;
            justify-content: space-between;
            margin-bottom: 10px;
          }
          .form-group label {
            font-weight: bold;
            width: 40%;
          }
          .form-group span {
            width: 60%;
            text-align: left;
          }
          h3 {
            margin-top: 20px;
            font-size: 1.2em;
            color: #333;
            border-bottom: 1px solid #ddd;
            padding-bottom: 5px;
          }
        `}
      </style>
    </Modal>
  );
};

export default ViewFormModal;
