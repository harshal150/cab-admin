import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";

interface ActionModalProps {
  show: boolean;
  onClose: () => void;
  rowData: any; // Data related to the entry being reviewed
}

interface TimelineEntry {
  actor: string;
  timestamp: string;
  comment: string;
  attachment: string;
}

interface StageButton {
  label: string;
  action: string;
}

const ActionModal: React.FC<ActionModalProps> = ({ show, onClose, rowData }) => {
  const [comment, setComment] = useState<string>("");
  const [attachment, setAttachment] = useState<File | null>(null);

  const timelineData: TimelineEntry[] = rowData?.timeline || [
    {
      actor: "JSPM Group",
      timestamp: "09-12-2024 01:14:59",
      comment: "Form details are ok for me, please check at your end.",
      attachment: "NA",
    },
    {
      actor: "Exam User",
      timestamp: "09-12-2024 01:18:19",
      comment: "Fee Receipts is missing.",
      attachment: "NA",
    },
  ];

  const handleSubmitAction = (action: string) => {
    console.log(`Action: ${action}`);
    console.log("Added Comment:", comment);
    if (attachment) {
      console.log("Attachment:", attachment.name);
    }
    // Perform backend operations for adding a comment and taking the action
    onClose();
  };

  const stageButtons: Record<string, StageButton[]> = {
    "Fresh Requests": [
      { label: "Send for Resubmission", action: "resubmission" },
      { label: "Send to Academic", action: "academic" },
    ],
    "Sent To Student": [
      { label: "Send for Approval", action: "approval" },
      { label: "Reject Request", action: "reject" },
    ],
    "Resubmitted Requests": [
      { label: "Forward to Academic", action: "forwardAcademic" },
    ],
    "Revert By Academic": [
      { label: "Finalize and Submit", action: "finalSubmit" },
    ],
  };

  const currentStage: string = rowData?.stage || "Fresh Requests";

  return (
    <Modal show={show} onHide={onClose} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>Take Action</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {/* Add Comment Section */}
        <div className="add-comment-section">
          <h5>Add Your Review</h5>
          <Form>
            <Form.Group controlId="formComment" className="mb-3">
              <Form.Label>Enter Comment</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Add your comment here..."
              />
            </Form.Group>
            <Form.Group controlId="formAttachment" className="mb-3">
              <Form.Label>Attachment</Form.Label>
              <Form.Control
                type="file"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  const file = e.target.files ? e.target.files[0] : null;
                  setAttachment(file);
                }}
              />
            </Form.Group>
          </Form>
        </div>

        {/* Dynamic Action Buttons */}
        <div className="action-buttons mt-3 mb-4">
          {stageButtons[currentStage]?.map((button: StageButton) => (
            <Button
              key={button.action}
              variant={button.action === "reject" ? "danger" : "primary"}
              className="me-2"
              onClick={() => handleSubmitAction(button.action)}
            >
              {button.label}
            </Button>
          ))}
        </div>

        {/* Checklist Section */}
        <div className="checklist-section mt-3">
          <strong>Check the following points:</strong>
          <ul>
            <li>No dues certificate</li>
            <li>Fee Receipts</li>
            <li>Personal Application</li>
          </ul>
        </div>

        <hr />

        {/* View Previous Review Section */}
        <div className="view-review-section mt-3">
          <h5>View Previous Review</h5>
          <div className="timeline">
            {timelineData.map((item: TimelineEntry, index: number) => (
              <div key={index} className="timeline-item">
                <div className="timeline-dot" />
                <div className="timeline-content">
                  <div className="timeline-header">
                    <strong>{item.actor}</strong>
                    <span className="text-muted"> - {item.timestamp}</span>
                  </div>
                  <p>{item.comment}</p>
                  <p>
                    <strong>Attachment:</strong> {item.attachment || "NA"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Close
        </Button>
      </Modal.Footer>

      {/* Styles */}
      <style>
        {`
          .add-comment-section {
            margin-bottom: 20px;
          }
          .action-buttons {
            text-align: center;
          }
          .checklist-section {
            padding: 10px 15px;
            background-color: #f9f9f9;
            border-radius: 8px;
            border: 1px solid #ddd;
          }
          .view-review-section {
            margin-top: 20px;
          }
          .timeline {
            position: relative;
            margin: 20px 0;
          }
          .timeline-item {
            display: flex;
            margin-bottom: 20px;
          }
          .timeline-dot {
            width: 10px;
            height: 10px;
            background-color: #007bff;
            border-radius: 50%;
            margin-right: 10px;
            margin-top: 5px;
          }
          .timeline-content {
            background: #f9f9f9;
            padding: 10px 15px;
            border-radius: 8px;
            border: 1px solid #ddd;
            width: 100%;
          }
          .timeline-header {
            font-size: 14px;
            margin-bottom: 5px;
          }
          .timeline-header strong {
            font-weight: bold;
          }
          .timeline-header span {
            font-size: 12px;
            color: #666;
          }
        `}
      </style>
    </Modal>
  );
};

export default ActionModal;
