import React, { FC, useState, useEffect } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';
import { BACKEND_DOMAIN } from '../../../../apiEndpoints';

interface Ride {
  rideId: number;
  userName: string;
  userContact: string;
  driverName: string;
  driverNumber: string;
  rideStatus: string;
  paidAmount: number;
  startReading: number;
  endReading: number;
  readingDifference: number;
  rate: number;
  transactionId: string;
  rideDate: string;
  cabName: string;
}

const CompletedRides: FC = () => {
  const [rides, setRides] = useState<Ride[]>([]);
  const [filteredRides, setFilteredRides] = useState<Ride[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [fromDate, setFromDate] = useState<string>('');
  const [toDate, setToDate] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);

  useEffect(() => {
    const fetchRides = async () => {
      try {
        const response = await axios.get(`${BACKEND_DOMAIN}/api/transactions`);
        const filteredData = response.data.filter(
          (ride: any) =>
            ride.booking_status === 'success' &&
            ride.status === 'success' &&
            ride.ride_status === 'ended'
        );

        const mappedRides = filteredData.map((ride: any) => ({
          rideId: ride.id,
          cabName: ride.car_name,
          userName: ride.user_name,
          userContact: ride.passenger_contact,
          driverName: ride.driver_name,
          driverNumber: ride.driver_mobile_no,
          rideStatus: ride.status,
          paidAmount: parseFloat(ride.amount),
          startReading: ride.start_reading,
          endReading: ride.end_reading,
          readingDifference: ride.reading_difference,
          rate: ride.rate,
          transactionId: ride.transaction_id,
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
    filterRides(query, fromDate, toDate);
  };

  const handleApplyFilter = () => {
    filterRides(searchQuery, fromDate, toDate);
  };

  const filterRides = (search: string, from: string, to: string) => {
    let filtered = rides;

    if (search) {
      filtered = filtered.filter((ride) =>
        ride.userName.toLowerCase().includes(search)
      );
    }

    if (from && to) {
      const fromDate = new Date(from);
      const toDate = new Date(to);
      filtered = filtered.filter((ride) => {
        const rideDate = new Date(ride.rideDate);
        return rideDate >= fromDate && rideDate <= toDate;
      });
    }

    setFilteredRides(filtered);
  };

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(filteredRides);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Completed Rides');
    XLSX.writeFile(wb, 'Completed_Rides.xlsx');
  };

  const calculateTotalPaidAmount = () => {
    return filteredRides.reduce((total, ride) => total + (ride.paidAmount || 0), 0).toFixed(2);
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


  const handlePageChange = (pageNumber: number) => setCurrentPage(pageNumber);

    const handleItemsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      setItemsPerPage(Number(e.target.value));
      setCurrentPage(1);
    };
  return (
    <div className="app-main flex-column flex-row-fluid" id="kt_app_main" style={{ marginTop: '-26px', marginBottom: '-26px' }}>
      <div className="d-flex flex-column flex-column-fluid py-2">
        <div id="kt_app_content" className="app-content flex-column-fluid">
          <div className="card card-flush">
            <div className="card-header align-items-center py-3 gap-2 gap-md-12">
              <h3 className="card-title">Completed Rides</h3>
              <button className="btn btn-primary ms-auto" onClick={exportToExcel}>
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
                  placeholder="From Date"
                />
                <input
                  type="date"
                  className="form-control form-control-solid ms-2"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                  placeholder="To Date"
                />
                <button className="btn btn-primary ms-3" onClick={handleApplyFilter}>
                  Apply
                </button>
              </div>
              <div className="position-relative ms-auto">
                <input
                  type="text"
                  className="form-control form-control-solid w-[150px] ps-4"
                  placeholder="Search by Passenger Name"
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
                      <th className="min-w-50px ps-4 rounded-start">Ride ID</th>
                      <th className="min-w-100px">Cab Name</th>
                      <th className="min-w-100px">Driver Name</th>
                      <th className="min-w-100px">Driver Number</th>
                      <th className="min-w-100px">Passenger Name</th>
                      <th className="min-w-100px">Passenger Contact</th>
                      <th className="min-w-100px">Ride Date</th>
                      <th className="min-w-100px">Start Reading</th>
                      <th className="min-w-100px">End Reading</th>
                      <th className="min-w-100px">Reading Difference</th>
                      <th className="min-w-100px">Rate</th>
                      <th className="min-w-100px">Total Paid Amount</th>
                      <th className="min-w-100px">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentItems.length === 0 ? (
                      <tr>
                        <td colSpan={13} className="text-center">
                          No rides available
                        </td>
                      </tr>
                    ) : (
                      currentItems.map((ride) => (
                        <tr key={ride.rideId}>
                          <td className="text-dark fw-bold text-hover-primary ps-4 rounded-start">{ride.rideId}</td>
                          <td className="text-dark fw-bold text-hover-primary">{ride.cabName}</td>
                          <td className="text-dark fw-bold text-hover-primary">{ride.driverName}</td>
                          <td className="text-dark fw-bold text-hover-primary">{ride.driverNumber}</td>
                          <td className="text-dark fw-bold text-hover-primary">{ride.userName}</td>
                          <td className="text-dark fw-bold text-hover-primary">{ride.userContact}</td>
                          <td className="text-dark fw-bold text-hover-primary">{formatDate(ride.rideDate)}</td>
                          <td className="text-dark fw-bold text-hover-primary">{ride.startReading}</td>
                          <td className="text-dark fw-bold text-hover-primary">{ride.endReading}</td>
                          <td className="text-dark fw-bold text-hover-primary">{ride.readingDifference}</td>
                          <td className="text-dark fw-bold text-hover-primary">₹{ride.rate} /km</td>
                          <td className="text-dark fw-bold text-hover-primary">₹{ride.paidAmount}</td>
                          <td className=" "> <span className='badge-success p-1 rounded'>{ride.rideStatus}</span></td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
                <hr />
                <div className="d-flex justify-content-end align-items-center mt-3">
  <div>
    <strong>Total Paid Amount: ₹{calculateTotalPaidAmount()}</strong>
  </div>
</div>
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
