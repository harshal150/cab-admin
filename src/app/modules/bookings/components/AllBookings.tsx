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
  bookingStatus: string;
  bookingDate: string;
  bookingTime: string;
  driverMobile: string;
}

const AllBookings: FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [fromDate, setFromDate] = useState<string>(''); // From Date
  const [toDate, setToDate] = useState<string>(''); // To Date
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
            driverMobile: booking.driver_mobile_no,
            passengerName: booking.user_name,
            contact: booking.user_mobile_no,
            bookingStatus: booking.status.toLowerCase(),
            bookingDate: booking.booking_date,
            bookingTime: booking.booking_time,
          }))
          .sort((a: { bookingId: number; }, b: { bookingId: number; }) => b.bookingId - a.bookingId); // Sort by bookingId in descending order
        setBookings(formattedBookings);
        setFilteredBookings(formattedBookings);
      } catch (error) {
        console.error('Error fetching bookings:', error);
        alert('Failed to fetch bookings. Please try again later.');
      }
    };

    fetchBookings();
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    filterBookings(query, statusFilter, fromDate, toDate);
  };

  const handleApplyFilter = () => {
    filterBookings(searchQuery, statusFilter, fromDate, toDate);
  };


  const handleExport = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredBookings);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'AllBookings');
    XLSX.writeFile(workbook, 'AllBookings.xlsx');
  };

  const filterBookings = (search: string, status: string, from: string, to: string) => {
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
      fromDate.setHours(0, 0, 0, 0); // Start of the day
      toDate.setHours(23, 59, 59, 999); // End of the day
      filtered = filtered.filter((booking) => {
        const bookingDate = new Date(booking.bookingDate);
        return bookingDate >= fromDate && bookingDate <= toDate;
      });
    }

    if (status !== 'all') {
      filtered = filtered.filter((booking) => booking.bookingStatus === status);
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
    <div className="app-main flex-column flex-row-fluid" id="kt_app_main" style={{ marginTop: '-26px', marginBottom: '-26px' }}>
      <div className="d-flex flex-column flex-column-fluid py-2">
        <div id="kt_app_content" className="app-content flex-column-fluid">
          <div className="card card-flush">
            <div className="card-header align-items-center py-3 gap-2 gap-md-12">
              <h3 className="card-title">All Bookings</h3>
              <button className="btn btn-success ms-auto" onClick={handleExport}>
                Export
              </button>
            </div>
            <div className="card-header align-items-center gap-2 flex-wrap">
              <div className="d-flex align-items-center flex-grow-1 flex-shrink-0">
                <div className="d-flex align-items-center">
                  <input
                    type="date"
                    className="form-control form-control-solid"
                    value={fromDate}
                    onChange={(e) => setFromDate(e.target.value)}
                    placeholder="From Date"
                  />
                  <input
                    type="date"
                    className="form-control form-control-solid ms-2"
                    value={toDate}
                    onChange={(e) => setToDate(e.target.value)}
                    placeholder="To Date"
                  />
                </div>
                <div className="w-240px ms-3">
                  <select
                    className="form-select form-select-solid"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                  >
                    <option value="all">All Status</option>
                    <option value="success">Success</option>
                    <option value="cancelled">Cancelled</option>
                    <option value="pending">Pending</option>
                  </select>
                </div>
                <button className="btn btn-primary ms-3" onClick={handleApplyFilter}>
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
                      <th className="min-w-100px">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentItems.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="text-center">
                          No bookings available
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
                            <span className="text-dark fw-bold text-hover-primary">{booking.driverMobile}</span>
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
                            <span
                              className={`badge ${
                                booking.bookingStatus === 'success'
                                  ? 'badge-success'
                                  : booking.bookingStatus === 'cancelled'
                                  ? 'badge-primary'
                                  : 'badge-warning'
                              }`}
                            >
                              {booking.bookingStatus}
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

export { AllBookings };
