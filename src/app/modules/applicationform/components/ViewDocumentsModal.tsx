import React from "react";
import { Modal, Button, Table } from "react-bootstrap";

interface ViewDocumentsModalProps {
  show: boolean;
  onClose: () => void;
  documents: Array<{
    id: number;
    description: string;
    url: string;
  }>;
}

const ViewDocumentsModal: React.FC<ViewDocumentsModalProps> = ({
  show,
  onClose,
  documents,
}) => {
  return (
    <Modal show={show} onHide={onClose} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>View Documents</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {documents && documents.length > 0 ? (
          <div className="document-table-container">
            <h5>All Documents</h5>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Document Description</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {documents.map((doc, index) => (
                  <tr key={doc.id}>
                    <td>{index + 1}</td>
                    <td>{doc.description}</td>
                    <td>
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => window.open(doc.url, "_blank")}
                      >
                        View
                      </Button>
                      &nbsp;
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => console.log(`Deleting document ${doc.id}`)}
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        ) : (
          <p>No documents available for this entry.</p>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Close
        </Button>
      </Modal.Footer>

      {/* Inline Styles */}
      <style>
        {`
          .document-table-container {
            margin-top: 10px;
          }
          h5 {
            margin-bottom: 15px;
            color: #333;
          }
          .table td,
          .table th {
            vertical-align: middle;
          }
        `}
      </style>
    </Modal>
  );
};

export default ViewDocumentsModal;
