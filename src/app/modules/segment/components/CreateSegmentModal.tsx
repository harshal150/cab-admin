import React, { FC, useState } from 'react';

// Hardcoded industry options
const hardcodedIndustryOptions = [
  { value: 1, label: 'Industry A' },
  { value: 2, label: 'Industry B' },
  { value: 3, label: 'Industry C' },
  { value: 4, label: 'Industry D' },
];

interface CreateSegmentModalProps {
  show: boolean;
  handleClose: () => void;
  addSegment: (segment: { id: number; name: string; description: string; isActive: string; industry: string }) => void; // New prop to add segment
}

const CreateSegmentModal: FC<CreateSegmentModalProps> = ({ show, handleClose, addSegment }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    industry: '', // Selected industry
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newSegment = {
      id: Math.random(), // Generate a random ID (or implement your own ID generation logic)
      name: formData.name,
      description: formData.description,
      isActive: 'Y', // Assume new segments are active by default
      industry: hardcodedIndustryOptions.find(option => option.value.toString() === formData.industry)?.label || '', // Get industry label
    };
    addSegment(newSegment); // Call the function to add segment
    handleClose();
  };

  return (
    <div className={`modal fade show ${show ? 'd-block' : 'd-none'}`} tabIndex={-1}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Add Segment</h5>
            <button type="button" className="btn-close" onClick={handleClose}></button>
          </div>
          <div className="modal-body">
            <form onSubmit={handleFormSubmit}>
              <div className="mb-3">
                <label htmlFor="segmentName" className="form-label">Segment Name</label>
                <input
                  type="text"
                  className="form-control"
                  id="segmentName"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="segmentDescription" className="form-label">Description</label>
                <input
                  type="text"
                  className="form-control"
                  id="segmentDescription"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="industryType" className="form-label">Industry Type</label>
                <select
                  className="form-select"
                  id="industryType"
                  name="industry"
                  value={formData.industry}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select Industry</option>
                  {hardcodedIndustryOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              <button type="submit" className="btn btn-primary">Add Segment</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export { CreateSegmentModal };
