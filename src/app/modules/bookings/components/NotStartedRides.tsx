import React, { FC, useState, useEffect } from 'react';
import axios from 'axios';

interface Booking {
  bookingId: number;
  cabName: string;
  driverName: string;
  passengerName: string;
  contact: string;
  bookingDate: string;
  bookingTime: string;
  rideStatus: string;
}

const NotStartedRides: FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(50);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await axios.get('https://cabapi.payplatter.in/api/bookings');
        const formattedBookings = response.data
          .map((booking: any) => ({
            bookingId: booking.booking_id,
            cabName: booking.cab_name,
            driverName: booking.driver_name,
            passengerName: booking.user_name,
            contact: booking.user_mobile_no,
            bookingDate: booking.booking_date,
            bookingTime: booking.booking_time,
            rideStatus: booking.ride_status,
          }))
          .filter((booking: { rideStatus: string; }) => booking.rideStatus === 'not started'); // Only "not started" rides
        setBookings(formattedBookings);
        setFilteredBookings(formattedBookings);
      } catch (error) {
        console.error('Error fetching bookings:', error);
      }
    };

    fetchBookings();
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    filterBookings(query);
  };

  const filterBookings = (search: string) => {
    let filtered = bookings;

    if (search) {
      filtered = filtered.filter(
        (booking) =>
          booking.cabName.toLowerCase().includes(search) ||
          booking.driverName.toLowerCase().includes(search) ||
          booking.passengerName.toLowerCase().includes(search)
      );
    }

    setFilteredBookings(filtered);
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

  const formatTime = (timeString: string) => {
    const [hours, minutes, seconds] = timeString.split(':');
    const isPM = parseInt(hours) >= 12;
    const formattedHours = isPM ? (parseInt(hours) % 12 || 12) : parseInt(hours);
    return `${formattedHours}:${minutes} ${isPM ? 'PM' : 'AM'}`;
  };

  const totalPages = Math.ceil(filteredBookings.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredBookings.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div className="app-main flex-column flex-row-fluid" id="kt_app_main" style={{ marginTop: '-26px', marginBottom: '-26px' }}>
      <div className="d-flex flex-column flex-column-fluid py-2">
        <div id="kt_app_content" className="app-content flex-column-fluid">
          <div className="card card-flush">
            <div className="card-header align-items-center py-3 gap-2 gap-md-12">
              <h3 className="card-title">Not Started Rides</h3>
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
                      <th className="min-w-50px ps-4 rounded-start">Booking ID</th>
                      <th className="min-w-100px">Cab Name</th>
                      <th className="min-w-100px">Driver Name</th>
                      <th className="min-w-100px">Passenger Name</th>
                      <th className="min-w-100px">Contact</th>
                      <th className="min-w-100px">Booking Date</th>
                      <th className="min-w-100px">Booking Time</th>
                      <th className="min-w-100px">Ride Status</th>
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
                      currentItems.map((booking) => (
                        <tr key={booking.bookingId} className="fs-7">
                          <td className="ps-4">
                            <span className="text-dark fw-bold text-hover-primary">{booking.bookingId}</span>
                          </td>
                          <td>
                            <span className="text-dark fw-bold text-hover-primary">{booking.cabName}</span>
                          </td>
                          <td>
                            <span className="text-dark fw-bold text-hover-primary">{booking.driverName}</span>
                          </td>
                          <td>
                            <span className="text-dark fw-bold text-hover-primary">{booking.passengerName}</span>
                          </td>
                          <td>
                            <span className="text-dark fw-bold text-hover-primary">{booking.contact}</span>
                          </td>
                          <td>
                            <span className="text-dark fw-bold text-hover-primary">{formatDate(booking.bookingDate)}</span>
                          </td>
                          <td>
                            <span className="text-dark fw-bold text-hover-primary">{formatTime(booking.bookingTime)}</span>
                          </td>
                          <td>
                            <span className="badge badge-success">{booking.rideStatus}</span>
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

export { NotStartedRides };
