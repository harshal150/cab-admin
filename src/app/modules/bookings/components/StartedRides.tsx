import React, { FC, useState, useEffect } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';
import { BACKEND_DOMAIN } from '../../../../apiEndpoints';

interface Transaction {
  bookingId: number;
  cabName: string;
  driverName: string;
  driverContact: string;
  passengerName: string;
  passengerContact: string;
  bookingDate: string;
  bookingTime: string;
  rideStatus: string;
  startReading: number | null;
  endReading: number | null;
}

const StartedRides: FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await axios.get(`${BACKEND_DOMAIN}/api/transactions`);
        const formattedTransactions = response.data
          .map((transaction: any) => ({
            bookingId: transaction.booking_id,
            cabName: transaction.car_name,
            driverName: transaction.driver_name,
            driverContact: transaction.driver_mobile_no,
            passengerName: transaction.user_name,
            passengerContact: transaction.passenger_contact,
            bookingDate: transaction.created_date,
            bookingTime: new Date(transaction.created_at).toLocaleTimeString('en-US', {
              hour: '2-digit',
              minute: '2-digit',
              hour12: true,
            }),
            rideStatus: transaction.ride_status,
            startReading: transaction.start_reading,
          }))
          .filter(
            (transaction: Transaction) =>
              transaction.startReading !== null &&
              transaction.endReading === null &&
              transaction.rideStatus === 'started'
          ); // Filtering for 'started' rides
        setTransactions(formattedTransactions);
        setFilteredTransactions(formattedTransactions);
      } catch (error) {
        console.error('Error fetching transactions:', error);
      }
    };

    fetchTransactions();
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    const filtered = transactions.filter(
      (transaction) =>
        transaction.passengerName.toLowerCase().includes(query) ||
        transaction.bookingId.toString().includes(query)
    );
    setFilteredTransactions(filtered);
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

  const handleExport = () => {
    const dataToExport = filteredTransactions.map((transaction) => ({
      'Booking ID': transaction.bookingId,
      'Cab Name': transaction.cabName,
      'Driver Name': transaction.driverName,
      'Driver Contact': transaction.driverContact,
      'Passenger Name': transaction.passengerName,
      'Passenger Contact': transaction.passengerContact,
      'Booking Date': formatDate(transaction.bookingDate),
      'Booking Time': transaction.bookingTime,
      'Ride Status': transaction.rideStatus,
      'Start Reading': transaction.startReading ?? 'N/A',
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Started Rides');
    XLSX.writeFile(workbook, 'Started_Rides.xlsx');
  };

  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredTransactions.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div className="app-main flex-column flex-row-fluid" id="kt_app_main" style={{ marginTop: '-26px', marginBottom: '-26px' }}>
      <div className="d-flex flex-column flex-column-fluid py-2">
        <div id="kt_app_content" className="app-content flex-column-fluid">
          <div className="card card-flush">
            <div className="card-header align-items-center py-3 gap-2 gap-md-12">
              <h3 className="card-title">Started Rides</h3>
              <button className="btn btn-primary" onClick={handleExport}>
                Export
              </button>
            </div>
            <div className="card-header align-items-center gap-2 flex-wrap">
              <div className="d-flex align-items-center flex-grow-1 flex-shrink-0">
                <div className="position-relative ms-3">
                  <input
                    type="text"
                    className="form-control form-control-solid w-[150px] ps-4"
                    placeholder="Search by Passenger or Booking ID"
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
                      <th className="min-w-150px">Cab Name</th>
                      <th className="min-w-150px">Driver Name</th>
                      <th className="min-w-150px">Driver Contact</th>
                      <th className="min-w-150px">Passenger Name</th>
                      <th className="min-w-150px">Passenger Contact</th>
                      <th className="min-w-150px">Booking Date</th>
                      <th className="min-w-100px">Booking Time</th>
                      <th className="min-w-100px">Ride Status</th>
                      <th className="min-w-100px">Start Reading</th>
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
                      currentItems.map((transaction) => (
                        <tr key={transaction.bookingId} className="fs-7">
                          <td className="ps-4">
                            <span className="text-dark fw-bold text-hover-primary">{transaction.bookingId}</span>
                          </td>
                          <td>
                            <span className="text-dark fw-bold text-hover-primary">{transaction.cabName}</span>
                          </td>
                          <td>
                            <span className="text-dark fw-bold text-hover-primary">{transaction.driverName}</span>
                          </td>
                          <td>
                            <span className="text-dark fw-bold text-hover-primary">{transaction.driverContact}</span>
                          </td>
                          <td>
                            <span className="text-dark fw-bold text-hover-primary">{transaction.passengerName}</span>
                          </td>
                          <td>
                            <span className="text-dark fw-bold text-hover-primary">{transaction.passengerContact}</span>
                          </td>
                          <td>
                            <span className="text-dark fw-bold text-hover-primary">{formatDate(transaction.bookingDate)}</span>
                          </td>
                          <td>
                            <span className="text-dark fw-bold text-hover-primary">{transaction.bookingTime}</span>
                          </td>
                          <td>
                            <span className="badge badge-success">{transaction.rideStatus}</span>
                          </td>
                          <td>
                            <span className="text-dark fw-bold text-hover-primary">{transaction.startReading ?? 'N/A'}</span>
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

export { StartedRides };
