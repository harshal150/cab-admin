import React, { FC, useState, useEffect } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';
import { BACKEND_DOMAIN } from '../../../../apiEndpoints';

interface Booking {
  bookingId: number;
  cabName: string;
  driverName: string;
  passengerName: string;
  contact: string;
  bookingDate: string;
  bookingTime: string;
  rideStatus: string;
  driverMobile: string;
}

const NotStartedRides: FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [fromDate, setFromDate] = useState<string>('');
  const [toDate, setToDate] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(50);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await axios.get(`${BACKEND_DOMAIN}/api/bookings`);
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
            driverMobile: booking.driver_mobile_no,
          }))
          .filter((booking: { rideStatus: string }) => booking.rideStatus === 'not started')
          .sort((a: { bookingId: number }, b: { bookingId: number }) => b.bookingId - a.bookingId); // Sort by latest bookingId
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
    filterBookings(query, fromDate, toDate);
  };

  const handleApplyFilter = () => {
    filterBookings(searchQuery, fromDate, toDate);
  };

  const filterBookings = (search: string, from: string, to: string) => {
    let filtered = bookings;

    if (search) {
      filtered = filtered.filter(
        (booking) =>
          booking.cabName.toLowerCase().includes(search) ||
          booking.driverName.toLowerCase().includes(search) ||
          booking.passengerName.toLowerCase().includes(search)
      );
    }

    if (from && to) {
      const fromDate = new Date(from);
      const toDate = new Date(to);
      fromDate.setHours(0, 0, 0, 0);
      toDate.setHours(23, 59, 59, 999);
      filtered = filtered.filter((booking) => {
        const bookingDate = new Date(booking.bookingDate);
        return bookingDate >= fromDate && bookingDate <= toDate;
      });
    }

    setFilteredBookings(filtered);
  };

  const handleExport = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredBookings);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'NotStartedRides');
    XLSX.writeFile(workbook, 'NotStartedRides.xlsx');
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
    const [hours, minutes] = timeString.split(':');
    const isPM = parseInt(hours) >= 12;
    const formattedHours = isPM ? (parseInt(hours) % 12 || 12) : parseInt(hours);
    return `${formattedHours}:${minutes} ${isPM ? 'PM' : 'AM'}`;
  };

  const totalPages = Math.ceil(filteredBookings.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredBookings.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div className="app-main flex-column flex-row-fluid" id="kt_app_main">
      <div className="d-flex flex-column flex-column-fluid py-2">
        <div id="kt_app_content" className="app-content flex-column-fluid">
          <div className="card card-flush">
            <div className="card-header align-items-center py-3 gap-2 gap-md-12">
              <h3 className="card-title">Not Started Rides</h3>
              <button className="btn btn-success ms-auto" onClick={handleExport}>
                Export
              </button>
            </div>
            <div className="card-header align-items-center gap-2 flex-wrap">
              <div className="d-flex align-items-center">
                <input
                  type="date"
                  className="form-control form-control-solid"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                />
                <input
                  type="date"
                  className="form-control form-control-solid ms-2"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                />
                <button className="btn btn-primary ms-2" onClick={handleApplyFilter}>
                  Apply
                </button>
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
            <div className="card-body pt-0">
              <div className="table-responsive">
                <table className="table table-row-dashed table-row-gray-300 align-middle gs-0 gy-4">
                  <thead style={{ backgroundColor: '#F1FAFF' }}>
                    <tr className="fw-bold fs-7">
                      <th className="min-w-50px ps-4 rounded-start">Booking ID</th>
                      <th className="min-w-100px">Cab Name</th>
                      <th className="min-w-100px">Driver Name</th>
                      <th className="min-w-100px">Driver Contact</th>
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
                        <td colSpan={9} className="text-center">
                          No rides available
                        </td>
                      </tr>
                    ) : (
                      currentItems.map((booking) => (
                        <tr key={booking.bookingId} className="fs-7">
                          <td className="ps-4">
                            <span className="text-dark fw-bold text-hover-primary">{booking.bookingId}</span>
                          </td>
                          <td className="text-dark fw-bold text-hover-primary">{booking.cabName}</td>
                          <td className="text-dark fw-bold text-hover-primary">{booking.driverName}</td>
                          <td className="text-dark fw-bold text-hover-primary">{booking.driverMobile}</td>
                          <td className="text-dark fw-bold text-hover-primary">{booking.passengerName}</td>
                          <td className="text-dark fw-bold text-hover-primary">{booking.contact}</td>
                          <td className="text-dark fw-bold text-hover-primary">{formatDate(booking.bookingDate)}</td>
                          <td className="text-dark fw-bold text-hover-primary">{formatTime(booking.bookingTime)}</td>
                          <td>
                            <span className="badge badge-warning">{booking.rideStatus}</span>
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
