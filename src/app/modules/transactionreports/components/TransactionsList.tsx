import React, { FC, useEffect, useState } from 'react';
import LoadingDataTables from '../../../../_metronic/partials/widgets/loader/LoadingDataTables';
import { KTSVG } from '../../../../_metronic/helpers';
// import { getIndustryList } from '../core/_requests';
import { useAuth } from '../../auth';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import UpdateInvoice from './UpdateInvoice'; // Adjust the path accordingly
import { Invoice } from '../core/_models';


const AllTransactions: FC = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [detailedData, setDetailedData] = useState<any[]>([]); // New state for detailed data
  const [filteredInvoices, setFilteredInvoices] = useState<Invoice[]>([]); 
  const [filteredDetailedData, setFilteredDetailedData] = useState<any[]>([]); // Filtered detailed data
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(10); // Default items per page
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [showDateRangeModal, setShowDateRangeModal] = useState(false);
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const { auth } = useAuth(); // Access the auth context
  const [searchBy, setSearchBy] = useState<string>('payerName');
  const [isDetailedView, setIsDetailedView] = useState(false); // State for toggling between views
  const [selectedInvoice, setSelectedInvoice] = useState<any | null>(null);
const [showUpdateModal, setShowUpdateModal] = useState<boolean>(false);


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
    invoiceAmount: `${500 + i * 100}.0`,
    amountPaid: i % 2 === 0 ? `${500 + i * 100}.0` : `0.0`,
    status: i % 2 === 0 ? 'Paid' : 'Pending',
    paymentType: i % 2 === 0 ? 'Maintenance Payment' : 'Parking Payment',
    email: `payer${i}@example.com`,
  invoiceCycle: i % 2 === 0 ? 'Recurring' : 'One-Time',
  mobileNo: `987654321${i}`,
  lateFeeAmount: i % 2 === 0 ? `50.0` : `100.0`,  // Ensure the lateFeeAmount is here
  }));

  const detailedData = Array.from({ length: 15 }, (_, i) => ({
    srNo: i + 1,
    firstName: `FirstName${i}`,
    lastName: `LastName${i}`,
    contactNumber: `98765432${i % 10}`,
    emailId: `user${i}@example.com`,
    status: i % 2 === 0 ? 'Paid' : 'Pending',
    // Include all fields for filtering
    payerName: `Payer ${String.fromCharCode(65 + i)}`, // For mapping to search
    invoiceNo: `STA27811122104371${i}11121359`,
    registrationNo: `A-${1000 + i}`,
    invoiceAmount: `${500 + i * 100}.0`,
    invoiceCycle: i % 2 === 0 ? 'Recurring' : 'One-Time',
    paymentType: i % 2 === 0 ? 'Maintenance Payment' : 'Parking Payment', // Hidden but needed for filters
  }));

  setInvoices(invoiceData);
  setFilteredInvoices(invoiceData);
  setDetailedData(detailedData);
  setFilteredDetailedData(detailedData);
  setIsLoading(false);
}, []);

const handleToggleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  // Reset filters when toggling between views
  setIsDetailedView(e.target.checked);

  // Reset all filters to default values when changing the view
  setSearchQuery('');  // Clear the search query
  setStatusFilter('all');  // Reset payment type filter
  setStartDate('');  // Clear start date filter
  setEndDate('');  // Clear end date filter

  // Reset the filtered data
  setFilteredInvoices(invoices);  // Reset summary data
  setFilteredDetailedData(detailedData);  // Reset detailed data
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
  let filtered = isDetailedView ? detailedData : invoices;

  if (search) {
    filtered = filtered.filter((item) => {
      let fieldValue = '';

      if (isDetailedView) {
        switch (searchBy) {
          case 'payerName':
            fieldValue = `${item.firstName?.toLowerCase() || ''} ${item.lastName?.toLowerCase() || ''}`;
            break;
          case 'email':
            fieldValue = item.emailId?.toLowerCase() || '';
            break;
          default:
            fieldValue = item[searchBy]?.toLowerCase() || '';
        }
      } else {
        fieldValue = item[searchBy as keyof Invoice]?.toString().toLowerCase() || '';
      }

      return fieldValue.includes(search.toLowerCase());
    });
  }

  // Filter by payment type (only for Summary view)
  if (type !== 'all') {
    filtered = filtered.filter((invoice) => invoice.paymentType === type);
  }

   // Date filtering
   if (startDate && endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    filtered = filtered.filter((item) => {
      const date = isDetailedView
        ? new Date(item.someDateField) // Replace `someDateField` with the actual date field in "Detailed"
        : new Date(item.dateCreated); // For "Summary"
      return date >= start && date <= end;
    });
  }

  if (isDetailedView) {
    setFilteredDetailedData(filtered);
  } else {
    setFilteredInvoices(filtered);
  }
};

  

  // Export Invoices to Clipboard
const handleCopyToClipboard = () => {
  const dataToCopy = isDetailedView ? filteredDetailedData : filteredInvoices;
  const text = dataToCopy
    .map((item) =>
      isDetailedView
        ? `Sr. No: ${item.srNo}, First Name: ${item.firstName}, Last Name: ${item.lastName}, Contact Number: ${item.contactNumber}, Email ID: ${item.emailId}, Status: ${item.status}`
        : `Sr. No: ${item.srNo}, Invoice No: ${item.invoiceNo}, Payer Name: ${item.payerName}, Registration No: ${item.registrationNo}, Date Created: ${item.dateCreated}, Due Date: ${item.dueDate},  Invoice Amount: ${item.invoiceAmount}, Amount Paid: ${item.amountPaid}, Status: ${item.status}, paymentType: ${item.paymentType}, email: ${item.email}, invoiceCycle: ${item.invoiceCycle}, mobileNo: ${item.mobileNo}`
    )
    .join('\n');

  navigator.clipboard.writeText(text).then(() => alert('Copied to clipboard!'));
};



  // Export functionality
  // Export to Excel

  // Export to CSV


  // Export to PDF
const handleExportToPDF = () => {
  const dataToExport = isDetailedView ? filteredDetailedData : filteredInvoices;
  const doc = new jsPDF();
  doc.text(isDetailedView ? 'Detailed Data' : 'Invoices', 10, 10);

  (doc as any).autoTable({
    head: isDetailedView
      ? [['Sr. No', 'First Name', 'Last Name', 'Contact Number', 'Email ID', 'Status']]
      : [['Sr. No', 'Invoice No.', 'Payer Name', 'Registration No.', 'Date Created', 'Due Date', 'Invoice Amount', 'Amount Paid', 'Status', 'paymentType', 'email', 'invoiceCycle', 'mobileNo' ]],
    body: dataToExport.map((item) =>
      isDetailedView
        ? [item.srNo, item.firstName, item.lastName,item.contactNumber ,  item.emailId, item.status]
        : [item.srNo, item.invoiceNo, item.payerName, item.registrationNo,item.dateCreated, item.dueDate, item. invoiceAmount, item.amountPaid, item.status, item.paymentType, item.email, item.invoiceCycle, item.mobileNo]
    ),
  });

  doc.save(isDetailedView ? 'Detailed_Data.pdf' : 'Invoices.pdf');
};

// Share functionality
const handleShareReport = () => {
  const dataToShare = isDetailedView ? filteredDetailedData : filteredInvoices;
  const reportText = dataToShare
    .map(
      (item) =>
        `Sr. No: ${item.srNo}, ${
          isDetailedView
            ? `First Name: ${item.firstName}, Last Name: ${item.lastName}, Email ID: ${item.emailId}`
            : `Invoice No: ${item.invoiceNo}, Payer Name: ${item.payerName}, Amount: ${item.invoiceAmount}`
        }`
    )
    .join('\n');

  if (navigator.share) {
    navigator
      .share({
        title: isDetailedView ? 'Detailed Report' : 'Invoice Report',
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
  const currentItems = isDetailedView
  ? filteredDetailedData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
  : filteredInvoices.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);


  const totalPages = Math.ceil(
    (isDetailedView ? filteredDetailedData.length : filteredInvoices.length) / itemsPerPage
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

  const handleEditClick = (invoice: any) => {
    setSelectedInvoice(invoice); // Set the selected invoice for editing
    setShowUpdateModal(true); // Show the modal
  };
  
  const handleUpdateInvoice = (updatedInvoice: any) => {
    // Update the invoice in the table
    setInvoices((prevInvoices) =>
      prevInvoices.map((invoice) =>
        invoice.srNo === updatedInvoice.srNo ? updatedInvoice : invoice
      )
    );
    setShowUpdateModal(false); // Close the modal
  };
  

  return (
    <>
      <div className="app-main flex-column flex-row-fluid" id="kt_app_main" style={{ marginTop: '-26px', marginBottom: '-26px' }}>
        <div className="d-flex flex-column flex-column-fluid py-2" >
          <div id="kt_app_content" className="app-content flex-column-fluid" >
            {/* <div id="kt_app_content_container" className="app-container container-xxl" ></div> */}
            <div className="card card-flush" 
            // style={{ backgroundColor: '#F2FAFF'}}
            >
               {/* Create Invoice Button */}
               <div className="card-header align-items-center py-3 gap-2 gap-md-12">
                <h3 className="card-title">Transactions</h3>
                <div className="d-flex gap-3 align-items-center me-2">
      {/* Toggle switch with "Summary" and "Detailed" text */}
      <label
        htmlFor="toggle"
        style={{
          position: 'relative',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '165px', // Adjust width to fit your design
          height: '32px',
          borderRadius: '10px',
          // border: '1px solid #336699',
          backgroundColor: '#f5f8fa', // Light blue background for consistency
          cursor: 'pointer',
          fontWeight: '500',
          fontSize: '13px',
          color: '#336699', // Default text color
          transition: 'width 0.3s, height 0.3s', // Smooth transition for responsiveness
        }}
      >
        {/* Text on the left side (Summary) */}
        <span
          style={{
            flex: 1,
            textAlign: 'center',
            color: isDetailedView ? 'grey' : '#224466', // Dynamic color
            transition: 'color 0.3s',
            zIndex: 2, // Ensure text is above the toggle background
          }}
        >
          Summary
        </span>

        {/* Text on the right side (Detailed) */}
        <span
          style={{
            flex: 1,
            textAlign: 'center',
            color: isDetailedView ? '#224466' : 'grey', // Dynamic color
            transition: 'color 0.3s',
            zIndex: 2, // Ensure text is above the toggle background
          }}
        >
          Detailed
        </span>

        {/* The hidden checkbox for toggle functionality */}
        <input
          type="checkbox"
          id="toggle"
          style={{ display: 'none' }}
          checked={isDetailedView}
          onChange={handleToggleChange}
        />

        {/* The sliding toggle background */}
        <div
          style={{
            content: "''",
            position: 'absolute',
            left: isDetailedView ? 'calc(50% + 2px)' : '0px', // Adjust for smooth transition
            height: '32px',
            width: 'calc(50%)', // Center the slider
            backgroundColor: '#d8f1ff', // Blue background for the toggle
            borderRadius: isDetailedView ? '0px 8px 8px 0px' : '8px 0px 0px 8px', // Adjusted for each side
            transition: 'all 0.3s',
            zIndex: 1, // Below the text
          }}
        ></div>
      </label>

      {/* Media Queries for Smaller Devices */}
      <style>
        {`
          @media (max-width: 768px) {
            label {
              width: 150px; /* Adjust width for small screens */
              height: 30px; /* Adjust height for small screens */
            }

            label span {
              font-size: 12px; /* Smaller text on small screens */
            }

            label .toggle-background {
              height: 30px; /* Adjust toggle background height */
            }
          }
        `}
      </style>
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
    <option value="all">All Services</option>
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
      {isDetailedView ? (
    <>
      <option value="firstName">First Name</option>
      <option value="lastName">Last Name</option>
      <option value="emailId">Email ID</option>
      <option value="status">Status</option>
      <option value="invoiceNo">Invoice No.</option>
    </>
  ) : (
    <>
      <option value="payerName">Payer Name</option>
      <option value="invoiceNo">Invoice No.</option>
      <option value="registrationNo">Registration No.</option>
      <option value="invoiceAmount">Invoice Amount</option>
      <option value="status">Status</option>
      <option value="email">Email</option>
      <option value="invoiceCycle">Invoice Cycle</option>
      <option value="mobileNo">Mobile No.</option>
      </>
  )}
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

              {/* Table Section */}
              <div className="card-body pt-0" >
                {/* {isLoading ? (
                  <LoadingDataTables />
                ) : ( */}
                  <div className="table-responsive">
                    <table className="table table-row-dashed table-row-gray-300 align-middle gs-0 gy-4" id="kt_ecommerce_report_returns_table">
                      <thead style={{backgroundColor:'#F1FAFF'}}>
                        <tr className="fw-bold fs-7"> {/* Added fs-7 for smaller font size */}
                        {isDetailedView ? (
                          <>
                            <th className="min-w-50px ps-4 rounded-start text-nowrap">Sr. No.</th>
                            <th className="min-w-100px text-nowrap">First Name</th>
                            <th className="min-w-100px text-nowrap">Last Name</th>
                            <th className="min-w-100px text-nowrap">Contact Number</th>
                            <th className="min-w-100px text-nowrap">Email Id</th>
                            <th className="min-w-100px text-nowrap">Status</th>
                            <th className=" text-right rounded-end text-nowrap">View Documents</th>
                          </>
                        ) : (
                          <>
                          <th className="min-w-50px ps-4 rounded-start text-nowrap">Sr. No.</th>
                          <th className="min-w-100px text-nowrap">Invoice No.</th>
                          <th className="min-w-100px text-nowrap">Payer Name</th>
                          <th className="min-w-100px text-nowrap">Registration No.</th>
                          <th className="min-w-100px text-nowrap">Date Created</th>
                          <th className="min-w-100px text-nowrap">Due Date</th>
                          <th className="min-w-50px text-nowrap">Invoice Amount</th>
                          <th className="min-w-90px text-nowrap">Amount Paid</th>
                          <th className="min-w-50px text-nowrap">Status</th>
                          <th className=" text-right rounded-end text-nowrap">Action</th>
                          </>
                        )}
                        </tr>
                      </thead>
                      <tbody 
                      // className="fw-semibold text-gray-600"
                      >
                        {currentItems.length === 0 ? (
                          <tr>
                            <td colSpan={isDetailedView ? 7 : 10} className="text-center">
                              No invoices available
                            </td>
                          </tr>
                        ) : (
                          currentItems.map((item, index) => (
                            <tr key={index} className="fs-7"> {/* Added fs-7 for table rows */}
                              {/* Summary View */}
        {!isDetailedView && (
          <>
                              <td className="ps-4 rounded-start">
                              <div className='d-flex align-items-center'>
                        <div className='d-flex justify-content-start flex-column'>
                          <span className='text-dark fw-bold text-hover-primary fs-7'>
                                {item.srNo}
                                </span>
                        </div>
                      </div>
                                </td>
                              <td>
                              <div className='d-flex align-items-center'>
                        <div className='d-flex justify-content-start flex-column'>
                          <span className='text-dark fw-bold text-hover-primary fs-7'>
                          {item.invoiceNo}&nbsp;
                          <KTSVG path='/media/icons/duotune/arrows/arr095.svg' className='svg-icon-2' />
                              </span>
                        </div>
                      </div>
                              </td>
                              <td>
                              <div className='d-flex align-items-center'>
                        <div className='d-flex justify-content-start flex-column'>
                          <span className='text-dark fw-bold text-hover-primary fs-7'>
                          {item.payerName}
                              </span>
                        </div>
                      </div>
                      </td>
                      <td>
                              <div className='d-flex align-items-center'>
                        <div className='d-flex justify-content-start flex-column'>
                          <span className='text-dark fw-bold text-hover-primary fs-7'>
                          {item.registrationNo}
                              </span>
                        </div>
                      </div>
                      </td>
                      <td>
                              <div className='d-flex align-items-center'>
                        <div className='d-flex justify-content-start flex-column'>
                          <span className='text-dark fw-bold text-hover-primary fs-7'>
                          {item.dateCreated}
                              </span>
                        </div>
                      </div>
                      </td>
                      <td>
                              <div className='d-flex align-items-center'>
                        <div className='d-flex justify-content-start flex-column'>
                          <span className='text-dark fw-bold text-hover-primary fs-7'>
                          {item.dueDate}
                              </span>
                        </div>
                      </div>
                      </td>
                      <td>
                              <div className='d-flex align-items-center'>
                        <div className='d-flex justify-content-start flex-column'>
                          <span className='text-dark fw-bold text-hover-primary fs-7'>
                          ₹{item.invoiceAmount}
                              </span>
                        </div>
                      </div>
                      </td>
                      <td>
                              <div className='d-flex align-items-center'>
                        <div className='d-flex justify-content-start flex-column'>
                          <span className='text-dark fw-bold text-hover-primary fs-7'>
                          ₹{item.amountPaid}
                              </span>
                        </div>
                      </div>
                      </td>
                              <td>
                              <div className='d-flex align-items-center'>
                        <div className='d-flex justify-content-start flex-column'>
                        <span className={`badge badge-light-${
                          item.status === 'Paid' ? 'success' : 'warning'
                        } fw-bolder fs-8 px3 py-2 ms-2`}>
                            {item.status
                            //  === 'Paid' ? 'Paid' : 'Pending'
                             }
                              </span>
                        </div>
                      </div>
                      </td>
                      <td>
                              <div className="dropdown me-4">
                              <button
                              type="button"
  className="btn btn-sm btn-light-primary me-2"
  data-kt-menu-trigger="hover"
  // data-bs-toggle="dropdown" 
  //  data-kt-menu-placement="bottom-end"
>
  Actions
</button>
<div id="kt_ecommerce_report_returns_export_menu"
                      className="menu menu-sub menu-sub-dropdown menu-column menu-rounded menu-gray-600 menu-state-bg-light-primary fw-semibold fs-7 w-200px py-4"
                      
                      data-kt-menu="true">

<div className="menu-item px-3">
  <a
    className="menu-link px-3"
    href="#"
    style={{ padding: '5px 20px', fontSize: '14px' }}
    onClick={() => handleEditClick(item)} // Pass the item data to the handler
  >
    Edit
  </a>
  </div>

<div className="menu-item px-3">
    <a className="menu-link px-3" href="#" style={{ padding: '5px 20px', fontSize: '14px' }}>
      Send Mail
    </a>
    </div>
  <div className="menu-item px-3">
    <a className="menu-link px-3" href="#" style={{ padding: '5px 20px', fontSize: '14px' }}>
      Copy Link
    </a>
    </div>
  <div className="menu-item px-3">
    <a className="menu-link px-3 text-danger" href="#" style={{ padding: '5px 20px', fontSize: '14px' }}>
      Expire Link
    </a>
    </div></div>

                              </div>
                            </td>
                             </>
                            )}
                            {isDetailedView && (
          <>
             <td className="ps-4 rounded-start">
                              <div className='d-flex align-items-center'>
                        <div className='d-flex justify-content-start flex-column'>
                          <span className='text-dark fw-bold text-hover-primary fs-7'>
                                {item.srNo}
                                </span>
                        </div>
                      </div>
                                </td>
                                <td>
                              <div className='d-flex align-items-center'>
                        <div className='d-flex justify-content-start flex-column'>
                          <span className='text-dark fw-bold text-hover-primary fs-7'>
                          {item.firstName}
                              </span>
                        </div>
                      </div>
                      </td>
                      <td>
                              <div className='d-flex align-items-center'>
                        <div className='d-flex justify-content-start flex-column'>
                          <span className='text-dark fw-bold text-hover-primary fs-7'>
                          {item.lastName}
                              </span>
                        </div>
                      </div>
                      </td>
                      <td>
                              <div className='d-flex align-items-center'>
                        <div className='d-flex justify-content-start flex-column'>
                          <span className='text-dark fw-bold text-hover-primary fs-7'>
                          {item.contactNumber}
                              </span>
                        </div>
                      </div>
                      </td>
                      <td>
                              <div className='d-flex align-items-center'>
                        <div className='d-flex justify-content-start flex-column'>
                          <span className='text-dark fw-bold text-hover-primary fs-7'>
                          {item.emailId}
                              </span>
                        </div>
                      </div>
                      </td>
                      <td>
                              <div className='d-flex align-items-center'>
                        <div className='d-flex justify-content-start flex-column'>
                        <span className={`badge badge-light-${
                          item.status === 'Paid' ? 'success' : 'warning'
                        } fw-bolder fs-8 px3 py-2 ms-2`}>
                            {item.status
                            //  === 'Paid' ? 'Paid' : 'Pending'
                             }
                              </span>
                        </div>
                      </div>
                      </td>
                      <td>
                            <div className="d-flex justify-content-end me-4">
                              <button className="btn btn-icon btn-light-primary btn-sm me-2">
                                <KTSVG path="/media/icons/duotune/art/art005.svg" className="svg-icon-2" />
                              </button>
                              <button className="btn btn-icon btn-light-primary btn-sm  me-4">
                                <KTSVG path="/media/icons/duotune/files/fil003.svg" className="svg-icon-2" />
                              </button>
                            </div>
                          </td>
          </>
        )}
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
                {/* // )} */}
              </div>

              </div>

              <UpdateInvoice
  show={showUpdateModal}
  handleClose={() => setShowUpdateModal(false)}
  invoiceData={selectedInvoice || {}}
  handleUpdate={handleUpdateInvoice}
/>
            </div>
        </div>
      </div>
    </>
  )
}

export {AllTransactions}
