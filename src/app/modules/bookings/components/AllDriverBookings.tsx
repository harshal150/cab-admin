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

const AllDriverBookings: FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [cabFilter, setCabFilter] = useState<string>('all');
  const [cabs, setCabs] = useState<string[]>([]);
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
            bookingDate: formatDate(booking.booking_date),
            bookingTime: formatTime(booking.booking_time),
          }))
          .sort((a: { bookingId: number }, b: { bookingId: number }) => b.bookingId - a.bookingId);

        setBookings(formattedBookings);
        setFilteredBookings(formattedBookings);

        const uniqueCabs: string[] = Array.from(new Set(formattedBookings.map((b: { cabName: string }) => b.cabName)));
        setCabs(uniqueCabs);
        
      } catch (error) {
        console.error('Error fetching bookings:', error);
        alert('Failed to fetch bookings. Please try again later.');
      }
    };

    fetchBookings();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString('en-US', { month: 'short' });
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  };

  const formatTime = (timeString: string) => {
    if (!timeString || !timeString.includes(":")) return "Invalid Time";
  
    const [hours, minutes] = timeString.split(":");
    const hourInt = parseInt(hours, 10);
    
    if (timeString.includes("AM") || timeString.includes("PM")) {
      // If timeString already has AM/PM, return it as is
      return timeString;
    }
  
    const isPM = hourInt >= 12;
    const formattedHours = hourInt % 12 || 12; // Convert 0 to 12 for 12 AM/PM format
    
    return `${formattedHours}:${minutes} ${isPM ? "PM" : "AM"}`;
  };
  
  
  

  const filterBookings = (search: string, status: string, cab: string) => {
    let filtered = bookings;

    if (search) {
      filtered = filtered.filter(
        (booking) =>
          booking.cabName.toLowerCase().includes(search) ||
          booking.driverName.toLowerCase().includes(search) ||
          booking.passengerName.toLowerCase().includes(search)
      );
    }

    if (status !== 'all') {
      filtered = filtered.filter((booking) => booking.bookingStatus === status);
    }

    if (cab !== 'all') {
      filtered = filtered.filter((booking) => booking.cabName === cab);
    }

    setFilteredBookings(filtered);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    filterBookings(query, statusFilter, cabFilter);
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStatusFilter(e.target.value);
    filterBookings(searchQuery, e.target.value, cabFilter);
  };

  const handleCabChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCabFilter(e.target.value);
    filterBookings(searchQuery, statusFilter, e.target.value);
  };

  const handleExport = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredBookings);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'AllDriverBookings');
    XLSX.writeFile(workbook, 'AllDriverBookings.xlsx');
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
              <h3 className="card-title">All Driver Bookings</h3>
              <button className="btn btn-success ms-auto" onClick={handleExport}>
                Export
              </button>
            </div>

            {/* Filters */}
            <div className="card-header align-items-center gap-2 flex-wrap">
              <div className="d-flex align-items-center flex-grow-1 flex-shrink-0">
                {/* Status Filter */}
                <div className="w-240px">
                  <select className="form-select form-select-solid" value={statusFilter} onChange={handleStatusChange}>
                    <option value="all">All Status</option>
                    <option value="success">Success</option>
                    <option value="pending">Pending</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>

                {/* Cab Filter Dropdown */}
                <div className="w-240px ms-3">
                  <select className="form-select form-select-solid" value={cabFilter} onChange={handleCabChange}>
                    <option value="all">All Cabs</option>
                    {cabs.map((cab) => (
                      <option key={cab} value={cab}>
                        {cab}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Search Field */}
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

            {/* Table */}
            <div className="card-body pt-0">
              <div className="table-responsive">
                <table className="table table-row-dashed table-row-gray-300 align-middle gs-0 gy-4">
                  <thead style={{ backgroundColor: '#F1FAFF' }}>
                    <tr className="fw-bold fs-7">
                      <th className='min-w-50px ps-4 rounded-start'>Booking ID</th>
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
                    {currentItems.map((booking) => (
                      <tr key={booking.bookingId} className="fs-7 text-dark">
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
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export { AllDriverBookings };
