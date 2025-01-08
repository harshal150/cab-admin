import React, { FC, useEffect, useState } from 'react';
import LoadingDataTables from '../../../../_metronic/partials/widgets/loader/LoadingDataTables';
import { KTSVG } from '../../../../_metronic/helpers';
// import { getIndustryList } from '../core/_requests';
import { useAuth } from '../../auth';
import jsPDF from 'jspdf';
import { Invoice } from '../core/_models';
import Select from 'react-select';  // Import react-select
import AdvancedPaymentModal from './AdvancedPaymentModal';
import UpdateCollectPayment from './UpdateCollectPayment';
import InvoiceModal from './InvoiceModal';

const CollectPaymentList: FC = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [filteredInvoices, setFilteredInvoices] = useState<Invoice[]>([]); 
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(10); // Default items per page
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('Maintenance Payment'); // No default selection  
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [showDateRangeModal, setShowDateRangeModal] = useState(false);
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const { auth } = useAuth(); // Access the auth context
  const [searchBy, setSearchBy] = useState<string>('payerName');
  const [showTable, setShowTable] = useState<boolean>(false); // Default: Table hidden
  const [selectedPayers, setSelectedPayers] = useState<any | null>(null); // Single select
  const [showAdvancedPaymentModal, setShowAdvancedPaymentModal] = useState<boolean>(false);
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
    const invoiceData: Invoice[] = Array.from({ length: 100 }, (_, i) => {
        const paymentTypes = ['Maintenance Payment', 'Parking Payment', 'Sinking Payment'];
    
        const paymentType = paymentTypes[Math.floor((i % 4) / 2)]; // Rotate every 2 entries across types
        const paymentFor = 'Invoice Payment'; // All entries are Invoice Payment
    
        // Start date and due date are the same but incremented by one day for each entry
        const baseDate = new Date('2023-11-01');  // Starting from 1st Nov 2023
        const createdDate = new Date(baseDate);
        createdDate.setDate(createdDate.getDate() + i); // Increment by 1 for each entry

        const dueDate = new Date(createdDate);
        dueDate.setDate(dueDate.getDate() + 1);  // Due date is 1 day after the created date

        return {
          srNo: i + 1,
          invoiceNo: `STA27811122104371${i}11121359`,
          payerName: `Payer ${String.fromCharCode(65 + (i % 10))}`, // Cycle through 10 payers
          registrationNo: `A-${1000 + i}`,
          dateCreated: createdDate.toLocaleDateString('en-CA'), // Format as YYYY-MM-DD
          dueDate: dueDate.toLocaleDateString('en-CA'), // Format as YYYY-MM-DD
          invoiceAmount: `₹${(i + 1) * 500}.00`, // Incremental invoice amounts
          amountPaid: i % 3 === 0 ? `₹${(i + 1) * 500}.00` : '₹0.00', // Paid for every third invoice
          status: 'Pending', // Paid for every third invoice
          paymentType: paymentType, // Logical distribution of types
          paymentFor: paymentFor, // Apply the cycle for paymentFor
          email: `payer${i}@example.com`,
          invoiceCycle: i % 2 === 0 ? 'Recurring' : 'One-Time',
          mobileNo: `98765432${i % 10}${i % 10}`, // Varied mobile numbers
           // New fields added here
    arrear: i % 2 === 0 ? 0 : 100, // Example: Arrear is 0 for even entries and 100 for odd
    interestOnArrears: 0,
    advancePayment: 0,
    modeOfPayment: 'Cash',
    amountBeingCollected: 0,
    paymentReferenceId: `REF-${i}`,
    remark: '',
    finalPayableAmount: 500 + i * 100, // This is calculated based on the fields
        };
      });
  
    setInvoices(invoiceData);
    setFilteredInvoices(invoiceData);
  }, []);
  



  const handleSearchChange = (selected: any) => {
    setSelectedPayers(selected);
    filterInvoices(searchQuery, statusFilter, selected);
  };

const handleStatusFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const type = e.target.value;
    setStatusFilter(type);
    filterInvoices(searchQuery, type, selectedPayers);
  
    // Show table only when a specific payment type is selected
    setShowTable(type !== 'all');
  };


const filterInvoices = (search: string, type: string, selectedPayers: any) => {
  let filtered = invoices;

  // Filter by "Search By" field
  if (search) {
    filtered = filtered.filter((invoice) => {
      const fieldValue = invoice[searchBy as keyof Invoice]?.toString().toLowerCase() || '';
      return fieldValue.includes(search.toLowerCase());
    });
  }

  // Filter by payment type
  if (type !== 'all') {
    filtered = filtered.filter((invoice) => invoice.paymentType === type);
  }

  // Filter by selected payers
  if (selectedPayers) {
    filtered = filtered.filter((invoice) => invoice.payerName === selectedPayers.value);
  }

  setFilteredInvoices(filtered);
};

  

  // Export Invoices to Clipboard
const handleCopyToClipboard = () => {
  const text = filteredInvoices
    .map(
      (invoice) =>
        `${invoice.srNo}\t${invoice.invoiceNo}\t${invoice.payerName}\t${invoice.registrationNo}\t${invoice.dateCreated}\t${invoice.dueDate}\t${invoice.invoiceAmount}\t${invoice.amountPaid}\t${invoice.status}`
    )
    .join('\n');

  navigator.clipboard.writeText(text).then(() => alert('Copied to clipboard!'));
};




  const handleExportToPDF = () => {
    const doc = new jsPDF();
    doc.text('Invoice List', 10, 10);
    (doc as any).autoTable({
      head: [['Sr. No', 'Invoice No.', 'Payer Name', 'Registration No.', 'Date Created', 'Due Date', 'Invoice Amount', 'Amount Paid', 'Status']],
      body: filteredInvoices.map((invoice) => [
        invoice.srNo,
        invoice.invoiceNo,
        invoice.payerName,
        invoice.registrationNo,
        invoice.dateCreated,
        invoice.dueDate,
        invoice.invoiceAmount,
        invoice.amountPaid,
        invoice.status,
      ]),
    });
    doc.save('Invoices.pdf');
  };

// Share functionality
const handleShareReport = () => {
  const reportText = `Invoice Report\n${filteredInvoices
    .map(
      (invoice) =>
        `Sr. No: ${invoice.srNo}, Invoice No: ${invoice.invoiceNo}, Payer Name: ${invoice.payerName}, Registration No: ${invoice.registrationNo}, Invoice Amount: ${invoice.invoiceAmount}, Amount Paid: ${invoice.amountPaid}, Status: ${invoice.status}`
    )
    .join('\n')}`;

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
  const currentItems = filteredInvoices.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredInvoices.length / itemsPerPage);
  // Change page
  const handlePageChange = (pageNumber: number) => setCurrentPage(pageNumber);

  // Handle items per page change
  const handleItemsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1); // Reset to first page on items per page change
  };


  const applyFilters = () => {
    let filtered = invoices;
  
    // Filter by "Search Query" field
    if (searchQuery) {
      filtered = filtered.filter((invoice) => {
        const fieldValue = invoice[searchBy as keyof Invoice]?.toString().toLowerCase() || '';
        return fieldValue.includes(searchQuery.toLowerCase());
      });
    }
  
    // Filter by payment type
    if (statusFilter && statusFilter !== 'all') {
      filtered = filtered.filter((invoice) => invoice.paymentType === statusFilter);
    }
  
      // Filter by selected payers
  if (selectedPayers && selectedPayers.length > 0) {
    // Handle single or multiple payers
    filtered = filtered.filter((invoice) =>
      selectedPayers.some((payer: { value: string }) => payer.value === invoice.payerName)
    );
  }
  
    return filtered;
  };

  const handleAddAdvancePayment = () => {
    // Show the Advance Payment modal
    setShowAdvancedPaymentModal(true);
  };

  const handleCloseAdvancedPaymentModal = () => {
    // Close the Advance Payment modal
    setShowAdvancedPaymentModal(false);
  };

  const handleSaveAdvancedPayment = (paymentData: any) => {
    // Handle the payment data (e.g., save it to the database)
    console.log('Advanced Payment Data:', paymentData);
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
          <div id="kt_app_content" className="app-content flex-column-fluid" >
            {/* <div id="kt_app_content_container" className="app-container container-xxl" ></div> */}
            <div className="card card-flush" 
            // style={{ backgroundColor: '#F2FAFF'}}


            >
               {/* Create Invoice Button */}
               <div className="card-header align-items-center py-3 gap-2 gap-md-12">
                <h3 className="card-title">Collect Outstanding Payments</h3>
              </div>

              {/* Search, Export, Share, Custom Date Filter and Other Original Functionalities */}
              <div className="card-header align-items-center gap-2 flex-wrap">
  {/* Payment Type Filter */}
  <div className="d-flex align-items-center flex-grow-1 flex-shrink-0">
    <div
      className="w-100 w-md-240px"
      style={{
        maxWidth: '400px', // Set a maximum width
        textAlign: 'center', // Center the content
      }}
    >
      <select
        className="form-select form-select-solid"
        data-control="select2"
        data-hide-search="true"
        value={statusFilter}
        onChange={handleStatusFilterChange}
      >
        <option value="" disabled>
          Select Payment Type
        </option>
        <option value="Maintenance Payment">
          Maintenance Payment
        </option>
        <option value="Parking Payment">
          Parking Payment
        </option>
        <option value="Sinking Payment">
          Sinking Payment
        </option>
      </select>
    </div>
  </div>


      {/* Payer Selection Dropdown */}
      <div className="d-flex align-items-center flex-grow-1 flex-shrink-0 ms-2">
  <div className="w-100 w-md-240px">
    <Select
      isMulti={false}
      options={invoices.map((invoice) => ({
        label: invoice.payerName,
        value: invoice.payerName,
      }))}
      value={selectedPayers}
      onChange={handleSearchChange}
      placeholder="Search/Select Payer"
      styles={{
        control: (provided, state) => ({
          ...provided,
          height: '32px', // Adjust the height here
          minHeight: '32px', // Ensure a minimum height
          borderColor: state.isFocused ? '#336699' : '#cccccc', // Change border color on focus
          boxShadow: state.isFocused ? '0 0 0 1px #336699' : 'none', // Optional: Add focus shadow
          '&:hover': {
            borderColor: '#336699', // Change border color on hover
          },
        }),
        option: (provided, state) => ({
          ...provided,
          backgroundColor: state.isSelected ? '#336699' : state.isFocused ? '#e5f1ff' : 'white', // Change selected option's bg color
          color: state.isSelected ? 'white' : '#333333', // Change text color for selected option
          '&:hover': {
            backgroundColor: state.isSelected ? '#336699' : '#f0f4f8', // Optional: Add hover effect
          },
        }),
        dropdownIndicator: (provided) => ({
          ...provided,
          padding: '4px', // Adjust indicator padding
        }),
        clearIndicator: (provided) => ({
          ...provided,
          padding: '4px', // Adjust clear indicator padding
        }),
        valueContainer: (provided) => ({
          ...provided,
          // display: 'flex', // Use flexbox for alignment
          // justifyContent: 'center', // Center the content horizontally
          // alignItems: 'center', // Center the content vertically
          padding: '4px', // Adjust padding inside the value container
        }),
        singleValue: (provided) => ({
          ...provided,
          color: '#224466', // Set selected value text color
          fontWeight: 'bold', // Make text bold
          textAlign: 'center', // Center the text
          // width: '100%', // Ensure full width for proper alignment
        }),
      }}
    />
  </div>
</div>


      {/* Advance Payment Button */}
      {selectedPayers && (
        <div className="d-flex align-items-center flex-grow-1 flex-shrink-0 ms-2">
          <div className="w-100 w-md-240px">
            <button
              type="button"
              className="btn btn-light-primary w-100"
              onClick={handleAddAdvancePayment}
            >
              <KTSVG path='/media/icons/duotune/general/gen035.svg'  className='svg-icon-2'></KTSVG>Advance Payment
            </button>
          </div>
        </div>
      )}

      {/* Export and Share Buttons */}
      <div className="d-flex align-items-center flex-grow-1 flex-shrink-0 justify-content-end gap-2">
        <button
          type="button"
          className="btn btn-light-primary"
          data-kt-menu-trigger="hover"
          data-kt-menu-placement="bottom-end"
        >
          <span className="svg-icon svg-icon-2">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect opacity="0.3" x="12.75" y="4.25" width="12" height="2" rx="1" transform="rotate(90 12.75 4.25)" fill="currentColor" />
              <path
                d="M12.0573 6.11875L13.5203 7.87435C13.9121 8.34457 14.6232 8.37683 15.056 7.94401C15.4457 7.5543 15.4641 6.92836 15.0979 6.51643L12.4974 3.59084C12.0996 3.14332 11.4004 3.14332 11.0026 3.59084L8.40206 6.51643C8.0359 6.92836 8.0543 7.5543 8.44401 7.94401C8.87683 8.37683 9.58785 8.34458 9.9797 7.87435L11.4427 6.11875C11.6026 5.92684 11.8974 5.92684 12.0573 6.11875Z"
                fill="currentColor"
              />
              <path
                opacity="0.3"
                d="M18.75 8.25H17.75C17.1977 8.25 16.75 8.69772 16.75 9.25C16.75 9.80228 17.1977 10.25 17.75 10.25C18.3023 10.25 18.75 10.6977 18.75 11.25V18.25C18.75 18.8023 18.3023 19.25 17.75 19.25H5.75C5.19772 19.25 4.75 18.8023 4.75 18.25V11.25C4.75 10.6977 5.19771 10.25 5.75 10.25C6.30229 10.25 6.75 9.80228 6.75 9.25C6.75 8.69772 6.30229 8.25 5.75 8.25H4.75C3.64543 8.25 2.75 9.14543 2.75 10.25V19.25C2.75 20.3546 3.64543 21.25 4.75 21.25H18.75C19.8546 21.25 20.75 20.3546 20.75 19.25V10.25C20.75 9.14543 19.8546 8.25 18.75 8.25Z"
                fill="currentColor"
              />
            </svg>
          </span>
        </button>
        <div id="kt_ecommerce_report_returns_export_menu"
                      className="menu menu-sub menu-sub-dropdown menu-column menu-rounded menu-gray-600 menu-state-bg-light-primary fw-semibold fs-7 w-200px py-4"
                      
                      data-kt-menu="true">
                      <div className="menu-item px-3">
                        <a href="#" onClick={handleCopyToClipboard} className="menu-link px-3" data-kt-ecommerce-export="copy">Copy to clipboard</a>
                      </div>
                     
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



              {/* Table Section */}
             
              <div className="card-body pt-0">
                {/* {isLoading ? (
                  <LoadingDataTables />
                ) : ( */}
                  <div className="table-responsive">
                    <table className="table table-row-dashed table-row-gray-300 align-middle gs-0 gy-4" id="kt_ecommerce_report_returns_table">
                      <thead style={{backgroundColor:'#F1FAFF'}}>
                        <tr className="fw-bold fs-7"> {/* Added fs-7 for smaller font size */}
                        <th className='w-25px  ps-3 rounded-start'>
                    <div className='form-check form-check-sm form-check-custom form-check-solid'>
                      <input
                        className='form-check-input'
                        type='checkbox'
                        value='1'
                        data-kt-check='true'
                        data-kt-check-target='.widget-9-check'
                      />
                    </div>
                  </th>
                  <th className="min-w-50px text-nowrap">S.No</th>
                    <th className="min-w-100px text-nowrap">Payer Name</th>
                    <th className="min-w-150px text-nowrap">Email ID</th>
                    <th className="min-w-100px text-nowrap">Contact</th>
                    <th className="min-w-50px text-nowrap">Amount</th>
                    <th className="min-w-100px text-nowrap">Create Date</th>
                    <th className="min-w-100px text-nowrap">Invoice No</th>
                    <th className="min-w-50px text-nowrap">Status</th>
                          <th className=" text-right rounded-end text-nowrap">Action</th>
                        </tr>
                      </thead>
                      <tbody 
                      // className="fw-semibold text-gray-600"
                      >
                        {currentItems.length === 0 ? (
                          <tr>
                            <td colSpan={4} className="text-center">
                              No invoices available
                            </td>
                          </tr>
                        ) : (
                          currentItems.map((invoice) => (
                            <tr key={invoice.srNo} className="fs-7"> {/* Added fs-7 for table rows */}
                              <td>
                      <div className='form-check form-check-sm form-check-custom form-check-solid'>
                        <input
                          className='form-check-input widget-9-check'
                          type='checkbox'
                          value='1'
                        />
                      </div>
                    </td>
                              <td>
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
                          {invoice.dateCreated}
                              </span>
                        </div>
                      </div>
                      </td>
                      
                      <td>
                              <div className='d-flex align-items-center'>
                        <div className='d-flex justify-content-start flex-column'>
                          <span className='text-dark fw-bold text-hover-primary fs-7'>
                          {invoice.invoiceNo}
                              </span>
                        </div>
                      </div>
                              </td>
                      
                      
                              <td>
                              <div className='d-flex align-items-center'>
                        <div className='d-flex justify-content-start flex-column'>
                        <span className={`badge badge-light-${
                          invoice.status === 'Paid' ? 'success' : 'warning'
                        } fw-bolder fs-8 px3 py-2 ms-2`}>
                            {invoice.status
                            //  === 'Paid' ? 'Paid' : 'Pending'
                             }
                              </span>
                        </div>
                      </div>
                      </td>
                      <td>
                            <div className="d-flex justify-content-end me-4">
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
             
             {/* The modal */}
        <AdvancedPaymentModal
          show={showAdvancedPaymentModal}
          handleClose={handleCloseAdvancedPaymentModal}
          selectedPayer={selectedPayers}
          handleSave={handleSaveAdvancedPayment}
        />


              {/* Modal for updating outstanding invoice */}
      {selectedInvoiceUpdate && (
        <UpdateCollectPayment
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
      </div>
    </>
  )
}

export {CollectPaymentList}
