import React, { FC, useEffect, useState } from 'react';
import LoadingDataTables from '../../../../_metronic/partials/widgets/loader/LoadingDataTables';
import { KTSVG } from '../../../../_metronic/helpers';
// import { getIndustryList } from '../core/_requests';
import { useAuth } from '../../auth';
import { Invoice } from '../core/_models';
import jsPDF from 'jspdf';
import UpdateOutstanding from './UpdateOutstanding';
import InvoiceModal from './InvoiceModal';

const OutstandingList: FC = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [filteredInvoices, setFilteredInvoices] = useState<Invoice[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [showDateRangeModal, setShowDateRangeModal] = useState(false);
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [searchBy, setSearchBy] = useState<string>('payerName');
  const { auth } = useAuth();
  const [selectedInvoiceUpdate, setSelectedInvoiceUpdate] = useState<Invoice | null>(null); // Track the selected invoice for editing
  const [selectedInvoiceView, setSelectedInvoiceView] = useState<Invoice | null>(null); // Track the selected invoice for editing

   // useEffect(() => {
  //   const fetchIndustries = async () => {
  //     setIsLoading(true);
  //     try {
  //       if (auth?.access_token) {
  //         const industries = await getIndustryList(auth.access_token);
  //         setIndustryList(industries);
  //         setFilteredIndustryList(industries);
  //       } else {
  //         throw new Error('No access token available');
  //       }
  //     } catch (error) {
  //       console.error('Error fetching industries:', error);
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   };

  //   fetchIndustries();
  // }, [auth]);

  // Hardcoded data for the table
  useEffect(() => {
    const invoiceData: Invoice[] = Array.from({ length: 15 }, (_, i) => ({
      srNo: i + 1,
      invoiceNo: `STA27811122104371${i}11121359`,
      payerName: `Payer ${String.fromCharCode(65 + i)}`,
      registrationNo: `A-${1000 + i}`,
      dateCreated: `1${i}-Dec-202${1 + (i % 2)}`,
      dueDate: `1${i}-Dec-202${1 + (i % 2)}`,
      email: `payer${i}@example.com`,
      mobileNo: `987654321${i}`,
      status: i % 2 === 0 ? 'Paid' : 'Pending',
      invoiceAmount: `₹${500 + i * 100}.0`,
      amountPaid: i % 2 === 0 ? `₹${500 + i * 100}.0` : `₹0.0`,
      balance: `₹${(500 + i * 100) - (i % 2 === 0 ? 500 + i * 100 : 0)}.0`,
      paymentType: i % 2 === 0 ? 'Maintenance Payment' : 'Parking Payment',
      invoiceCycle: i % 2 === 0 ? 'Recurring' : 'One-Time',
      // New fields added here
    arrear: i % 2 === 0 ? 0 : 100, // Example: Arrear is 0 for even entries and 100 for odd
    interestOnArrears: 0,
    advancePayment: 0,
    modeOfPayment: 'Cash',
    amountBeingCollected: 0,
    paymentReferenceId: `REF-${i}`,
    remark: '',
    finalPayableAmount: 500 + i * 100, // This is calculated based on the fields

    }));
    setInvoices(invoiceData);
    setFilteredInvoices(invoiceData);
    setIsLoading(false);
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    filterInvoices(query, statusFilter);
  };

  const handleStatusFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const type = e.target.value;
    setStatusFilter(type);
    filterInvoices(searchQuery, type);
  };

  const filterInvoices = (search: string, type: string) => {
    let filtered = invoices;

    if (search) {
      filtered = filtered.filter((invoice) => {
        const fieldValue = invoice[searchBy as keyof Invoice]?.toString().toLowerCase() || '';
        return fieldValue.includes(search.toLowerCase());
      });
    }

    if (type !== 'all') {
      filtered = filtered.filter((invoice) => invoice.paymentType === type);
    }

    setFilteredInvoices(filtered);
  };

  const handleCopyToClipboard = () => {
    const text = filteredInvoices
      .map(
        (invoice) =>
          `${invoice.srNo}\t${invoice.payerName}\t${invoice.email}\t${invoice.mobileNo}\t${invoice.invoiceAmount}\t${invoice.amountPaid}\t${invoice.balance}`
      )
      .join('\n');

    navigator.clipboard.writeText(text).then(() => alert('Copied to clipboard!'));
  };



  const handleExportToPDF = () => {
    const doc = new jsPDF();
    doc.text('Outstanding List', 10, 10);
    (doc as any).autoTable({
      head: [['Sr. No', 'Payer Name', 'Email', 'Contact', 'Amount Due', 'Amount Paid', 'Balance']],
      body: filteredInvoices.map((invoice) => [
        invoice.srNo,
        invoice.payerName,
        invoice.email,
        invoice.mobileNo,
        invoice.invoiceAmount,
        invoice.amountPaid,
        invoice.balance,
      ]),
    });
    doc.save('Outstanding.pdf');
  };


  const handleShareReport = () => {
    const reportText = `Outstanding Report\n${filteredInvoices
      .map(
        (invoice) =>
          `Sr. No: ${invoice.srNo}, Payer Name: ${invoice.payerName}, Email: ${invoice.email}, Contact: ${invoice.mobileNo}, Amount Due: ${invoice.invoiceAmount}, Amount Paid: ${invoice.amountPaid}, Balance: ${invoice.balance}`
      )
      .join('\n')}`;

    if (navigator.share) {
      navigator
        .share({
          title: 'Outstanding Report',
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
  const currentItems = filteredInvoices.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (pageNumber: number) => setCurrentPage(pageNumber);

  const handleItemsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(filteredInvoices.length / itemsPerPage);


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

 const handleEditClick = (invoice: Invoice) => {
  setSelectedInvoiceUpdate(invoice); // Set the selected invoice when the Edit button is clicked
};

const handleCloseModal = () => {
  setSelectedInvoiceUpdate(null); // Close the modal
};

const handleSaveUpdatedInvoice = (updatedInvoice: Invoice) => {
  setInvoices((prevInvoices) =>
    prevInvoices.map((invoice) =>
      invoice.srNo === updatedInvoice.srNo ? { ...invoice, ...updatedInvoice } : invoice
    )
  );
  setFilteredInvoices((prevInvoices) =>
    prevInvoices.map((invoice) =>
      invoice.srNo === updatedInvoice.srNo ? { ...invoice, ...updatedInvoice } : invoice
    )
  );
  setSelectedInvoiceUpdate(null); // Close the modal after saving
};

const handleOpenInvoiceModal = (invoice: Invoice) => {
  setSelectedInvoiceView(invoice);
};

const handleCloseInvoiceModal = () => {
  setSelectedInvoiceView(null);
};

  return (
    <>
    <div className="app-main flex-column flex-row-fluid" id="kt_app_main" style={{ marginTop: '-26px', marginBottom: '-26px' }}>
    <div className="d-flex flex-column flex-column-fluid py-2" >
        <div id="kt_app_content" className="app-content flex-column-fluid">
        {/* <div id="kt_app_content_container" className="app-container container-xxl" ></div> */}
          <div className="card card-flush">
            <div className="card-header align-items-center py-3 gap-2 gap-md-12">
              <h3 className="card-title">Outstanding List</h3>
            </div>

             {/* Search, Export, Share, Custom Date Filter and Other Original Functionalities */}
            <div className="card-header align-items-center gap-2 flex-wrap">
              <div className="d-flex align-items-center flex-grow-1 flex-shrink-0">
                <div className="w-240px">
                     {/* Dropdown for Payment Type Filter */}
                  <select
                    className="form-select form-select-solid"
                    data-control="select2"
            data-hide-search="true"
            data-placeholder="Filter by Payment Type"
                    value={statusFilter}
                    onChange={handleStatusFilterChange}
                  >
                    <option value="all">All Payments</option>
                    <option value="Maintenance Payment">Maintenance Payment</option>
                    <option value="Parking Payment">Parking Payment</option>
                  </select>
                </div>
              </div>

              {/* <div className="card-toolbar flex-row-fluid justify-content-end gap-5"> */}
                <div className="d-flex align-items-center flex-grow-1 flex-shrink-0">
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
                      placeholder={`Search by`}
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
                  <div className="w-150px" style={{ marginLeft: '-1px' }}>
                    
                    <select
                      className="form-select form-select-solid"
                      value={searchBy}
                      onChange={(e) => setSearchBy(e.target.value)}
                      style={{
                        borderTopLeftRadius: 0, // Remove top-left border radius
                        borderBottomLeftRadius: 0, // Remove bottom-left border radius
                      }}
                    >
                      <option value="payerName">Payer Name</option>
                      <option value="email">Email</option>
                      <option value="mobileNo">Mobile No.</option>
                      <option value="invoiceNo">Invoice No.</option>
      <option value="registrationNo">Registration No.</option>
      <option value="invoiceAmount">Amount Due</option>
      <option value="amountPaid">Amount Paid</option>
      <option value="balance">Balance</option>
      <option value="status">Status</option>
      <option value="invoiceCycle">Invoice Cycle</option>
                    </select>
                  </div>
                  
                </div>

                {/* <div id="kt_ecommerce_report_returns_export" className="d-none"></div> */}
                <div className="d-flex align-items-center flex-grow-1 flex-shrink-0">
       {/* Button to open the date range modal */}
       <div className="w-100 w-md-240px">
      <button onClick={handleShowDateRangeModal} className="btn btn-light-primary">
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
            {/* Table Section */}
            <div className="card-body pt-0">
                {/* {isLoading ? (
                  <LoadingDataTables />
                ) : ( */}
                  <div className="table-responsive">
                    <table className="table table-row-dashed table-row-gray-300 align-middle gs-0 gy-4" id="kt_ecommerce_report_returns_table">
                      <thead style={{backgroundColor:'#F1FAFF'}}>
                        <tr className="fw-bold fs-7"> {/* Added fs-7 for smaller font size */}
                        
                      <th className="min-w-50px ps-4 rounded-start text-nowrap">Sr. No.</th>
                      <th className="min-w-100px text-nowrap">Payer Name</th>
                      <th className="min-w-150px text-nowrap">Payer Email</th>
                      <th className="min-w-100px text-nowrap">Payer Contact</th>
                      <th className="min-w-100px text-nowrap">Amount Due</th>
                      <th className="min-w-100px text-nowrap">Amount Paid</th>
                      <th className="min-w-100px text-nowrap">Balance</th>
                      <th className="text-right rounded-end text-nowrap">Action</th>
                    </tr>
                  </thead>
                  <tbody
                  // className="fw-semibold text-gray-600"
                  >
                    {currentItems.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="text-center">
                          No outstanding entries available
                        </td>
                      </tr>
                    ) : (
                      currentItems.map((invoice) => (
                        <tr key={invoice.srNo} className="fs-7">
                             
                    <td className="ps-4 rounded-start">
                              <div className='d-flex align-items-center'>
                        <div className='d-flex justify-content-start flex-column'>
                          <span className='text-dark fw-bold text-hover-primary fs-7'>
                                {invoice.srNo}
                                </span>
                        </div>
                      </div>
                                </td>
                                <td>
                              <div className='d-flex align-items-center'>
                        <div className='d-flex justify-content-start flex-column'>
                          <span className='text-dark fw-bold text-hover-primary fs-7'>
                          {invoice.payerName}
                              </span>
                        </div>
                      </div>
                      </td>
                      <td>
                              <div className='d-flex align-items-center'>
                        <div className='d-flex justify-content-start flex-column'>
                          <span className='text-dark fw-bold text-hover-primary fs-7'>
                            {invoice.email}
                            </span>
                        </div>
                      </div>
                      </td>
                            <td>
                              <div className='d-flex align-items-center'>
                        <div className='d-flex justify-content-start flex-column'>
                          <span className='text-dark fw-bold text-hover-primary fs-7'>
                            {invoice.mobileNo}
                            </span>
                        </div>
                      </div>
                      </td>
                          <td>
                              <div className='d-flex align-items-center'>
                        <div className='d-flex justify-content-start flex-column'>
                          <span className='text-dark fw-bold text-hover-primary fs-7'>
                          {invoice.invoiceAmount}
                              </span>
                        </div>
                      </div>
                      </td>
                      <td>
                              <div className='d-flex align-items-center'>
                        <div className='d-flex justify-content-start flex-column'>
                          <span className='text-dark fw-bold text-hover-primary fs-7'>
                          {invoice.amountPaid}
                              </span>
                        </div>
                      </div>
                      </td>
                      <td>
                              <div className='d-flex align-items-center'>
                        <div className='d-flex justify-content-start flex-column'>
                          <span className='text-dark fw-bold text-hover-primary fs-7'>
                            {invoice.balance}
                            </span>
                        </div>
                      </div>
                      </td>
                          <td>
                            <div className="d-flex justify-content-start me-4 ">
                              <button className="btn btn-icon btn-light-primary btn-sm me-2"
                              onClick={() => handleEditClick(invoice)}>
                                <KTSVG path="/media/icons/duotune/art/art005.svg" className="svg-icon-2" />
                              </button>
                              <button
                    className="btn btn-icon btn-light-primary btn-sm me-4"
                    onClick={() => handleOpenInvoiceModal(invoice)} // Open the invoice modal
                  >
                    <KTSVG path="/media/icons/duotune/files/fil003.svg" className="svg-icon-2" />
                  </button>
                            </div>
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
               {/* // )} */}
            </div>
            </div>

            {/* Modal for updating outstanding invoice */}
      {selectedInvoiceUpdate && (
        <UpdateOutstanding
          invoice={selectedInvoiceUpdate}
          onClose={handleCloseModal}
          onSave={handleSaveUpdatedInvoice}
        />
      )}


      {/* Invoice Modal */}
      {selectedInvoiceView && (
        <InvoiceModal
          show={!!selectedInvoiceView}
          handleClose={handleCloseInvoiceModal}
          invoiceData={selectedInvoiceView}
        />
      )}
          
        </div>
      </div>
    </div>
    </>
  );
};

export { OutstandingList };
