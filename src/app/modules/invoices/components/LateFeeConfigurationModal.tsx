import React, { FC, useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

interface LateFeeModalProps {
  show: boolean;
  onHide: () => void;
  onSave: (lateFeeConfig: any) => void; // Function to pass back configuration data
}

const LateFeeConfigurationModal: FC<LateFeeModalProps> = ({ show, onHide, onSave }) => {
  const [lateFeeLabel, setLateFeeLabel] = useState('');
  const [gracePeriod, setGracePeriod] = useState('');
  const [lateFeeType, setLateFeeType] = useState('');
  const [additionalField, setAdditionalField] = useState<any>(null); // To dynamically render extra fields

  // Handle Late Fee Type change and dynamically render relevant fields
  const handleLateFeeTypeChange = (value: string) => {
    setLateFeeType(value);
    switch (value) {
      case 'Fixed':
      case 'Cumulative By Day':
      case 'Cumulative By Month':
        setAdditionalField(
          <div className="mb-3">
            <label className="form-label">Specify Amount</label>
            <div className="input-group">
              <span className="input-group-text">₹</span>
              <input type="number" className="form-control" placeholder="Enter amount" />
            </div>
          </div>
        );
        break;
      case 'Simple Interest Rate (Percentage)':
        setAdditionalField(
          <>
            <div className="mb-3">
              <label className="form-label">Interest Rate Frequency</label>
              <select className="form-select">
                <option value="Daily">Daily</option>
                <option value="Monthly">Monthly</option>
                <option value="Quarterly">Quarterly</option>
                <option value="Halfyearly">Half-Yearly</option>
                <option value="Yearly">Yearly</option>
              </select>
            </div>
            <div className="mb-3">
              <label className="form-label">Specify Percentage</label>
              <div className="input-group">
                <input
                  type="number"
                  className="form-control"
                  placeholder="Enter percentage"
                />
                <span className="input-group-text">%</span>
              </div>
            </div>
          </>
        );
        break;
      case 'Others':
        setAdditionalField(
          <div className="mb-3">
            <label className="form-label">Specify Your Late Fee Scheme</label>
            <textarea className="form-control" rows={3} placeholder="Enter scheme details"></textarea>
          </div>
        );
        break;
      default:
        setAdditionalField(null);
        break;
    }
  };

  // Handle form submission
  const handleSave = () => {
    const lateFeeConfig = {
      lateFeeLabel,
      gracePeriod,
      lateFeeType,
      // Additional fields data could be collected dynamically if needed
    };
    onSave(lateFeeConfig);
    onHide(); // Close the modal
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Late Fee Configuration</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <h6 className="text-muted">⚙️ Configure Setup:</h6>
        <form>
          {/* Late Fee Label */}
          <div className="mb-3">
            <label className="form-label">Late Fee Label</label>
            <input
              type="text"
              className="form-control"
              value={lateFeeLabel}
              onChange={(e) => setLateFeeLabel(e.target.value)}
              placeholder="Enter label"
            />
          </div>

          {/* Grace Period */}
          <div className="mb-3">
            <label className="form-label">Grace Period (Days)</label>
            <input
              type="number"
              className="form-control"
              value={gracePeriod}
              onChange={(e) => setGracePeriod(e.target.value)}
              placeholder="Enter days"
            />
          </div>

          {/* Late Fee Type */}
          <div className="mb-3">
            <label className="form-label">Late Fee Type</label>
            <select
              className="form-select"
              value={lateFeeType}
              onChange={(e) => handleLateFeeTypeChange(e.target.value)}
            >
              <option value="" disabled>
                Select Late Fee Type
              </option>
              <option value="Fixed">Fixed</option>
              <option value="Cumulative By Day">Cumulative By Day</option>
              <option value="Cumulative By Month">Cumulative By Month</option>
              <option value="Simple Interest Rate (Percentage)">
                Simple Interest Rate (Percentage)
              </option>
              <option value="Others">Others</option>
            </select>
          </div>

          {/* Dynamically Rendered Fields */}
          {additionalField}
        </form>
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="secondary"
          onClick={onHide}
        >
          Cancel
        </Button>
        <Button
          style={{ backgroundColor: '#336699', border: 'none' }}
          onClick={handleSave}
        >
          Save
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default LateFeeConfigurationModal;
