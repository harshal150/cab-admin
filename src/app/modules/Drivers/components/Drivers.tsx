import React, { FC, useEffect, useState } from 'react';

interface Driver {
  srNo: number;
  driverName: string;
  licenseNo: string;
  contact: string;
  status: string;
  assignedCab: string;
  experience: number; // Years of experience
  currentLocation: string;
}

const DriversList: FC = () => {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [filteredDrivers, setFilteredDrivers] = useState<Driver[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [newDriver, setNewDriver] = useState<Omit<Driver, 'srNo'>>({
    driverName: '',
    licenseNo: '',
    contact: '',
    status: 'Available',
    assignedCab: '',
    experience: 0,
    currentLocation: '',
  });

  useEffect(() => {
    // Mock data for testing
    const driverData: Driver[] = Array.from({ length: 20 }, (_, i) => ({
      srNo: i + 1,
      driverName: `Driver ${String.fromCharCode(65 + i)}`,
      licenseNo: `LIC-${1000 + i}`,
      contact: `98765432${i}`,
      status: i % 2 === 0 ? 'Available' : 'Assigned',
      assignedCab: i % 2 === 0 ? 'Not Assigned' : `Cab ${i + 1}`,
      experience: 2 + (i % 3),
      currentLocation: `Location ${i + 1}`,
    }));
    setDrivers(driverData);
    setFilteredDrivers(driverData);
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    filterDrivers(query, statusFilter);
  };

  const handleStatusFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const filter = e.target.value;
    setStatusFilter(filter);
    filterDrivers(searchQuery, filter);
  };

  const filterDrivers = (search: string, status: string) => {
    let filtered = drivers;

    if (search) {
      filtered = filtered.filter((driver) =>
        driver.driverName.toLowerCase().includes(search) ||
        driver.licenseNo.toLowerCase().includes(search) ||
        driver.contact.includes(search)
      );
    }

    if (status !== 'all') {
      filtered = filtered.filter((driver) => driver.status === status);
    }

    setFilteredDrivers(filtered);
  };

  const handlePageChange = (pageNumber: number) => setCurrentPage(pageNumber);

  const handleItemsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  const handleAddNewDriver = () => {
    const updatedDrivers = [
      ...drivers,
      {
        srNo: drivers.length + 1,
        ...newDriver,
      },
    ];
    setDrivers(updatedDrivers);
    setFilteredDrivers(updatedDrivers);
    setShowAddModal(false);
    setNewDriver({
      driverName: '',
      licenseNo: '',
      contact: '',
      status: 'Available',
      assignedCab: '',
      experience: 0,
      currentLocation: '',
    });
  };

  const totalPages = Math.ceil(filteredDrivers.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredDrivers.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div className="app-main flex-column flex-row-fluid" id="kt_app_main" style={{ marginTop: '-26px', marginBottom: '-26px' }}>
      <div className="d-flex flex-column flex-column-fluid py-2">
        <div id="kt_app_content" className="app-content flex-column-fluid">
          <div className="card card-flush">
            <div className="card-header align-items-center py-3 gap-2 gap-md-12">
              <h3 className="card-title">Drivers List</h3>
              <button className="btn btn-primary" onClick={() => setShowAddModal(true)} style={{ marginLeft: 'auto' }}>
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
                    <option value="Available">Available</option>
                    <option value="Assigned">Assigned</option>
                  </select>
                </div>
                <div className="position-relative ms-3">
                  <input
                    type="text"
                    className="form-control form-control-solid w-[150px] ps-4"
                    placeholder="Search by Name or License No."
                    value={searchQuery}
                    onChange={handleSearchChange}
                  />
                </div>
              </div>
            </div>
            <div className="card-body pt-0">
              <div className="table-responsive">
                <table className="table table-row-dashed table-row-gray-300 align-middle gs-0 gy-4">
                  <thead style={{ backgroundColor: '#F1FAFF' }}>
                    <tr className="fw-bold fs-7">
                      <th className="min-w-50px ps-4 rounded-start">Sr. No.</th>
                      <th className="min-w-150px">Driver Name</th>
                      <th className="min-w-150px">License No.</th>
                      <th className="min-w-100px">Contact</th>
                      <th className="min-w-100px">Status</th>
                      <th className="min-w-150px">Assigned Cab</th>
                      <th className="min-w-100px">Experience</th>
                      <th className="min-w-150px">Current Location</th>
                      <th className="text-right rounded-end">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentItems.length === 0 ? (
                      <tr>
                        <td colSpan={9} className="text-center">
                          No drivers available
                        </td>
                      </tr>
                    ) : (
                      currentItems.map((driver) => (
                        <tr key={driver.srNo} className="fs-7">
                          <td className="ps-4">
                            <span className="text-dark fw-bold text-hover-primary">{driver.srNo}</span>
                          </td>
                          <td>
                            <span className="text-dark fw-bold text-hover-primary">{driver.driverName}</span>
                          </td>
                          <td>
                            <span className="text-dark fw-bold text-hover-primary">{driver.licenseNo}</span>
                          </td>
                          <td>
                            <span className="text-dark fw-bold text-hover-primary">{driver.contact}</span>
                          </td>
                          <td>
  <span
    className={`badge ${
      driver.status === 'Available'
        ? 'badge-success'
        : 'badge-warning'
    } fw-bold`}
    style={{
      padding: '5px 8px',
      fontSize: '12px',
      borderRadius: '7px',
    }}
  >
    {driver.status}
  </span>
</td>

                          <td>
                            <span className="text-dark fw-bold text-hover-primary">{driver.assignedCab}</span>
                          </td>
                          <td>
                            <span className="text-dark fw-bold text-hover-primary">{driver.experience} years</span>
                          </td>
                          <td>
                            <span className="text-dark fw-bold text-hover-primary">{driver.currentLocation}</span>
                          </td>
                          <td>
                            <button className="btn btn-light-primary btn-sm">View</button>
                          </td>
                        </tr>
                      ))
                    )}
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
                        className={`btn btn-sm ${i + 1 === currentPage ? 'btn-primary' : 'btn-light'}`}
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
      </div>

      {showAddModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Add Driver</h5>
                <button className="btn-close" onClick={() => setShowAddModal(false)}></button>
              </div>
              <div className="modal-body">
                <input
                  type="text"
                  className="form-control mb-3"
                  placeholder="Driver Name"
                  value={newDriver.driverName}
                  onChange={(e) => setNewDriver({ ...newDriver, driverName: e.target.value })}
                />
                <input
                  type="text"
                  className="form-control mb-3"
                  placeholder="License No."
                  value={newDriver.licenseNo}
                  onChange={(e) => setNewDriver({ ...newDriver, licenseNo: e.target.value })}
                />
                <input
                  type="text"
                  className="form-control mb-3"
                  placeholder="Contact"
                  value={newDriver.contact}
                  onChange={(e) => setNewDriver({ ...newDriver, contact: e.target.value })}
                />
                <input
                  type="text"
                  className="form-control mb-3"
                  placeholder="Assigned Cab"
                  value={newDriver.assignedCab}
                  onChange={(e) => setNewDriver({ ...newDriver, assignedCab: e.target.value })}
                />
                <input
                  type="number"
                  className="form-control mb-3"
                  placeholder="Experience (years)"
                  value={newDriver.experience}
                  onChange={(e) => setNewDriver({ ...newDriver, experience: Number(e.target.value) })}
                />
                <input
                  type="text"
                  className="form-control mb-3"
                  placeholder="Current Location"
                  value={newDriver.currentLocation}
                  onChange={(e) => setNewDriver({ ...newDriver, currentLocation: e.target.value })}
                />
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setShowAddModal(false)}>
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
    </div>
  );
};

export { DriversList };
