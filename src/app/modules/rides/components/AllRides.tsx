import React, { FC, useState, useEffect } from 'react';

interface Ride {
  rideId: number;
  cabName: string;
  driverName: string;
  passengerName: string;
  contact: string;
  rideStatus: string;
  fare: number;
  rideDate: string;
}

const AllRides: FC = () => {
  const [rides, setRides] = useState<Ride[]>([]);
  const [filteredRides, setFilteredRides] = useState<Ride[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);

  useEffect(() => {
    const rideData: Ride[] = Array.from({ length: 30 }, (_, i) => ({
      rideId: i + 1,
      cabName: `Cab ${i + 1}`,
      driverName: `Driver ${String.fromCharCode(65 + i)}`,
      passengerName: `Passenger ${i + 1}`,
      contact: `98765432${i % 10}`,
      rideStatus: i % 2 === 0 ? 'Completed' : 'In Progress',
      fare: (i + 1) * 100,
      rideDate: `2023-12-${i % 31 + 1}`,
    }));
    setRides(rideData);
    setFilteredRides(rideData);
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    filterRides(query, statusFilter);
  };

  const handleStatusFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const filter = e.target.value;
    setStatusFilter(filter);
    filterRides(searchQuery, filter);
  };

  const filterRides = (search: string, status: string) => {
    let filtered = rides;

    if (search) {
      filtered = filtered.filter(
        (ride) =>
          ride.cabName.toLowerCase().includes(search) ||
          ride.driverName.toLowerCase().includes(search) ||
          ride.passengerName.toLowerCase().includes(search)
      );
    }

    if (status !== 'all') {
      filtered = filtered.filter((ride) => ride.rideStatus === status);
    }

    setFilteredRides(filtered);
  };

  const handlePageChange = (pageNumber: number) => setCurrentPage(pageNumber);

  const handleItemsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString('en-US', { month: 'short' });
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  };

  const totalPages = Math.ceil(filteredRides.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredRides.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div className="app-main flex-column flex-row-fluid" id="kt_app_main" style={{ marginTop: '-26px', marginBottom: '-26px' }}>
      <div className="d-flex flex-column flex-column-fluid py-2">
        <div id="kt_app_content" className="app-content flex-column-fluid">
          <div className="card card-flush">
            <div className="card-header align-items-center py-3 gap-2 gap-md-12">
              <h3 className="card-title">All Rides</h3>
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
                    <option value="Completed">Completed</option>
                    <option value="In Progress">In Progress</option>
                  </select>
                </div>
                <div className="position-relative ms-3">
                  <input
                    type="text"
                    className="form-control form-control-solid w-[150px] ps-4"
                    placeholder="Search by Cab or Passenger"
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
                      <th className="min-w-50px ps-4 rounded-start">Ride ID</th>
                      <th className="min-w-100px">Cab Name</th>
                      <th className="min-w-100px">Driver Name</th>
                      <th className="min-w-100px">Passenger Name</th>
                      <th className="min-w-100px">Contact</th>
                      <th className="min-w-100px">Ride Date</th>
                      <th className="min-w-100px">Fare</th>
                      <th className="min-w-100px">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentItems.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="text-center">
                          No rides available
                        </td>
                      </tr>
                    ) : (
                      currentItems.map((ride) => (
                        <tr key={ride.rideId} className="fs-7">
                          <td className="ps-4">
                            <span className="text-dark fw-bold text-hover-primary">{ride.rideId}</span>
                          </td>
                          <td>
                            <span className="text-dark fw-bold text-hover-primary">{ride.cabName}</span>
                          </td>
                          <td>
                            <span className="text-dark fw-bold text-hover-primary">{ride.driverName}</span>
                          </td>
                          <td>
                            <span className="text-dark fw-bold text-hover-primary">{ride.passengerName}</span>
                          </td>
                          <td>
                            <span className="text-dark fw-bold text-hover-primary">{ride.contact}</span>
                          </td>
                          <td>
                            <span className="text-dark fw-bold text-hover-primary">{formatDate(ride.rideDate)}</span>
                          </td>
                          <td>
                            <span className="text-dark fw-bold text-hover-primary">{ride.fare}</span>
                          </td>
                          <td>
                            <span
                              className={`badge ${
                                ride.rideStatus === 'Completed' ? 'badge-success' : 'badge-warning'
                              }`}
                            >
                              {ride.rideStatus}
                            </span>
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
    </div>
  );
};

export { AllRides };
