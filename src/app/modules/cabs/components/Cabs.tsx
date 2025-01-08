import React, { FC, useEffect, useState } from 'react';

interface Cab {
  srNo: number;
  cabName: string;
  registrationNo: string;
  driverName: string;
  contact: string;
  status: string;
  capacity: number;
  lastServiceDate: string;
  currentLocation: string;
}

const CabsList: FC = () => {
  const [cabs, setCabs] = useState<Cab[]>([]);
  const [filteredCabs, setFilteredCabs] = useState<Cab[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [newCab, setNewCab] = useState<Omit<Cab, 'srNo'>>({
    cabName: '',
    registrationNo: '',
    driverName: '',
    contact: '',
    status: 'Available',
    capacity: 4,
    lastServiceDate: '',
    currentLocation: '',
  });

  useEffect(() => {
    const cabData: Cab[] = Array.from({ length: 20 }, (_, i) => ({
      srNo: i + 1,
      cabName: `Cab ${i + 1}`,
      registrationNo: `REG-${1000 + i}`,
      driverName: `Driver ${String.fromCharCode(65 + i)}`,
      contact: `98765432${i}`,
      status: i % 2 === 0 ? 'Available' : 'Busy',
      capacity: 4 + (i % 3),
      lastServiceDate: `202${i % 2}-12-0${i % 9 + 1}`,
      currentLocation: `Location ${i + 1}`,
    }));
    setCabs(cabData);
    setFilteredCabs(cabData);
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    filterCabs(query, statusFilter);
  };

  const handleStatusFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const filter = e.target.value;
    setStatusFilter(filter);
    filterCabs(searchQuery, filter);
  };

  const filterCabs = (search: string, status: string) => {
    let filtered = cabs;

    if (search) {
      filtered = filtered.filter((cab) =>
        cab.cabName.toLowerCase().includes(search) ||
        cab.driverName.toLowerCase().includes(search) ||
        cab.registrationNo.toLowerCase().includes(search)
      );
    }

    if (status !== 'all') {
      filtered = filtered.filter((cab) => cab.status === status);
    }

    setFilteredCabs(filtered);
  };

  const handlePageChange = (pageNumber: number) => setCurrentPage(pageNumber);

  const handleItemsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  const handleAddNewCab = () => {
    const updatedCabs = [
      ...cabs,
      {
        srNo: cabs.length + 1,
        ...newCab,
      },
    ];
    setCabs(updatedCabs);
    setFilteredCabs(updatedCabs);
    setShowAddModal(false);
    setNewCab({
      cabName: '',
      registrationNo: '',
      driverName: '',
      contact: '',
      status: 'Available',
      capacity: 4,
      lastServiceDate: '',
      currentLocation: '',
    });
  };

  const totalPages = Math.ceil(filteredCabs.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredCabs.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div className="app-main flex-column flex-row-fluid" id="kt_app_main" style={{ marginTop: '-26px', marginBottom: '-26px' }}>
      <div className="d-flex flex-column flex-column-fluid py-2">
        <div id="kt_app_content" className="app-content flex-column-fluid">
          <div className="card card-flush">
            <div className="card-header align-items-center py-3 gap-2 gap-md-12">
              <h3 className="card-title">Cabs List</h3>
              <button className="btn btn-primary" onClick={() => setShowAddModal(true)} style={{ marginLeft: 'auto' }}>
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
                    <option value="Available">Available</option>
                    <option value="Busy">Busy</option>
                  </select>
                </div>
                <div className="position-relative ms-3">
                  <input
                    type="text"
                    className="form-control form-control-solid w-[150px] ps-4"
                    placeholder="Search by CabName or Driver"
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
                      <th className="min-w-100px">Cab Name</th>
                      <th className="min-w-100px">Registration No.</th>
                      <th className="min-w-100px">Driver Name</th>
                      <th className="min-w-100px">Contact</th>
                      <th className="min-w-100px">Status</th>
                      <th className="min-w-100px">Capacity</th>
                      <th className="min-w-100px">Last Service</th>
                      <th className="min-w-100px">Current Location</th>
                      <th className="text-right rounded-end">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentItems.length === 0 ? (
                      <tr>
                        <td colSpan={10} className="text-center">
                          No cabs available
                        </td>
                      </tr>
                    ) : (
                      currentItems.map((cab) => (
                        <tr key={cab.srNo} className="fs-7">
                          <td className="ps-4">
                            <span className="text-dark fw-bold text-hover-primary">{cab.srNo}</span>
                          </td>
                          <td>
                            <span className="text-dark fw-bold text-hover-primary">{cab.cabName}</span>
                          </td>
                          <td>
                            <span className="text-dark fw-bold text-hover-primary">{cab.registrationNo}</span>
                          </td>
                          <td>
                            <span className="text-dark fw-bold text-hover-primary">{cab.driverName}</span>
                          </td>
                          <td>
                            <span className="text-dark fw-bold text-hover-primary">{cab.contact}</span>
                          </td>
                          <td>
                            <span className="text-dark fw-bold text-hover-primary">{cab.status}</span>
                          </td>
                          <td>
                            <span className="text-dark fw-bold text-hover-primary">{cab.capacity}</span>
                          </td>
                          <td>
                            <span className="text-dark fw-bold text-hover-primary">{cab.lastServiceDate}</span>
                          </td>
                          <td>
                            <span className="text-dark fw-bold text-hover-primary">{cab.currentLocation}</span>
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
                <h5 className="modal-title">Add New Cab</h5>
                <button className="btn-close" onClick={() => setShowAddModal(false)}></button>
              </div>
              <div className="modal-body">
                <input
                  type="text"
                  className="form-control mb-3"
                  placeholder="Cab Name"
                  value={newCab.cabName}
                  onChange={(e) => setNewCab({ ...newCab, cabName: e.target.value })}
                />
                <input
                  type="text"
                  className="form-control mb-3"
                  placeholder="Registration No."
                  value={newCab.registrationNo}
                  onChange={(e) => setNewCab({ ...newCab, registrationNo: e.target.value })}
                />
                <input
                  type="text"
                  className="form-control mb-3"
                  placeholder="Driver Name"
                  value={newCab.driverName}
                  onChange={(e) => setNewCab({ ...newCab, driverName: e.target.value })}
                />
                <input
                  type="text"
                  className="form-control mb-3"
                  placeholder="Contact"
                  value={newCab.contact}
                  onChange={(e) => setNewCab({ ...newCab, contact: e.target.value })}
                />
                <input
                  type="text"
                  className="form-control mb-3"
                  placeholder="Current Location"
                  value={newCab.currentLocation}
                  onChange={(e) => setNewCab({ ...newCab, currentLocation: e.target.value })}
                />
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
    </div>
  );
};

export { CabsList };
