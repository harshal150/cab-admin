import React, { FC, useState, useEffect } from 'react';

interface CurrentRide {
  rideId: number;
  cabName: string;
  driverName: string;
  passengerName: string;
  contact: string;
  rideStartTime: string;
  currentLocation: string;
  fareSoFar: number;
  rideStatus: string;
}

const CurrentRides: FC = () => {
  const [rides, setRides] = useState<CurrentRide[]>([]);
  const [filteredRides, setFilteredRides] = useState<CurrentRide[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);

  useEffect(() => {
    const rideData: CurrentRide[] = Array.from({ length: 15 }, (_, i) => ({
      rideId: i + 1,
      cabName: `Cab ${i + 1}`,
      driverName: `Driver ${String.fromCharCode(65 + i)}`,
      passengerName: `Passenger ${i + 1}`,
      contact: `98765432${i % 10}`,
      rideStartTime: `2023-12-${i % 31 + 1} 14:${i % 60}:00`,
      currentLocation: `Location ${i + 1}`,
      fareSoFar: (i + 1) * 120,
      rideStatus: 'In Transit',
    }));
    setRides(rideData);
    setFilteredRides(rideData);
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    filterRides(query);
  };

  const filterRides = (search: string) => {
    let filtered = rides;

    if (search) {
      filtered = filtered.filter(
        (ride) =>
          ride.cabName.toLowerCase().includes(search) ||
          ride.driverName.toLowerCase().includes(search) ||
          ride.passengerName.toLowerCase().includes(search)
      );
    }

    setFilteredRides(filtered);
  };

  const handlePageChange = (pageNumber: number) => setCurrentPage(pageNumber);

  const handleItemsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  const formatDateTime = (dateTimeString: string) => {
    const date = new Date(dateTimeString);
    const day = date.getDate();
    const month = date.toLocaleString('en-US', { month: 'short' });
    const year = date.getFullYear();
    const time = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    return `${day} ${month} ${year}, ${time}`;
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
              <h3 className="card-title">Current Rides</h3>
            </div>
            <div className="card-header align-items-center gap-2 flex-wrap">
              <div className="d-flex align-items-center flex-grow-1 flex-shrink-0">
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
                      <th className="min-w-150px">Ride Start Time</th>
                      
                      <th className="min-w-100px">Fare (so far)</th>
                      <th className="min-w-100px">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentItems.length === 0 ? (
                      <tr>
                        <td colSpan={9} className="text-center">
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
                            <span className="text-dark fw-bold text-hover-primary">{formatDateTime(ride.rideStartTime)}</span>
                          </td>
                         
                          <td>
                            <span className="text-dark fw-bold text-hover-primary">{ride.fareSoFar}</span>
                          </td>
                          <td>
                            <span className="badge badge-info">{ride.rideStatus}</span>
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

export { CurrentRides };
