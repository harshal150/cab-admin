import React, { FC, useState } from 'react';
import { KTSVG } from '../../../../_metronic/helpers';
import { Modal } from 'react-bootstrap';
import { AllInvoices } from './InvoiceModal';
import { Invoice } from '../core/_models';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

export interface Settlements {
  srNo: number;
  settlementId: string;
  utrNo: string;
  amount: number;

}



const SettlementHistoryList: FC = () => {
  // Hardcoded settlement data
  const settlements: any[] = [
    {
      srNo: 1,
      settlementId: 'SETTLEMENT-1',
      utrNo: 'UTR0001',
      amount: 5000,
    },
    {
      srNo: 2,
      settlementId: 'SETTLEMENT-2',
      utrNo: 'UTR0002',
      amount: 7000,
    },
    {
      srNo: 3,
      settlementId: 'SETTLEMENT-3',
      utrNo: 'UTR0003',
      amount: 10000,
    },
  ];

  const [showModal, setShowModal] = useState(false);
  const [selectedSettlementId, setSelectedSettlementId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showDateRangeModal, setShowDateRangeModal] = useState(false);
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [searchBy, setSearchBy] = useState<string>('payerName');
   const [currentPage, setCurrentPage] = useState<number>(1);
    const [itemsPerPage, setItemsPerPage] = useState<number>(10); 
      const [filteredInvoices, setFilteredInvoices] = useState<Settlements[]>([]);
        const [invoices, setInvoices] = useState<Settlements[]>([]);
      
    
    
  

  const handleViewInvoices = (settlementId: string) => {
    setSelectedSettlementId(settlementId);
    setShowModal(true);
  };

  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    filterData(query, statusFilter);
  };
  
  const handleStatusFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const type = e.target.value;
    setStatusFilter(type);
    filterData(searchQuery, type);
  };
  
  const filterData = (search: string, type: string) => {
    let filtered =  invoices;
  
    if (search) {
      filtered = filtered.filter((item:any) => {
        let fieldValue = '';
  
        
          fieldValue = item[searchBy as keyof Invoice]?.toString().toLowerCase() || '';
        
  
        return fieldValue.includes(search.toLowerCase());
      });
    }
  
    // Filter by payment type (only for Summary view)
    if (type !== 'all') {
      filtered = filtered.filter((invoice:any) => invoice.paymentType === type);
    }
  
     // Date filtering
     if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      filtered = filtered.filter((item:any) => {
        const date =  new Date(item.dateCreated); // For "Summary"
        return date >= start && date <= end;
      });
    }
  
    
      setFilteredInvoices(filtered);
  };

    // Export Invoices to Clipboard
  const handleCopyToClipboard = () => {
    const dataToCopy =  filteredInvoices;
    const text = dataToCopy
      .map((item) =>
         `Sr. No: ${item.srNo}, Settlement Id: ${item.settlementId}, UTR No: ${item.utrNo}, Amount: ${item.amount}`
      )
      .join('\n');
  
    navigator.clipboard.writeText(text).then(() => alert('Copied to clipboard!'));
  };

  
  

  
    // Export to PDF
  const handleExportToPDF = () => {
    const dataToExport =  filteredInvoices;
    const doc = new jsPDF();
    doc.text( 'Invoices', 10, 10);
  
    (doc as any).autoTable({
      head: [['Sr. No', 'Invoice No.', 'Payer Name', 'Registration No.', 'Date Created', 'Due Date', 'Invoice Amount', 'Amount Paid', 'Status', 'paymentType', 'email', 'invoiceCycle', 'mobileNo' ]],
      body: dataToExport.map((item) =>
        [item.srNo, item.settlementId, item.utrNo, item.amount]
      ),
    });
  
    doc.save('Settlements.pdf');
  };
  
  // Share functionality
  const handleShareReport = () => {
    const dataToShare = filteredInvoices;
    const reportText = dataToShare
      .map(
        (item) =>
          `Sr. No: ${item.srNo}, ${`Settlement Id: ${item.settlementId}, UTR No: ${item.utrNo}, Amount: ${item.amount}`
          }`
      )
      .join('\n');
  
    if (navigator.share) {
      navigator
        .share({
          title: 'Invoice Report',
          text: reportText,
        })
        .catch((error) => console.error('Error sharing:', error));
    } else {
      alert('Share API not supported. Please copy the text manually.');
    }
  };


   // Calculate paginated data
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredInvoices.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  
  
    const totalPages = Math.ceil(
      (filteredInvoices.length) / itemsPerPage
    );
  
    // Change page
    const handlePageChange = (pageNumber: number) => setCurrentPage(pageNumber);
  
    // Handle items per page change
    const handleItemsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      setItemsPerPage(Number(e.target.value));
      setCurrentPage(1); // Reset to first page on items per page change
    };
    
      // Handle opening and closing the date range modal
      const handleShowDateRangeModal = () => setShowDateRangeModal(true);
      const handleCloseDateRangeModal = () => setShowDateRangeModal(false);
  
     // Handle date change for start and end dates
     const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setStartDate(e.target.value);
    };
  
    const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setEndDate(e.target.value);
    };
  

  return (
    <>
      <div className="card card-flush">
        <div className="card-header">
          <h3 className="card-title">Settlement History</h3>
        </div>


        <div className="card-body py-3">
  {/* Responsive Cards */}
  <div className="row g-3">
    {/* Card 1: Settlement Amount */}
    <div className="col-lg-2 col-md-4 col-sm-12">
      <div className="card h-100" style={{ backgroundColor: '#d8f1ff', borderRadius: '8px', border: '1px dotted #336699' }}>
        <div className="card-body text-center">
          <div className="mb-3">
            <KTSVG path="/media/icons/duotune/ecommerce/ecm008.svg" className="svg-icon-3x text-primary" />
          </div>
          <h5 className="mb-1 fw-bold" style={{ color: '#336699' }}>₹9,006.71</h5>
          <p className="mb-0" style={{ color: '#666' }}>Settlement Amount</p>
        </div>
      </div>
    </div>

    {/* Card 2: Transaction Count */}
    <div className="col-lg-2 col-md-4 col-sm-12">
      <div className="card h-100" style={{ backgroundColor: '#f5f8fa', borderRadius: '8px', border: '1px dotted #336699' }}>
        <div className="card-body text-center">
          <div className="mb-3">
            <KTSVG path="/media/icons/duotune/finance/fin008.svg" className="svg-icon-3x text-dark" />
          </div>
          <h5 className="mb-1 fw-bold" style={{ color: '#224466' }}>5</h5>
          <p className="mb-0" style={{ color: '#666' }}>Transaction Count</p>
        </div>
      </div>
    </div>

    {/* Card 3: Payment Modes */}
    <div className="col-lg-8 col-md-8 col-sm-12">
      <div className="card h-100" style={{ backgroundColor: '#eaf4fc', borderRadius: '8px', border: '1px dotted #336699' }}>
        <div className="card-body">
          <h5 className="mb-3 fw-bold text-center" style={{ color: '#003366' }}>Payment Modes</h5>
          <div className="row text-center">
            {/* Netbanking */}
            <div className="col-4">
              <KTSVG path="/media/icons/duotune/technology/teh001.svg" className="svg-icon-2x text-primary" />
              <p className="mb-0 fw-bold" style={{ color: '#336699' }}>Netbanking</p>
              <p className="mb-0" style={{ color: '#666' }}>1</p>
            </div>

            {/* Mobile Wallet */}
            <div className="col-4">
              <KTSVG path="/media/icons/duotune/finance/fin003.svg" className="svg-icon-2x text-success" />
              <p className="mb-0 fw-bold" style={{ color: '#336699' }}>Mobile Wallet</p>
              <p className="mb-0" style={{ color: '#666' }}>3</p>
            </div>

            {/* Credit Card */}
            <div className="col-4">
              <KTSVG path="/media/icons/duotune/finance/fin001.svg" className="svg-icon-2x text-danger" />
              <p className="mb-0 fw-bold" style={{ color: '#336699' }}>Credit Card</p>
              <p className="mb-0" style={{ color: '#666' }}>1</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>



{/* Search, Export, Share, Custom Date Filter and Other Original Functionalities */}
              <div className="card-header align-items-center gap-2 flex-wrap">
              <div className="d-flex align-items-center flex-grow-1 flex-shrink-0">
              {/* Payment Type Filter */}
<div className="w-240px">
  <select
    className="form-select form-select-solid"
    data-control="select2"
    data-hide-search="true"
    data-placeholder="Filter by Payment Type"
    value={statusFilter}
    onChange={handleStatusFilterChange}
  >
    <option value="all">All services</option>
    <option value="Maintenance Payment">Maintenance Payment</option>
    <option value="Parking Payment">Parking Payment</option>
  </select>
</div>


      </div>

                {/* <div className="card-toolbar flex-row-fluid justify-content-end gap-5"> */}
                <div className="d-flex align-items-center flex-grow-1 flex-shrink-0">
  {/* Search Input */}
  <div className="position-relative">
    <span className="svg-icon svg-icon-1 position-absolute ms-4 my-1">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect opacity="0.5" x="17.0365" y="15.1223" width="8.15546" height="2" rx="1" transform="rotate(45 17.0365 15.1223)" fill="currentColor" />
        <path d="M11 19C6.55556 19 3 15.4444 3 11C3 6.55556 6.55556 3 11 3C15.4444 3 19 6.55556 19 11C19 15.4444 15.4444 19 11 19ZM11 5C7.53333 5 5 7.53333 5 11C5 14.4667 7.53333 17 11 17C14.4667 17 17 14.4667 17 11C17 7.53333 14.4667 5 11 5Z" fill="currentColor" />
      </svg>
    </span>
    <input
      type="text"
      className="form-control form-control-solid w-150px ps-14"
      placeholder="Search By" // Updated placeholder
      value={searchQuery}
      onChange={handleSearchChange}
      style={{
        borderTopRightRadius: 0, // Remove top-right border radius
        borderBottomRightRadius: 0, // Remove bottom-right border radius
        borderRight:'dotted #bbcddf 0.5px'
      }}
    />
  </div>

  {/* Dropdown for "Search By" */}
  <div className="w-150px" style={{ marginLeft: '-1px' }}> {/* Overlap to remove the gap */}
    <select
      className="form-select form-select-solid"
      value={searchBy}
      onChange={(e) => setSearchBy(e.target.value)}
      style={{
        borderTopLeftRadius: 0, // Remove top-left border radius
        borderBottomLeftRadius: 0, // Remove bottom-left border radius
      }}
    >
    <>
      <option value="settlementId">Settlement Id</option>
      <option value="utrNo">UTR No</option>
      <option value="amount">Amount</option>
      </>
    </select>
  </div>
</div>



                  {/* <div id="kt_ecommerce_report_returns_export" className="d-none"></div> */}
                  <div className="d-flex align-items-center flex-grow-1 flex-shrink-0">
       {/* Button to open the date range modal */}
       <div className="w-100 w-md-240px">
      <button onClick={handleShowDateRangeModal} className="btn btn-light-primary"  >
                    <KTSVG path='/media/icons/duotune/files/fil002.svg'  className='svg-icon-2'></KTSVG>
        Select Date Range
      </button>
      </div>
      {/* Date Range Modal */}
      {showDateRangeModal && (
        <div className="modal show d-block" tabIndex={-1} style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Select Date Range</h5>
                <button type="button" className="btn-close" aria-label="Close" onClick={handleCloseDateRangeModal}></button>
              </div>
              <div className="modal-body">
                <div className="d-flex flex-column gap-3">
                  <div>
                    <label className="form-label">Start Date</label>
                    <input
                      type="date"
                      className="form-control"
                      value={startDate}
                      onChange={handleStartDateChange}
                    />
                  </div>
                  <div>
                    <label className="form-label">End Date</label>
                    <input
                      type="date"
                      className="form-control"
                      value={endDate}
                      onChange={handleEndDateChange}
                    />
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={handleCloseDateRangeModal}>
                  Close
                </button>
                <button type="button" className="btn btn-primary" onClick={handleCloseDateRangeModal}  style={{backgroundColor: '#336699'
                  }}>
                  Save Dates
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Display selected date range after saving */}
      {startDate && endDate && (
        <div className="d-flex align-items-center flex-grow-1 flex-shrink-0">
        <div className="mt-3">
          <strong>Selected Range:</strong> {startDate} - {endDate}
        </div>
        </div>
      )}
      {/* Export and Share Buttons */}
      <div className="d-flex align-items-center flex-grow-1 flex-shrink-0 justify-content-end gap-2">
                    <button type="button" className="btn btn-light-primary" data-kt-menu-trigger="hover"
                      data-kt-menu-placement="bottom-end">
                      <span className="svg-icon svg-icon-2">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <rect opacity="0.3" x="12.75" y="4.25" width="12" height="2" rx="1"
                            transform="rotate(90 12.75 4.25)" fill="currentColor" />
                          <path
                            d="M12.0573 6.11875L13.5203 7.87435C13.9121 8.34457 14.6232 8.37683 15.056 7.94401C15.4457 7.5543 15.4641 6.92836 15.0979 6.51643L12.4974 3.59084C12.0996 3.14332 11.4004 3.14332 11.0026 3.59084L8.40206 6.51643C8.0359 6.92836 8.0543 7.5543 8.44401 7.94401C8.87683 8.37683 9.58785 8.34458 9.9797 7.87435L11.4427 6.11875C11.6026 5.92684 11.8974 5.92684 12.0573 6.11875Z"
                            fill="currentColor" />
                          <path opacity="0.3"
                            d="M18.75 8.25H17.75C17.1977 8.25 16.75 8.69772 16.75 9.25C16.75 9.80228 17.1977 10.25 17.75 10.25C18.3023 10.25 18.75 10.6977 18.75 11.25V18.25C18.75 18.8023 18.3023 19.25 17.75 19.25H5.75C5.19772 19.25 4.75 18.8023 4.75 18.25V11.25C4.75 10.6977 5.19771 10.25 5.75 10.25C6.30229 10.25 6.75 9.80228 6.75 9.25C6.75 8.69772 6.30229 8.25 5.75 8.25H4.75C3.64543 8.25 2.75 9.14543 2.75 10.25V19.25C2.75 20.3546 3.64543 21.25 4.75 21.25H18.75C19.8546 21.25 20.75 20.3546 20.75 19.25V10.25C20.75 9.14543 19.8546 8.25 18.75 8.25Z"
                            fill="currentColor" />
                        </svg>
                      </span>
                    </button>
                    <div id="kt_ecommerce_report_returns_export_menu"
                      className="menu menu-sub menu-sub-dropdown menu-column menu-rounded menu-gray-600 menu-state-bg-light-primary fw-semibold fs-7 w-200px py-4"
                      
                      data-kt-menu="true">
                      <div className="menu-item px-3">
                        <a href="#" onClick={handleCopyToClipboard} className="menu-link px-3" data-kt-ecommerce-export="copy">Copy to clipboard</a>
                      </div>
                      {/* <div className="menu-item px-3">
                        <a href="#" onClick={handleExportToExcel} className="menu-link px-3" data-kt-ecommerce-export="excel">Export as Excel</a>
                      </div>
                      <div className="menu-item px-3">
                        <a href="#" onClick={handleExportToCSV} className="menu-link px-3" data-kt-ecommerce-export="csv">Export as CSV</a>
                      </div> */}
                      <div className="menu-item px-3">
                        <a href="#" onClick={handleExportToPDF} className="menu-link px-3" data-kt-ecommerce-export="pdf">Export as PDF</a>
                      </div>
                    </div>
                    <div id="kt_ecommerce_report_shipping_export" className="d-none"></div>
                    <button type="button" className="btn btn-light-primary" onClick={handleShareReport}>
        <span className="svg-icon svg-icon-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-share-fill" viewBox="0 0 16 16">
            <path d="M11 2.5a2.5 2.5 0 1 1 .603 1.628l-6.718 3.12a2.5 2.5 0 0 1 0 1.504l6.718 3.12a2.5 2.5 0 1 1-.488.876l-6.718-3.12a2.5 2.5 0 1 1 0-3.256l6.718-3.12A2.5 2.5 0 0 1 11 2.5" />
          </svg>
        </span>
      </button>
                  </div>
                </div>
              </div>


        <div className="card-body pt-0">


          <div className="table-responsive">
            <table className="table table-row-dashed table-row-gray-300 align-middle gs-0 gy-4" id="kt_ecommerce_report_returns_table">
              <thead style={{backgroundColor:'#F1FAFF'}}>
                <tr className="fw-bold fs-7">
                <th className="min-w-50px ps-4 rounded-start text-nowrap">Sr. No.</th>
                <th className="min-w-100px text-nowrap">Settlement ID</th>
                  <th className="min-w-100px text-nowrap">UTR No</th>
                  <th className="min-w-100px text-nowrap">Amount</th>
                  <th className=" text-right rounded-end text-nowrap">View Invoices</th>
                </tr>
              </thead>
              <tbody>
              {settlements.length === 0 ? (
                          <tr>
                            <td colSpan={ 7} className="text-center">
                              No invoices available
                            </td>
                          </tr>
                        ) : (
                settlements.map((settlement) => (
                  <tr key={settlement.settlementId} className="fs-7">
                    <td className="ps-4 rounded-start">
                    <div className='d-flex align-items-center'>
                        <div className='d-flex justify-content-start flex-column'>
                          <span className='text-dark fw-bold text-hover-primary fs-7'>
                      {settlement.srNo}
                      </span>
                        </div>
                      </div>
                      </td>
                    <td>
                    <div className='d-flex align-items-center'>
                        <div className='d-flex justify-content-start flex-column'>
                          <span className='text-dark fw-bold text-hover-primary fs-7'>
                      {settlement.settlementId}
                      </span>
                        </div>
                      </div>
                      </td>
                    <td>
                    <div className='d-flex align-items-center'>
                        <div className='d-flex justify-content-start flex-column'>
                          <span className='text-dark fw-bold text-hover-primary fs-7'>
                      {settlement.utrNo}
                      </span>
                        </div>
                      </div>
                    </td>
                    <td>
                    <div className='d-flex align-items-center'>
                        <div className='d-flex justify-content-start flex-column'>
                          <span className='text-dark fw-bold text-hover-primary fs-7'>
                      ₹{settlement.amount}
                      </span>
                        </div>
                      </div>
                    </td>
                    <td>
                    <div className='d-flex align-items-center'>
                        <div className='d-flex justify-content-start flex-column'>
                          <span className='text-dark fw-bold text-hover-primary fs-7'>
                      <button
                        className="btn btn-icon btn-light-primary"
                        onClick={() => handleViewInvoices(settlement.settlementId)}
                      >
                        <KTSVG
                          path="/media/icons/duotune/files/fil003.svg"
                          className="svg-icon-2"
                        />
                      </button>
                      </span>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))
              )}
              </tbody>
            </table>

             {/* Pagination Controls */}
             <div className="d-flex justify-content-between align-items-center mt-3">
  <div className="d-flex align-items-center">
    <label className="me-2 mb-0">Items per page:</label>
    <select
      value={itemsPerPage}
      onChange={handleItemsPerPageChange}
      className="form-select form-select-sm"
      style={{ width: '70px' }}
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
        style={{ margin: '0 2px' }}
      >
        {i + 1}
      </button>
    ))}
  </div>
</div>
          </div>
        </div>
      </div>

      {/* Modal for viewing invoices */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="xl">
        <Modal.Header closeButton>
          <Modal.Title>Invoices for {selectedSettlementId}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <AllInvoices settlementId={selectedSettlementId || undefined} />
        </Modal.Body>
      </Modal>
    </>
  );
};


export default SettlementHistoryList;
