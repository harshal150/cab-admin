import React, { FC, useEffect, useState } from 'react';
import axios from 'axios';
import { BACKEND_DOMAIN } from '../../../../apiEndpoints';
interface Car {
  id: number;
  name: string;
  rate_per_km: number;
  fixed_charges: number;
  status: string;
}

const CabsList: FC = () => {
  const [cabs, setCabs] = useState<Car[]>([]);
  const [filteredCabs, setFilteredCabs] = useState<Car[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [refresh, setRefresh] = useState(false);
  const [newCab, setNewCab] = useState<Omit<Car, 'id'>>({
    name: '',
    rate_per_km: 0,
    fixed_charges: 0,
    status: 'available',
  });
  const [currentCab, setCurrentCab] = useState<Car | null>(null);

  // Fetch data from API

// Fetch data from API
useEffect(() => {
  const fetchCabs = async () => {
    try {
      const response = await axios.get(`${BACKEND_DOMAIN}/api/cars`);
      
      // Map response data to match expected keys
      const transformedCabs = response.data.map((cab: any) => ({
        id: cab.car_id, // Map `car_id` to `id`
        name: cab.car_name, // Map `car_name` to `name`
        rate_per_km: parseFloat(cab.rate_per_km), // Convert to number
        fixed_charges: parseFloat(cab.fixed_charges), // Convert to number
        status: cab.status,
      }));
      
      setCabs(transformedCabs);
      setFilteredCabs(transformedCabs);
    } catch (error) {
      console.error('Error fetching car data:', error);
    }
  };

  fetchCabs();
}, [refresh]); // Re-fetch data whenever `refresh` changes



  // Filter functionality
  const filterCabs = (search: string, status: string) => {
    let filtered = cabs;
  
    if (search) {
      filtered = filtered.filter((cab) =>
        cab.name.toLowerCase().includes(search.toLowerCase())
      );
    }
  
    if (status !== 'all') {
      filtered = filtered.filter((cab) => cab.status === status);
    }
  
    setFilteredCabs(filtered);
  };
  
  

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    filterCabs(query, statusFilter);
  };

  const handleStatusFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const filter = e.target.value;
    setStatusFilter(filter);
    filterCabs(searchQuery, filter);
  };

  const handlePageChange = (pageNumber: number) => setCurrentPage(pageNumber);

  const handleItemsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  // Add new cab
  const handleAddNewCab = async () => {
    try {
      await axios.post(`${BACKEND_DOMAIN}/api/cars`, newCab);
  
      // Trigger refresh
      setRefresh((prev) => !prev);
  
      setShowAddModal(false);
      setNewCab({
        name: '',
        rate_per_km: 0,
        fixed_charges: 0,
        status: 'available',
      });
    } catch (error) {
      console.error('Error adding new cab:', error);
    }
  };
  
  
  

  // Open Edit Modal with pre-filled data
  const handleEditClick = (cab: Car) => {
    setCurrentCab(cab);
    setShowEditModal(true);
  };

  // Update cab details
  const handleUpdateCab = async () => {
    if (!currentCab) return;
  
    try {
      await axios.put(`${BACKEND_DOMAIN}/api/cars/${currentCab.id}`, currentCab);
  
      // Trigger refresh
      setRefresh((prev) => !prev);
  
      setShowEditModal(false);
      setCurrentCab(null);
    } catch (error) {
      console.error('Error updating cab:', error);
    }
  };
  
  const handleDeleteCar = async (id: number) => {
    try {
      await axios.delete(`${BACKEND_DOMAIN}/api/cars/${id}`);
  
      // Trigger refresh
      setRefresh((prev) => !prev);
    } catch (error) {
      console.error('Error deleting car:', error);
    }
  };
  
  

  const totalPages = Math.ceil(filteredCabs.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredCabs.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div className="app-main flex-column flex-row-fluid" style={{ marginTop: '-26px', marginBottom: '-26px' }}>
      <div className="d-flex flex-column flex-column-fluid py-2">
        <div className="card card-flush">
          <div className="card-header align-items-center py-3 gap-2 gap-md-12">
            <h3 className="card-title">Cabs List</h3>
            <button
              className="btn btn-primary"
              onClick={() => setShowAddModal(true)}
              style={{ marginLeft: 'auto' }}
            >
              Add New Cab
            </button>
          </div>
          <div className="card-header align-items-center gap-2 flex-wrap">
            <div className="d-flex align-items-center flex-grow-1 flex-shrink-0">
              <div className="w-240px">
                <select
                  className="form-select form-select-solid"
                  value={statusFilter}
                  onChange={handleStatusFilterChange}
                >
                  <option value="all">All Status</option>
                  <option value="available">Available</option>
                  <option value="not available">Not Available</option>
                </select>
              </div>
              <div className="position-relative ms-3">
                <input
                  type="text"
                  className="form-control form-control-solid w-[150px] ps-4"
                  placeholder="Search by Cab Name"
                  value={searchQuery}
                  onChange={handleSearchChange}
                />
              </div>
            </div>
          </div>
          <div className="card-body pt-0">
            <div className="table-responsive">
              <table className="table table-row-dashed table-row-gray-300 align-middle gs-0 gy-4">
                <thead>
                  <tr>
                    <th className="min-w-50px ps-4 rounded-start text-dark fw-bold">Sr. No.</th>
                    <th className="min-w-200px text-dark fw-bold">Cab Name</th>
                    <th className="min-w-100px text-dark fw-bold">Rate per Km</th>
                    <th className="min-w-100px text-dark fw-bold">Fixed Charges</th>
                    <th className="min-w-100px text-dark fw-bold">Status</th>
                    <th className="text-right rounded-end text-dark fw-bold">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {currentItems.map((cab) => (
                    <tr key={cab.id} className="fs-7">
                      <td className="ps-4">
                        <span className="text-dark fw-bold text-hover-primary">{cab.id}</span>
                      </td>
                      <td>
                        <span className="text-dark fw-bold text-hover-primary">{cab.name}</span>
                      </td>
                      <td>
                        <span className="text-dark fw-bold text-hover-primary">{cab.rate_per_km}</span>
                      </td>
                      <td>
                        <span className="text-dark fw-bold text-hover-primary">{cab.fixed_charges}</span>
                      </td>
                      <td>
                        <span
                          className={`badge ${
                            cab.status === 'available' ? 'badge-success' : 'badge-warning'
                          }`}
                        >
                          {cab.status}
                        </span>
                      </td>
                      <td>
  <button
    className="btn btn-light-primary btn-sm me-2"
    onClick={() => handleEditClick(cab)}
  >
    Edit
  </button>
  {/* <button
    className="btn btn-light-danger btn-sm"
    onClick={() => handleDeleteCar(cab.id)}
    title="Delete"
  >
    <i className="bi bi-trash"></i>
  </button> */}
</td>


                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="d-flex justify-content-between align-items-center mt-3">
                <div className="d-flex align-items-center">
                  <label className="me-2 mb-0">Items per page:</label>
                  <select
                    value={itemsPerPage}
                    onChange={handleItemsPerPageChange}
                    className="form-select form-select-sm"
                  >
                    <option value={10}>10</option>
                    <option value={25}>25</option>
                    <option value={50}>50</option>
                  </select>
                </div>
                <div>
                  {Array.from({ length: totalPages }, (_, i) => (
                    <button
                      key={i}
                      onClick={() => handlePageChange(i + 1)}
                      className={`btn btn-sm ${
                        i + 1 === currentPage ? 'btn-primary' : 'btn-light'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Cab Modal */}
      {showAddModal && (
  <div className="modal show d-block" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
    <div className="modal-dialog">
      <div className="modal-content">
        <div className="modal-header">
          <h5>Add New Cab</h5>
          <button className="btn-close" onClick={() => setShowAddModal(false)}></button>
        </div>
        <div className="modal-body">
          <div className="mb-3">
            <label htmlFor="cabName" className="form-label">
              Cab Name
            </label>
            <input
              id="cabName"
              type="text"
              className="form-control"
              placeholder="Enter Cab Name"
              value={newCab.name}
              onChange={(e) => setNewCab({ ...newCab, name: e.target.value })}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="ratePerKm" className="form-label">
              Rate per Km
            </label>
            <input
              id="ratePerKm"
              type="number"
              className="form-control"
              placeholder="Enter Rate per Km"
              value={newCab.rate_per_km}
              onChange={(e) =>
                setNewCab({ ...newCab, rate_per_km: parseFloat(e.target.value) })
              }
            />
          </div>
          <div className="mb-3">
            <label htmlFor="fixedCharges" className="form-label">
              Fixed Charges
            </label>
            <input
              id="fixedCharges"
              type="number"
              className="form-control"
              placeholder="Enter Fixed Charges"
              value={newCab.fixed_charges}
              onChange={(e) =>
                setNewCab({ ...newCab, fixed_charges: parseFloat(e.target.value) })
              }
            />
          </div>
          <div className="mb-3">
            <label htmlFor="status" className="form-label">
              Status
            </label>
            <select
              id="status"
              className="form-select"
              value={newCab.status}
              onChange={(e) => setNewCab({ ...newCab, status: e.target.value })}
            >
              <option value="available">Available</option>
              <option value="not available">Not Available</option>
            </select>
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={() => setShowAddModal(false)}>
            Cancel
          </button>
          <button className="btn btn-primary" onClick={handleAddNewCab}>
            Add Cab
          </button>
        </div>
      </div>
    </div>
  </div>
)}


      {/* Edit Cab Modal */}
      {showEditModal && currentCab && (
  <div className="modal show d-block" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
    <div className="modal-dialog">
      <div className="modal-content">
        <div className="modal-header">
          <h5>Edit Cab</h5>
          <button className="btn-close" onClick={() => setShowEditModal(false)}></button>
        </div>
        <div className="modal-body">
          <div className="mb-3">
            <label htmlFor="editCabName" className="form-label">
              Cab Name
            </label>
            <input
              id="editCabName"
              type="text"
              className="form-control"
              value={currentCab.name}
              onChange={(e) =>
                setCurrentCab({ ...currentCab, name: e.target.value } as Car)
              }
            />
          </div>
          <div className="mb-3">
            <label htmlFor="editRatePerKm" className="form-label">
              Rate per Km
            </label>
            <input
              id="editRatePerKm"
              type="number"
              className="form-control"
              value={currentCab.rate_per_km}
              onChange={(e) =>
                setCurrentCab({
                  ...currentCab,
                  rate_per_km: parseFloat(e.target.value),
                } as Car)
              }
            />
          </div>
          <div className="mb-3">
            <label htmlFor="editFixedCharges" className="form-label">
              Fixed Charges
            </label>
            <input
              id="editFixedCharges"
              type="number"
              className="form-control"
              value={currentCab.fixed_charges}
              onChange={(e) =>
                setCurrentCab({
                  ...currentCab,
                  fixed_charges: parseFloat(e.target.value),
                } as Car)
              }
            />
          </div>
          <div className="mb-3">
            <label htmlFor="editStatus" className="form-label">
              Status
            </label>
            <select
              id="editStatus"
              className="form-select"
              value={currentCab.status}
              onChange={(e) =>
                setCurrentCab({ ...currentCab, status: e.target.value } as Car)
              }
            >
              <option value="available">Available</option>
              <option value="not available">Not Available</option>
            </select>
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={() => setShowEditModal(false)}>
            Cancel
          </button>
          <button className="btn btn-primary" onClick={handleUpdateCab}>
            Update Cab
          </button>
        </div>
      </div>
    </div>
  </div>
)}

    </div>
  );
};

export { CabsList };
