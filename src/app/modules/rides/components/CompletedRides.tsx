import React, { FC, useState, useEffect } from 'react';
import axios from 'axios';

interface Ride {
  rideId: number;
  userName: string;
  rideStatus: string; // Mapped from 'status' in API
  fare: string; // Mapped from 'amount' in API
  startReading: number;
  endReading: number;
  transactionId: string;
  paymentMethod: string;
  receiptNumber: string;
  rideDate: string; // Mapped from 'created_date' in API
}

const CompletedRides: FC = () => {
  const [rides, setRides] = useState<Ride[]>([]);
  const [filteredRides, setFilteredRides] = useState<Ride[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);

  useEffect(() => {
    const fetchRides = async () => {
      try {
        const response = await axios.get('https://cabapi.payplatter.in/api/transactions');
        const filteredData = response.data.filter(
          (ride: any) =>
            ride.booking_status === 'success' &&
            ride.status === 'success' &&
            ride.ride_status === 'ended'
        );

        const mappedRides = filteredData.map((ride: any) => ({
          rideId: ride.ride_id,
          userName: ride.user_name,
          rideStatus: ride.status,
          fare: ride.amount,
          startReading: ride.start_reading,
          endReading: ride.end_reading,
          transactionId: ride.transaction_id,
          paymentMethod: ride.payment_method,
          receiptNumber: ride.receipt_number,
          rideDate: ride.created_date,
        }));

        setRides(mappedRides);
        setFilteredRides(mappedRides);
      } catch (error) {
        console.error('Error fetching rides:', error);
      }
    };

    fetchRides();
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    filterRides(query);
  };

  const filterRides = (search: string) => {
    let filtered = rides;

    if (search) {
      filtered = filtered.filter((ride) =>
        ride.userName.toLowerCase().includes(search)
      );
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
              <h3 className="card-title">Completed Rides</h3>
            </div>
            <div className="card-header align-items-center gap-2 flex-wrap">
              <div className="d-flex align-items-center flex-grow-1 flex-shrink-0">
                <div className="position-relative ms-3">
                  <input
                    type="text"
                    className="form-control form-control-solid w-[150px] ps-4"
                    placeholder="Search by Driver Name"
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
                      <th className="min-w-100px">Passanger Name</th>
                      <th className="min-w-100px">Ride Date</th>
                      <th className="min-w-100px">Fare</th>
                      <th className="min-w-100px">Start Reading</th>
                      <th className="min-w-100px">End Reading</th>
                      <th className="min-w-100px">Transaction ID</th>
                      <th className="min-w-100px">Payment Method</th>
                      <th className="min-w-100px">Receipt Number</th>
                      <th className="min-w-100px">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentItems.length === 0 ? (
                      <tr>
                        <td colSpan={10} className="text-center">
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
                            <span className="text-dark fw-bold text-hover-primary">{ride.userName}</span>
                          </td>
                          <td>
                            <span className="text-dark fw-bold text-hover-primary">{formatDate(ride.rideDate)}</span>
                          </td>
                          <td>
                            <span className="text-dark fw-bold text-hover-primary">{ride.fare}</span>
                          </td>
                          <td>
                            <span className="text-dark fw-bold text-hover-primary">{ride.startReading}</span>
                          </td>
                          <td>
                            <span className="text-dark fw-bold text-hover-primary">{ride.endReading}</span>
                          </td>
                          <td>
                            <span className="text-dark fw-bold text-hover-primary">{ride.transactionId}</span>
                          </td>
                          <td>
                            <span className="text-dark fw-bold text-hover-primary">{ride.paymentMethod}</span>
                          </td>
                          <td>
                            <span className="text-dark fw-bold text-hover-primary">{ride.receiptNumber}</span>
                          </td>
                          <td>
                            <span className="badge badge-success">{ride.rideStatus}</span>
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

export { CompletedRides };
