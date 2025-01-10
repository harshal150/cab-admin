import React, { FC, useState, useEffect } from 'react';

interface MISReport {
  reportId: number;
  reportName: string;
  generatedOn: string;
  totalRides: number;
  completedRides: number;
  cancelledRides: number;
  totalRevenue: number;
  averageFare: number;
}

const MISReports: FC = () => {
  const [reports, setReports] = useState<MISReport[]>([]);
  const [filteredReports, setFilteredReports] = useState<MISReport[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);

  useEffect(() => {
    const reportData: MISReport[] = Array.from({ length: 10 }, (_, i) => ({
      reportId: i + 1,
      reportName: `Report ${i + 1}`,
      generatedOn: `2023-12-${i % 31 + 1} 10:${i % 60}:00`,
      totalRides: (i + 1) * 10,
      completedRides: (i + 1) * 8,
      cancelledRides: (i + 1) * 2,
      totalRevenue: (i + 1) * 1000,
      averageFare: 125 + i * 10,
    }));
    setReports(reportData);
    setFilteredReports(reportData);
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    filterReports(query);
  };

  const filterReports = (search: string) => {
    let filtered = reports;

    if (search) {
      filtered = filtered.filter(
        (report) => report.reportName.toLowerCase().includes(search)
      );
    }

    setFilteredReports(filtered);
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

  const totalPages = Math.ceil(filteredReports.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredReports.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div className="app-main flex-column flex-row-fluid" id="kt_app_main" style={{ marginTop: '-26px', marginBottom: '-26px' }}>
      <div className="d-flex flex-column flex-column-fluid py-2">
        <div id="kt_app_content" className="app-content flex-column-fluid">
          <div className="card card-flush">
            <div className="card-header align-items-center py-3 gap-2 gap-md-12">
              <h3 className="card-title">MIS Reports</h3>
            </div>
            <div className="card-header align-items-center gap-2 flex-wrap">
              <div className="d-flex align-items-center flex-grow-1 flex-shrink-0">
                <div className="position-relative ms-3">
                  <input
                    type="text"
                    className="form-control form-control-solid w-[150px] ps-4"
                    placeholder="Search by Report Name"
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
                      <th className="min-w-50px ps-4 rounded-start">Report ID</th>
                      <th className="min-w-150px">Report Name</th>
                      <th className="min-w-150px">Generated On</th>
                      <th className="min-w-100px">Total Rides</th>
                      <th className="min-w-100px">Completed Rides</th>
                      <th className="min-w-100px">Cancelled Rides</th>
                      <th className="min-w-150px">Total Revenue</th>
                      <th className="min-w-150px">Average Fare</th>
                      <th className="min-w-100px text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentItems.length === 0 ? (
                      <tr>
                        <td colSpan={9} className="text-center">
                          No reports available
                        </td>
                      </tr>
                    ) : (
                      currentItems.map((report) => (
                        <tr key={report.reportId} className="fs-7">
                          <td className="ps-4">
                            <span className="text-dark fw-bold text-hover-primary">{report.reportId}</span>
                          </td>
                          <td>
                            <span className="text-dark fw-bold text-hover-primary">{report.reportName}</span>
                          </td>
                          <td>
                            <span className="text-dark fw-bold text-hover-primary">{formatDateTime(report.generatedOn)}</span>
                          </td>
                          <td>
                            <span className="text-dark fw-bold text-hover-primary">{report.totalRides}</span>
                          </td>
                          <td>
                            <span className="text-dark fw-bold text-hover-primary">{report.completedRides}</span>
                          </td>
                          <td>
                            <span className="text-dark fw-bold text-hover-primary">{report.cancelledRides}</span>
                          </td>
                          <td>
                            <span className="text-dark fw-bold text-hover-primary">₹{report.totalRevenue}</span>
                          </td>
                          <td>
                            <span className="text-dark fw-bold text-hover-primary">₹{report.averageFare}</span>
                          </td>
                          <td className="text-center">
                            <button className="btn btn-light-primary btn-sm me-2">View</button>
                            <button className="btn btn-light-success btn-sm">Download</button>
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

export { MISReports };
