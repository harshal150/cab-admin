import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";

interface EditFormModalProps {
  show: boolean;
  onClose: () => void;
  rowData: any; // Detailed row data for the modal
}

interface FormValues {
  [section: string]: {
    [field: string]: string | number;
  };
}

const EditFormModal: React.FC<EditFormModalProps> = ({ show, onClose, rowData }) => {
  const [step, setStep] = useState<number>(1); // Step tracking
  const [formValues, setFormValues] = useState<FormValues>({
    personalDetails: {},
    documentUpload: {},
    bankDetails: {},
  });

  // Populate formValues with rowData when modal is opened
  useEffect(() => {
    if (show && rowData) {
      setFormValues({
        personalDetails: rowData.personalDetails || {},
        documentUpload: rowData.documentUpload || {},
        bankDetails: rowData.bankDetails || {},
      });
    }
  }, [show, rowData]);

  // Handle form value changes
  const handleInputChange = (section: string, field: string, value: string | number) => {
    setFormValues((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  // Render fields dynamically
  const renderFields = (section: string, fields: { [key: string]: string | number }) => {
    return Object.keys(fields || {}).map((key) => (
      <Form.Group as={Row} key={key} className="mb-3">
        <Form.Label column sm={4}>
          {key.charAt(0).toUpperCase() + key.slice(1)}
        </Form.Label>
        <Col sm={8}>
          <Form.Control
            type="text"
            value={fields[key] || ""}
            onChange={(e) => handleInputChange(section, key, e.target.value)}
          />
        </Col>
      </Form.Group>
    ));
  };

  const sections = [
    { step: 1, label: "Personal Details" },
    { step: 2, label: "Document Upload" },
    { step: 3, label: "Bank Details" },
  ];

  return (
    <Modal show={show} onHide={onClose} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>Edit Form</Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ maxHeight: "70vh", overflowY: "auto" }}>
        {/* Section Navigation */}
        <div className="d-flex justify-content-around mb-4">
          {sections.map((section) => (
            <div
              key={section.step}
              onClick={() => setStep(section.step)}
              className={`section-tab ${step === section.step ? "active" : ""}`}
              style={{
                cursor: "pointer",
                fontWeight: step === section.step ? "bold" : "normal",
                opacity: step === section.step ? 1 : 0.5,
                transition: "all 0.3s",
              }}
            >
              {section.label}
            </div>
          ))}
        </div>

        {/* Dynamic Step Content */}
        {step === 1 && (
          <>
            <h5>Personal Details</h5>
            {renderFields("personalDetails", formValues.personalDetails)}
          </>
        )}
        {step === 2 && (
          <>
            <h5>Document Upload</h5>
            {renderFields("documentUpload", formValues.documentUpload)}
          </>
        )}
        {step === 3 && (
          <>
            <h5>Bank Details</h5>
            {renderFields("bankDetails", formValues.bankDetails)}
          </>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button
          // variant="success"
          onClick={() => {
            console.log("Updated Data: ", formValues);
            onClose();
          }}
        >
          Save Changes
        </Button>
      </Modal.Footer>

      {/* Styles */}
      <style>
        {`
          .section-tab {
            padding: 10px 15px;
            border-radius: 8px;
            background-color: #f8f9fa;
            text-align: center;
          }
          .section-tab.active {
            background-color: #224466;
            color: white;
          }
          .section-tab:hover {
            background-color: #e2e6ea;
          }
        `}
      </style>
    </Modal>
  );
};

export default EditFormModal;
