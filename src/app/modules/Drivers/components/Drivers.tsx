import React, { FC, useEffect, useState } from 'react';
import axios from 'axios';

interface Driver {
  id: number;
  driver_name: string;
  driver_mobile_no: string;
  status: string;
  assigned_cab: string;
}

interface Cab {
  id: number;
  name: string;
  status: string;
}

const DriversList: FC = () => {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [filteredDrivers, setFilteredDrivers] = useState<Driver[]>([]);
  const [cabs, setCabs] = useState<Cab[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [currentDriver, setCurrentDriver] = useState<Driver | null>(null);
    const [refresh, setRefresh] = useState(false);
  const [newDriver, setNewDriver] = useState<Omit<Driver, 'id'>>({
    driver_name: '',
    driver_mobile_no: '',
    status: 'available',
    assigned_cab: '',
  });

  // Fetch drivers and cabs from API
  useEffect(() => {
    const fetchDriversAndCabs = async () => {
      try {
        const [driversResponse, cabsResponse] = await Promise.all([
          axios.get('https://cabapi.payplatter.in/api/drivers'),
          axios.get('https://cabapi.payplatter.in/api/cars'),
        ]);
        setDrivers(driversResponse.data);
        setFilteredDrivers(driversResponse.data);
        setCabs(cabsResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
  
    fetchDriversAndCabs();
  }, [refresh]); // Ensure refresh is included here
  

  // Filter functionality
  const filterDrivers = (search: string, status: string) => {
    let filtered = drivers;

    if (search) {
      filtered = filtered.filter((driver) =>
        driver.driver_name.toLowerCase().includes(search.toLowerCase()) ||
        driver.driver_mobile_no.includes(search)
      );
    }

    if (status !== 'all') {
      filtered = filtered.filter((driver) => driver.status === status);
    }

    setFilteredDrivers(filtered);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    filterDrivers(query, statusFilter);
  };

  const handleStatusFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const filter = e.target.value;
    setStatusFilter(filter);
    filterDrivers(searchQuery, filter);
  };

  const handlePageChange = (pageNumber: number) => setCurrentPage(pageNumber);

  const handleItemsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  // Add a new driver
  const handleAddNewDriver = async () => {
    try {
      const selectedCab = cabs.find((cab) => cab.name === newDriver.assigned_cab);
      const payload = {
        driver_name: newDriver.driver_name,
        driver_mobile_no: newDriver.driver_mobile_no,
        status: newDriver.status,
        assigned_cab_id: selectedCab ? selectedCab.id : null,
      };
  
      await axios.post('https://cabapi.payplatter.in/api/drivers', payload);
  
      // Trigger refresh to fetch updated data
      setRefresh((prev) => !prev);
  
      // Close modal and reset state
      setShowAddModal(false);
      setNewDriver({
        driver_name: '',
        driver_mobile_no: '',
        status: 'available',
        assigned_cab: '',
      });
    } catch (error) {
      console.error('Error adding driver:', error);
    }
  };
  
  

  // Edit driver
  const handleEditClick = (driver: Driver) => {
    setCurrentDriver(driver);
    setShowEditModal(true);
  };

  const handleUpdateDriver = async () => {
    if (!currentDriver) return;
  
    try {
      const selectedCab = cabs.find((cab) => cab.name === currentDriver.assigned_cab);
      const payload = {
        driver_name: currentDriver.driver_name,
        driver_mobile_no: currentDriver.driver_mobile_no,
        status: currentDriver.status,
        assigned_cab_id: selectedCab ? selectedCab.id : null,
      };
  
      await axios.put(`https://cabapi.payplatter.in/api/drivers/${currentDriver.id}`, payload);
  
      // Trigger refresh to fetch updated data
      setRefresh((prev) => !prev);
  
      // Close modal and reset state
      setShowEditModal(false);
      setCurrentDriver(null);
    } catch (error) {
      console.error('Error updating driver:', error);
    }
  };
  

  const handleDeleteDriver = async (id: number) => {
    try {
      // Call the delete API endpoint with the driver ID
      await axios.delete(`https://cabapi.payplatter.in/api/drivers/${id}`);
  
      // Update the state to remove the deleted driver
      setDrivers((prev) => prev.filter((driver) => driver.id !== id));
      setFilteredDrivers((prev) => prev.filter((driver) => driver.id !== id));
    } catch (error) {
      console.error('Error deleting driver:', error);
    }
  };
  
  

  const totalPages = Math.ceil(filteredDrivers.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredDrivers.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div className="app-main flex-column flex-row-fluid">
      {/* Header and Filters */}
      <div className="d-flex flex-column flex-column-fluid py-2">
        <div className="card card-flush">
          <div className="card-header align-items-center py-3 gap-2 gap-md-12">
            <h3 className="card-title text-dark fw-bold">Drivers List</h3>
            <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
              Add Driver
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
                  placeholder="Search by Name or Mobile No."
                  value={searchQuery}
                  onChange={handleSearchChange}
                />
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="card-body pt-0">
            <div className="table-responsive">
              <table className="table table-row-dashed table-row-gray-300 align-middle">
                <thead>
                  <tr>
                    <th className="fw-bold text-dark">Sr. No.</th>
                    <th className="fw-bold text-dark">Driver Name</th>
                    <th className="fw-bold text-dark">Mobile No.</th>
                    <th className="fw-bold text-dark">Status</th>
                    <th className="fw-bold text-dark">Assigned Cab</th>
                    <th className="fw-bold text-dark">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {currentItems.map((driver, index) => (
                    <tr key={driver.id}>
                      <td>{indexOfFirstItem + index + 1}</td>
                      <td className="text-dark fw-bold text-hover-primary">
                        {driver.driver_name}
                      </td>
                      <td className="text-dark fw-bold text-hover-primary">
                        {driver.driver_mobile_no}
                      </td>
                      <td>
                        <span
                          className={`badge ${
                            driver.status === 'available' ? 'badge-success' : 'badge-warning'
                          }`}
                        >
                          {driver.status}
                        </span>
                      </td>
                      <td className="text-dark fw-bold">{driver.assigned_cab}</td>
                      <td>
                        <button
                          className="btn btn-light-primary btn-sm me-2"
                          onClick={() => handleEditClick(driver)}
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn-light-danger btn-sm"
                          onClick={() => handleDeleteDriver(driver.id)}
                        >
                          <i className="bi bi-trash"></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Add Driver Modal */}
      {showAddModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5>Add Driver</h5>
                <button className="btn-close" onClick={() => setShowAddModal(false)}></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label htmlFor="driverName">Driver Name</label>
                  <input
                    id="driverName"
                    type="text"
                    className="form-control"
                    value={newDriver.driver_name}
                    onChange={(e) =>
                      setNewDriver({ ...newDriver, driver_name: e.target.value })
                    }
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="driverMobileNo">Mobile No.</label>
                  <input
                    id="driverMobileNo"
                    type="text"
                    className="form-control"
                    value={newDriver.driver_mobile_no}
                    onChange={(e) =>
                      setNewDriver({ ...newDriver, driver_mobile_no: e.target.value })
                    }
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="driverStatus">Status</label>
                  <select
                    id="driverStatus"
                    className="form-select"
                    value={newDriver.status}
                    onChange={(e) =>
                      setNewDriver({ ...newDriver, status: e.target.value })
                    }
                  >
                    <option value="available">Available</option>
                    <option value="not available">Not Available</option>
                  </select>
                </div>
                <div className="mb-3">
                  <label htmlFor="assignedCab">Assigned Cab</label>
                  <select
                    id="assignedCab"
                    className="form-select"
                    value={newDriver.assigned_cab}
                    onChange={(e) =>
                      setNewDriver({ ...newDriver, assigned_cab: e.target.value })
                    }
                  >
                    <option value="">Select a Cab</option>
                    {cabs.map((cab) => (
                      <option key={cab.id} value={cab.name}>
                        {cab.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowAddModal(false)}
                >
                  Cancel
                </button>
                <button className="btn btn-primary" onClick={handleAddNewDriver}>
                  Add Driver
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Driver Modal */}
      {showEditModal && currentDriver && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5>Edit Driver</h5>
                <button
                  className="btn-close"
                  onClick={() => setShowEditModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label htmlFor="editDriverName">Driver Name</label>
                  <input
                    id="editDriverName"
                    type="text"
                    className="form-control"
                    value={currentDriver.driver_name}
                    onChange={(e) =>
                      setCurrentDriver({
                        ...currentDriver,
                        driver_name: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="editDriverMobileNo">Mobile No.</label>
                  <input
                    id="editDriverMobileNo"
                    type="text"
                    className="form-control"
                    value={currentDriver.driver_mobile_no}
                    onChange={(e) =>
                      setCurrentDriver({
                        ...currentDriver,
                        driver_mobile_no: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="editDriverStatus">Status</label>
                  <select
                    id="editDriverStatus"
                    className="form-select"
                    value={currentDriver.status}
                    onChange={(e) =>
                      setCurrentDriver({ ...currentDriver, status: e.target.value })
                    }
                  >
                    <option value="available">Available</option>
                    <option value="not available">Not Available</option>
                  </select>
                </div>
                <div className="mb-3">
                  <label htmlFor="editAssignedCab">Assigned Cab</label>
                  <select
                    id="editAssignedCab"
                    className="form-select"
                    value={currentDriver.assigned_cab}
                    onChange={(e) =>
                      setCurrentDriver({
                        ...currentDriver,
                        assigned_cab: e.target.value,
                      })
                    }
                  >
                    <option value="">Select a Cab</option>
                    {cabs.map((cab) => (
                      <option key={cab.id} value={cab.name}>
                        {cab.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowEditModal(false)}
                >
                  Cancel
                </button>
                <button className="btn btn-primary" onClick={handleUpdateDriver}>
                  Update Driver
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export { DriversList };
