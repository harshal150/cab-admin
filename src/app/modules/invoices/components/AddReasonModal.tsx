import React, { FC, useState } from 'react';
import { Modal, Button } from 'react-bootstrap';

interface AddReasonModalProps {
  show: boolean;
  onClose: () => void;
  onAddReason: (reason: string) => void;
}

const AddReasonModal: FC<AddReasonModalProps> = ({ show, onClose, onAddReason }) => {
  const [newReason, setNewReason] = useState<string>('');

  const handleAddReason = () => {
    if (newReason.trim()) {
      onAddReason(newReason);
      setNewReason(''); // Reset input field
      onClose(); // Close modal
    }
  };

  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Add a New Reason</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="mb-3">
          <label className="form-label">Reason Name</label>
          <input
            type="text"
            className="form-control"
            placeholder="Enter new reason"
            value={newReason}
            onChange={(e) => setNewReason(e.target.value)}
          />
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button
          style={{
            backgroundColor: '#336699',
            border: 'none',
          }}
          onClick={handleAddReason}
        >
          Add
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AddReasonModal;
