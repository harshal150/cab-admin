import React, { FC, useEffect, useState } from 'react';
import LoadingDataTables from '../../../../_metronic/partials/widgets/loader/LoadingDataTables';
import { KTSVG } from '../../../../_metronic/helpers';
// import { getIndustryList } from '../core/_requests';
import { useAuth } from '../../auth';
import { Invoice } from '../core/_models';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { Button, Modal } from 'react-bootstrap';
import ViewDocumentsModal from './ViewDocumentsModal';
import ActionModal from './ActionModal';
import EditFormModal from './EditFormModal';
import ViewFormModal from './ViewFormModal';
// import UpdateInvoice from './UpdateInvoice'; // Adjust the path accordingly


const ApplicationList: FC = () => {
  const [formData, setFormData] = useState<any[]>([]); // Dynamic form data
   const [filteredData, setFilteredData] = useState<any[]>([]); // Filtered form data
    const [selectedTab, setSelectedTab] = useState<number>(0); // Track selected tab
    const [selectedStage, setSelectedStage] = useState<number>(0); // Track selected stage (sub-option)
    const [selectedRowData, setSelectedRowData] = useState<any | null>(null); // To store selected row data for modals
  const [invoices, setInvoices] = useState<any[]>([]);
  const [detailedData, setDetailedData] = useState<any[]>([]); // New state for detailed data
  const [filteredInvoices, setFilteredInvoices] = useState<any[]>([]); 
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

 const [isModalOpen, setIsModalOpen] = useState<boolean>(false); // To handle modal visibility
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [isActionModalOpen, setIsActionModalOpen] = useState<boolean>(false);
  const [isDocumentModalOpen, setIsDocumentModalOpen] = useState<boolean>(false);

   const [screenSize, setScreenSize] = useState<string>('desktop'); // Track screen size

    const [subTabPosition, setSubTabPosition] = useState<{ top: number; left: number }>({
       top: 0,
       left: 0,
     });

   // Detect screen size on load and on resize
    useEffect(() => {
       const checkScreenSize = () => {
         const screenWidth = window.innerWidth;
         if (screenWidth <= 768) {
           setScreenSize('mobile');
         } else if (screenWidth > 768 && screenWidth <= 1024) {
           setScreenSize('tablet');
         } else {
           setScreenSize('desktop');
         }
       };
   
       checkScreenSize(); // Check screen size on initial load
   
       window.addEventListener('resize', checkScreenSize); // Add listener for resizing
   
       return () => {
         window.removeEventListener('resize', checkScreenSize); // Clean up listener on unmount
       };
     }, []);
   

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

 // Simulate fetching dynamic form data from backend
  useEffect(() => {
    const fetchFormData = async () => {
      // Here you would fetch from the backend, for now, we'll use hardcoded data
      const data = [
        {
          id: 1,
          name: 'Refunded Requests',
          stages: ['Fresh Requests', 'Sent To Student', 'Resubmitted Requests', 'Revert By Academic'], // Add stages for this form
          fields: ['srNo', 'transactionId', 'date', 'paidAmount', 'status'], // Field names for the table
          data: Array.from({ length: 15 }, (_, i) => ({
            srNo: i + 1,
            transactionId: `TP021224040409372${i}`,
            date: `10-${12 + (i % 10)}-2024`,
            paidAmount: `${(5000 + i * 100)}.00`,
            status: i % 2 === 0 ? 'Paid' : 'Pending',
            stage: ['Fresh Requests', 'Sent To Student', 'Resubmitted Requests', 'Revert By Academic'][i % 4], // Random stage assignment
            personalDetails: {
              firstName: `FirstName${i}`,
              lastName: `LastName${i}`,
              emailId: `user${i}@example.com`,
            },
            documentUpload: [
              {
                description: 'Fee Receipt',
                url: `https://example.com/documents/fee_receipt_${i}.pdf`,
              },
              {
                description: 'Application Form',
                url: `https://example.com/documents/application_form_${i}.pdf`,
              },
            ],
            bankDetails: {
              bankName: `Bank${i}`,
              accountNumber: `12345678${i}`,
              ifscCode: `IFSC${i}`,
              branchAddress: `Branch${i}`,
            },
            timeline: [
              {
                actor: 'JSPM Group',
                timestamp: '09-12-2024 01:14:59',
                comment: 'Form details are ok for me, please check at your end.',
                attachment: 'NA',
              },
              {
                actor: 'Exam User',
                timestamp: '09-12-2024 01:18:19',
                comment: 'Fee Receipts is missing.',
                attachment: 'NA',
              },
            ],
          })),
        },
        {
          id: 2,
          name: 'Admission Form',
          stages: ['New Admission', 'Pending', 'Approved', 'Rejected'], // Add stages for this form
          fields: ['srNo', 'firstName', 'lastName', 'emailId', 'status'],
          data: Array.from({ length: 15 }, (_, i) => ({
            srNo: i + 1,
            firstName: `FirstName${i}`,
            lastName: `LastName${i}`,
            emailId: `user${i}@example.com`,
            status: i % 2 === 0 ? 'Paid' : 'Pending',
            stage: ['New Admission', 'Pending', 'Approved', 'Rejected'][i % 4], // Random stage assignment
            personalDetails: {
              firstName: `FirstName${i}`,
              lastName: `LastName${i}`,
              emailId: `user${i}@example.com`,
            },
            documentUpload: [
              {
                description: 'Fee Receipt',
                url: `https://example.com/documents/fee_receipt_${i}.pdf`,
              },
              {
                description: 'Application Form',
                url: `https://example.com/documents/application_form_${i}.pdf`,
              },
            ],
            bankDetails: {
              bankName: `Bank${i}`,
              accountNumber: `12345678${i}`,
              ifscCode: `IFSC${i}`,
              branchAddress: `Branch${i}`,
            },
            timeline: [
              {
                actor: 'JSPM Group',
                timestamp: '09-12-2024 01:14:59',
                comment: 'Form details are ok for me, please check at your end.',
                attachment: 'NA',
              },
              {
                actor: 'Exam User',
                timestamp: '09-12-2024 01:18:19',
                comment: 'Fee Receipts is missing.',
                attachment: 'NA',
              },
            ],
          })),
        },
        {
          id: 3,
          name: 'Walkin Form',
          stages: ['New Enquiry', 'Pending', 'Approved', 'Rejected'], // Add stages for this form
          fields: ['srNo', 'firstName', 'lastName', 'emailId', 'status'],
          data: Array.from({ length: 15 }, (_, i) => ({
            srNo: i + 1,
            firstName: `FirstName${i}`,
            lastName: `LastName${i}`,
            emailId: `user${i}@example.com`,
            status: i % 2 === 0 ? 'Paid' : 'Pending',
            stage: ['New Enquiry', 'Pending', 'Approved', 'Rejected'][i % 4], // Random stage assignment
            personalDetails: {
              firstName: `FirstName${i}`,
              lastName: `LastName${i}`,
              emailId: `user${i}@example.com`,
            },
            documentUpload: [
              {
                description: 'Fee Receipt',
                url: `https://example.com/documents/fee_receipt_${i}.pdf`,
              },
              {
                description: 'Application Form',
                url: `https://example.com/documents/application_form_${i}.pdf`,
              },
            ],
            bankDetails: {
              bankName: `Bank${i}`,
              accountNumber: `12345678${i}`,
              ifscCode: `IFSC${i}`,
              branchAddress: `Branch${i}`,
            },
            timeline: [
              {
                actor: 'JSPM Group',
                timestamp: '09-12-2024 01:14:59',
                comment: 'Form details are ok for me, please check at your end.',
                attachment: 'NA',
              },
              {
                actor: 'Exam User',
                timestamp: '09-12-2024 01:18:19',
                comment: 'Fee Receipts is missing.',
                attachment: 'NA',
              },
            ],
          })),
        },
        // {
        //   id: 4,
        //   name: 'Gaurd Applications',
        //   stages: ['New Admission', 'Pending', 'Approved', 'Rejected'], // Add stages for this form
        //   fields: ['srNo', 'firstName', 'lastName', 'emailId', 'status'],
        //   data: Array.from({ length: 15 }, (_, i) => ({
        //     srNo: i + 1,
        //     firstName: `FirstName${i}`,
        //     lastName: `LastName${i}`,
        //     emailId: `user${i}@example.com`,
        //     status: i % 2 === 0 ? 'Paid' : 'Pending',
        //     stage: ['New Admission', 'Pending', 'Approved', 'Rejected'][i % 4], // Random stage assignment
        //     personalDetails: {
        //       firstName: `FirstName${i}`,
        //       lastName: `LastName${i}`,
        //       emailId: `user${i}@example.com`,
        //     },
        //     documentUpload: [
        //       {
        //         description: 'Fee Receipt',
        //         url: `https://example.com/documents/fee_receipt_${i}.pdf`,
        //       },
        //       {
        //         description: 'Application Form',
        //         url: `https://example.com/documents/application_form_${i}.pdf`,
        //       },
        //     ],
        //     bankDetails: {
        //       bankName: `Bank${i}`,
        //       accountNumber: `12345678${i}`,
        //       ifscCode: `IFSC${i}`,
        //       branchAddress: `Branch${i}`,
        //     },
        //     timeline: [
        //       {
        //         actor: 'JSPM Group',
        //         timestamp: '09-12-2024 01:14:59',
        //         comment: 'Form details are ok for me, please check at your end.',
        //         attachment: 'NA',
        //       },
        //       {
        //         actor: 'Exam User',
        //         timestamp: '09-12-2024 01:18:19',
        //         comment: 'Fee Receipts is missing.',
        //         attachment: 'NA',
        //       },
        //     ],
        //   })),
        // },
        // {
        //   id: 3,
        //   name: 'Other Form',
        //   stages: ['New Admission', 'Pending', 'Approved', 'Rejected'], // Add stages for this form
        //   fields: ['srNo', 'firstName', 'lastName', 'emailId', 'status'],
        //   data: Array.from({ length: 15 }, (_, i) => ({
        //     srNo: i + 1,
        //     firstName: `FirstName${i}`,
        //     lastName: `LastName${i}`,
        //     emailId: `user${i}@example.com`,
        //     status: i % 2 === 0 ? 'Paid' : 'Pending',
        //     stage: ['New Admission', 'Pending', 'Approved', 'Rejected'][i % 4], // Random stage assignment
        //     personalDetails: {
        //       firstName: `FirstName${i}`,
        //       lastName: `LastName${i}`,
        //       emailId: `user${i}@example.com`,
        //     },
        //     documentUpload: [
        //       {
        //         description: 'Fee Receipt',
        //         url: `https://example.com/documents/fee_receipt_${i}.pdf`,
        //       },
        //       {
        //         description: 'Application Form',
        //         url: `https://example.com/documents/application_form_${i}.pdf`,
        //       },
        //     ],
        //     bankDetails: {
        //       bankName: `Bank${i}`,
        //       accountNumber: `12345678${i}`,
        //       ifscCode: `IFSC${i}`,
        //       branchAddress: `Branch${i}`,
        //     },
        //     timeline: [
        //       {
        //         actor: 'JSPM Group',
        //         timestamp: '09-12-2024 01:14:59',
        //         comment: 'Form details are ok for me, please check at your end.',
        //         attachment: 'NA',
        //       },
        //       {
        //         actor: 'Exam User',
        //         timestamp: '09-12-2024 01:18:19',
        //         comment: 'Fee Receipts is missing.',
        //         attachment: 'NA',
        //       },
        //     ],
        //   })),
        // },
        // {
        //   id: 3,
        //   name: 'Other Form',
        //   stages: ['New Admission', 'Pending', 'Approved', 'Rejected'], // Add stages for this form
        //   fields: ['srNo', 'firstName', 'lastName', 'emailId', 'status'],
        //   data: Array.from({ length: 15 }, (_, i) => ({
        //     srNo: i + 1,
        //     firstName: `FirstName${i}`,
        //     lastName: `LastName${i}`,
        //     emailId: `user${i}@example.com`,
        //     status: i % 2 === 0 ? 'Paid' : 'Pending',
        //     stage: ['New Admission', 'Pending', 'Approved', 'Rejected'][i % 4], // Random stage assignment
        //     personalDetails: {
        //       firstName: `FirstName${i}`,
        //       lastName: `LastName${i}`,
        //       emailId: `user${i}@example.com`,
        //     },
        //     documentUpload: [
        //       {
        //         description: 'Fee Receipt',
        //         url: `https://example.com/documents/fee_receipt_${i}.pdf`,
        //       },
        //       {
        //         description: 'Application Form',
        //         url: `https://example.com/documents/application_form_${i}.pdf`,
        //       },
        //     ],
        //     bankDetails: {
        //       bankName: `Bank${i}`,
        //       accountNumber: `12345678${i}`,
        //       ifscCode: `IFSC${i}`,
        //       branchAddress: `Branch${i}`,
        //     },
        //     timeline: [
        //       {
        //         actor: 'JSPM Group',
        //         timestamp: '09-12-2024 01:14:59',
        //         comment: 'Form details are ok for me, please check at your end.',
        //         attachment: 'NA',
        //       },
        //       {
        //         actor: 'Exam User',
        //         timestamp: '09-12-2024 01:18:19',
        //         comment: 'Fee Receipts is missing.',
        //         attachment: 'NA',
        //       },
        //     ],
        //   })),
        // },
        // {
        //   id: 3,
        //   name: 'Other Form',
        //   stages: ['New Admission', 'Pending', 'Approved', 'Rejected'], // Add stages for this form
        //   fields: ['srNo', 'firstName', 'lastName', 'emailId', 'status'],
        //   data: Array.from({ length: 15 }, (_, i) => ({
        //     srNo: i + 1,
        //     firstName: `FirstName${i}`,
        //     lastName: `LastName${i}`,
        //     emailId: `user${i}@example.com`,
        //     status: i % 2 === 0 ? 'Paid' : 'Pending',
        //     stage: ['New Admission', 'Pending', 'Approved', 'Rejected'][i % 4], // Random stage assignment
        //     personalDetails: {
        //       firstName: `FirstName${i}`,
        //       lastName: `LastName${i}`,
        //       emailId: `user${i}@example.com`,
        //     },
        //     documentUpload: [
        //       {
        //         description: 'Fee Receipt',
        //         url: `https://example.com/documents/fee_receipt_${i}.pdf`,
        //       },
        //       {
        //         description: 'Application Form',
        //         url: `https://example.com/documents/application_form_${i}.pdf`,
        //       },
        //     ],
        //     bankDetails: {
        //       bankName: `Bank${i}`,
        //       accountNumber: `12345678${i}`,
        //       ifscCode: `IFSC${i}`,
        //       branchAddress: `Branch${i}`,
        //     },
        //     timeline: [
        //       {
        //         actor: 'JSPM Group',
        //         timestamp: '09-12-2024 01:14:59',
        //         comment: 'Form details are ok for me, please check at your end.',
        //         attachment: 'NA',
        //       },
        //       {
        //         actor: 'Exam User',
        //         timestamp: '09-12-2024 01:18:19',
        //         comment: 'Fee Receipts is missing.',
        //         attachment: 'NA',
        //       },
        //     ],
        //   })),
        // },
        // {
        //   id: 3,
        //   name: 'Other Form',
        //   stages: ['New Admission', 'Pending', 'Approved', 'Rejected'], // Add stages for this form
        //   fields: ['srNo', 'firstName', 'lastName', 'emailId', 'status'],
        //   data: Array.from({ length: 15 }, (_, i) => ({
        //     srNo: i + 1,
        //     firstName: `FirstName${i}`,
        //     lastName: `LastName${i}`,
        //     emailId: `user${i}@example.com`,
        //     status: i % 2 === 0 ? 'Paid' : 'Pending',
        //     stage: ['New Admission', 'Pending', 'Approved', 'Rejected'][i % 4], // Random stage assignment
        //     personalDetails: {
        //       firstName: `FirstName${i}`,
        //       lastName: `LastName${i}`,
        //       emailId: `user${i}@example.com`,
        //     },
        //     documentUpload: [
        //       {
        //         description: 'Fee Receipt',
        //         url: `https://example.com/documents/fee_receipt_${i}.pdf`,
        //       },
        //       {
        //         description: 'Application Form',
        //         url: `https://example.com/documents/application_form_${i}.pdf`,
        //       },
        //     ],
        //     bankDetails: {
        //       bankName: `Bank${i}`,
        //       accountNumber: `12345678${i}`,
        //       ifscCode: `IFSC${i}`,
        //       branchAddress: `Branch${i}`,
        //     },
        //     timeline: [
        //       {
        //         actor: 'JSPM Group',
        //         timestamp: '09-12-2024 01:14:59',
        //         comment: 'Form details are ok for me, please check at your end.',
        //         attachment: 'NA',
        //       },
        //       {
        //         actor: 'Exam User',
        //         timestamp: '09-12-2024 01:18:19',
        //         comment: 'Fee Receipts is missing.',
        //         attachment: 'NA',
        //       },
        //     ],
        //   })),
        // },
        
        // Add more forms dynamically as needed
      ];

      setFormData(data);
      // setFilteredData(data[0].data); // Default to first form
      setSelectedTab(0); // Default to the first tab
      setSelectedStage(0); // Select the first stage by default
      setIsLoading(false);

      // Apply the default stage filter for the first tab and first stage
      if (data[0]?.stages?.length > 0) {
        applyStageFilter(data[0].stages[0]);
      }
    };

    fetchFormData();
  }, []);


useEffect(() => {
  const invoiceData = Array.from({ length: 15 }, (_, i) => ({
    srNo: i + 1,
    editForm: i + 1,
    viewForm: i + 1,
    takeAction: i + 1,
    transactionId: `TP021224040409372${i}`,
    refNo: `ANI940212035095111122663${i}`,
    date: `10-${12 + (i % 10)}-2024`,
    paidAmount: `${(5000 + i * 100)}.00`,
    status: i % 2 === 0 ? 'Paid' : 'Pending',
    formStageState: i % 4 === 0 ? 'Revert By Academic' : i % 4 === 1 ? 'Resubmitted Requests' : i % 4 === 2 ? 'Sent To Students' : 'Fresh Requests',
    firstName: `FirstName${i}`,
    lastName: `LastName${i}`,
    emailId: `user${i}@example.com`,
    mobileNumber: `98765432${i % 10}`,
    nameOfProgram: `Program ${i}`,
    reportedCollegeCampus: i % 2 === 0 ? 'YES' : 'NO',
    completedTheProgram: i % 3 === 0 ? 'YES' : 'NO',
    registrationNumber: `267${i}`,
    department: `Department ${i % 3}`,
    feeReceipt: i % 2 === 0 ? 'Uploaded' : 'Not Uploaded',
    application: i % 3 === 0 ? 'Uploaded' : 'Not Uploaded',
    noDueCertificate: i % 4 === 0 ? 'Uploaded' : 'Not Uploaded',
    bankName: `Bank ${i}`,
    accountNumber: `ACC${i}123456789`,
    ifscCode: `IFSC${i}`,
    branchAddress: `Branch Address ${i}`,
    academicSecurityAmount: `${500 + i * 50}`,
    hostelSecurityAmount: `${300 + i * 30}`,

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

// Only apply stage filter if formData[selectedTab] exists
const applyStageFilter = (selectedStageName: string) => {
  const currentTab = formData[selectedTab];
  if (currentTab) {
    setFilteredData(currentTab.data.filter((item: any) => item.stage === selectedStageName));
  }
};

useEffect(() => {
    if (formData[selectedTab]) {
      // Apply stage filter after form data and selected tab are ready
      applyStageFilter(formData[selectedTab].stages[selectedStage]);
    }
  }, [formData, selectedTab, selectedStage]);

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


const handleTabChange = (tabIndex: number) => {
  setSelectedTab(tabIndex);
  setSelectedStage(0); // Reset stage selection when changing the form
  setSearchQuery('');  // Reset search query
  setStatusFilter('all');  // Reset payment type filter
  setStartDate('');  // Clear start date filter
  setEndDate('');  // Clear end date filter

  // Switch between the different form data based on selected tab
  // setFilteredData(formData[tabIndex].data);

  updateSubTabPosition(tabIndex); // Update sub-tab position
};

const updateSubTabPosition = (tabIndex: number) => {
    const tabElement = document.querySelectorAll('.tab-item')[tabIndex] as HTMLElement;
    const parentContainer = document.querySelector('.tabs-container') as HTMLElement;

    if (tabElement && parentContainer) {
      const { offsetTop, offsetLeft, offsetHeight, offsetWidth } = tabElement;
      const containerRect = parentContainer.getBoundingClientRect();
      const subTabWidth = 200; // Estimated width of sub-tabs

      let left = offsetLeft + offsetWidth / 2 - subTabWidth / 2;

      // Ensure sub-tabs stay within the parent container
      if (left < 0) left = 0; // Prevent overflow on the left
      if (left + subTabWidth > containerRect.width) {
        left = containerRect.width - subTabWidth; // Prevent overflow on the right
      }

      setSubTabPosition({
        top: offsetTop + offsetHeight, // Place below the arrow
        left: left,
      });
    }
  };

  useEffect(() => {
    updateSubTabPosition(selectedTab);
    window.addEventListener('resize', () => updateSubTabPosition(selectedTab));
    return () => {
      window.removeEventListener('resize', () => updateSubTabPosition(selectedTab));
    };
  }, [selectedTab]);


const handleStageChange = (stageIndex: number) => {
  setSelectedStage(stageIndex);

  // Apply stage filter after stage change
  applyStageFilter(formData[selectedTab].stages[stageIndex]);
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
  let filtered = filteredData;

  if (search) {
    filtered = filtered.filter((item) => {
      let fieldValue = item[searchBy] ? item[searchBy]?.toString().toLowerCase() : '';
      return fieldValue.includes(search.toLowerCase());
    });
  }

  // Filter by payment type (only for Summary view)
  if (type !== 'all') {
    filtered = filtered.filter((item) => item.status === type);
  }

   // Date filtering
   if (startDate && endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    filtered = filtered.filter((item) => {
      const date = new Date(item.date);
      return date >= start && date <= end;
    });
  }

  setFilteredData(filtered);
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

  const handleEditForm = (rowData: any) => {
    setSelectedRowData(rowData);
    setIsEditModalOpen(true);
  };

  const handleViewForm = (rowData: any) => {
    setSelectedRowData(rowData);
    setIsModalOpen(true);
  };

  const handleTakeAction = (rowData: any) => {
    setSelectedRowData(rowData);
    setIsActionModalOpen(true);
  };

  const handleViewDocuments = (rowData: any) => {
    setSelectedRowData(rowData);
    setIsDocumentModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setIsEditModalOpen(false);
    setIsActionModalOpen(false);
    setIsDocumentModalOpen(false);
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
               <div className="card-header align-items-center py-3 gap-2 gap-md-12" >
               <h3 className="card-title" >Applications</h3>
               
</div>
<div className="tabs-container">
  {/* Main Tabs or Dropdown */}
<div className="main-tabs">
  {screenSize === 'mobile' && formData.length >= 3 ? (
    // Mobile View: Use Dropdown if there are 3 or more main tabs
    <select
      className="form-select "
      value={selectedTab}
      onChange={(e) => handleTabChange(Number(e.target.value))}
      style={{
        padding: '5px 10px',
        borderRadius: '8px',
        width: '100%',
        fontSize: '14px',
        backgroundColor: '#f5f8fa',
        borderColor: '#336699',
      }}
    >
      {formData.map((form, index) => (
        <option key={form.id} value={index}>
          {form.name}
        </option>
      ))}
    </select>
  ) : formData.length > 4 ? (
    // Tablet/Desktop View: Use Dropdown for more than 4 tabs
    <select
      className="form-select"
      value={selectedTab}
      onChange={(e) => handleTabChange(Number(e.target.value))}
      style={{
        padding: '5px 10px',
        borderRadius: '8px',
        width: 'auto',
        fontSize: '14px',
        backgroundColor: '#f5f8fa',
        borderColor: '#336699',
        marginLeft: '10px',
      }}
    >
      {formData.map((form, index) => (
        <option key={form.id} value={index}>
          {form.name}
        </option>
      ))}
    </select>
  ) : (
    // Show as Tabs
    <div className="tab-wrapper">
      {formData.map((form, index) => (
        <div
          key={form.id}
          className={`tab-item text-nowrap ${selectedTab === index ? 'active-tab' : ''}`}
          onClick={() => handleTabChange(index)}
        >
          {form.name}
          {selectedTab === index && <div className="arrow-down"></div>}
        </div>
      ))}
    </div>
  )}
</div>

  {/* Sub-Tabs or Dropdown */}
  <div className="sub-tabs mx-7 mb-2 "
  style={{
    top: `${subTabPosition.top}px`,
    left: `${subTabPosition.left}px`,
    transform: 'translateX(0)', // Center align
  }}
  >
    <div className="d-flex align-items-center">
  <h6 className="mb-0 ms-2 me-2 text-nowrap">Application Stage:</h6>


    {screenSize === 'mobile' && formData[selectedTab]?.stages.length >= 3 ? (
      // Mobile View: Dropdown if there are 3 or more sub-tabs
      <select
        className="form-select"
        value={selectedStage}
        onChange={(e) => handleStageChange(Number(e.target.value))}
        style={{
          padding: '5px 10px',
          borderRadius: '8px',
          width: '100%',
          fontSize: '14px',
          backgroundColor: '#f5f8fa',
          borderColor: '#336699',
        }}
      >
        {formData[selectedTab]?.stages.map((stage:any, index:any) => (
          <option key={index} value={index}>
            {stage}
          </option>
        ))}
      </select>
    ) : formData[selectedTab]?.stages.length > 4 ? (
      // Desktop/Tablet: Dropdown if more than 4 sub-tabs
      <select
        className="form-select"
        value={selectedStage}
        onChange={(e) => handleStageChange(Number(e.target.value))}
        style={{
          padding: '5px 10px',
          borderRadius: '8px',
          width: 'auto',
          fontSize: '14px',
          backgroundColor: '#f5f8fa',
          borderColor: '#336699',
        }}
      >
        {formData[selectedTab]?.stages.map((stage:any, index:any) => (
          <option key={index} value={index}>
            {stage}
          </option>
        ))}
      </select>
    ) : (
      // Show as Tabs
      <div className="tab-wrapper">
        {formData[selectedTab]?.stages.map((stage:any, index:any) => (
        <div
          key={index}
          className={`sub-tab-item text-nowrap ${
            selectedStage === index ? 'active-sub-tab' : ''
          }`}
          onClick={() => handleStageChange(index)}
        >
          {stage}
          {/* {selectedStage === index && <div className="arrow-down-sub"></div>} */}
        </div>
      ))}
      </div>
    )}
    </div>
  </div>
</div>

{/* Styles */}
<style>
  {`
    .tabs-container {
    position: relative;
      display: flex;
      flex-direction: column;
      background-color: #fff;
      border: 1px solid #ddd;
      border-radius: 8px;
      width: 98%; 
      margin: 0 auto;
      overflow: hidden; /* Prevent overflow outside the container */
    }

    .main-tabs {
      display: flex;
      flex-wrap: wrap; /* Allow tabs to wrap if they exceed the container width */
      justify-content: flex-start; /* Align tabs to the left */
      gap: 16px; /* Add spacing between tabs */
      background-color: #fff;
      padding: 6px 20px; /* Add padding */
      overflow: hidden; /* Prevent overflow */
    }

    .tab-wrapper {
      display: flex;
      flex-wrap: wrap; /* Allow tabs to wrap onto the next line */

    }

    .sub-tabs {
      display: inline-flex; /* Use inline-flex to shrink to content size */
      flex-wrap: wrap; /* Allow sub-tabs to wrap */
      justify-content: start; /* Center align */
      gap: 16px;
      max-width: 100%; /* Prevent exceeding the parent container width */
      margin: 0 auto; /* Center within container */
      background-color: #f5f8fa;
      border: 1px solid #ddd;
      border-radius: 8px;
    }

    .tab-item {
      flex: 1;
      padding: 6px 20px;
      text-align: center;
      cursor: pointer;
      font-size: 14px;
      font-weight: 500;
      color: #666;
      border-bottom: 2px solid transparent;
      position: relative;
      transition: all 0.3s ease;
      background-color: #f5f8fa;
      margin-right: 8px;
      border-radius:8px
    }
      .sub-tab-item {
      flex: 1;
      padding: 4px 20px;
      text-align: center;
      cursor: pointer;
      font-size: 14px;
      font-weight: 500;
      color: #666;
      border: 2px solid transparent;
      position: relative;
      transition: all 0.3s ease;
      background-color: #fff;
      margin-right: 8px;
      margin-left: 8px;
      margin-top: 5px;
      margin-bottom: 5px;
      border-radius:8px
    }

    .arrow-down {
          position: absolute;
          bottom: -6px;
          left: 50%;
          transform: translateX(-50%);
          width: 0;
          height: 0;
          border-left: 6px solid transparent;
          border-right: 6px solid transparent;
          border-top: 6px solid #336699;
        }

    .tab-item.active-tab {
      background-color: #d8f1ff;
      border-bottom: 2px solid #336699;
      color: #336699;
      font-weight: bold;
    }

    .sub-tab-item.active-sub-tab {
      background-color: #d8f1ff;
      border: 1px dotted #336699;
      color: #336699;
      font-weight: bold;
      border-radius:8px
    }

    .tab-item .arrow-down, .sub-tab-item .arrow-down-sub {
      position: absolute;
      bottom: -6px;
      left: 50%;
      transform: translateX(-50%);
      width: 0;
      height: 0;
      border-left: 6px solid transparent;
      border-right: 6px solid transparent;
      border-top: 6px solid #336699;
    }

    .tab-item:hover, .sub-tab-item:hover {
      background-color: #eaf4fc;
      
    }

    @media (max-width: 768px) {
      .main-tabs, .sub-tabs {
        flex-direction: column;
      }
    }
  `}
</style>

            

              {/* Search, Export, Share, Custom Date Filter and Other Original Functionalities */}
              <div className="card-header align-items-center gap-2 flex-wrap">
              

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
                        <tr className="fw-bold fs-7">
                                               {/* Static Columns */}
                                               <th className="min-w-50px  ps-4 rounded-start text-nowrap">Sr. No.</th>
                                               <th className="min-w-100px text-nowrap">Edit Form</th>
                                               <th className="min-w-100px text-nowrap">View Form</th>
                                               <th className="min-w-100px text-nowrap">Take Action</th>
                                               {/* Dynamic Columns */}
                                               {/* Table Headers based on selected Tab */}
                                              {/* Dynamic Columns */}
                        {formData[selectedTab]?.fields.slice(1).map((field: boolean | React.ReactChild | React.ReactFragment | React.ReactPortal | null | undefined, index: React.Key | null | undefined) => (
                          <th key={index} className="min-w-100px">{field}</th>
                        ))}
                                               <th className=" text-right rounded-end text-nowrap">View Documents</th>
                                             </tr>
                      </thead>
                      <tbody 
                      // className="fw-semibold text-gray-600"
                      >
                        {filteredData.length === 0 ? (
                                                <tr>
                                                  <td colSpan={formData[selectedTab]?.fields.length} className="text-center">
                                                    No data available
                                                  </td>
                                                </tr>
                                              ) : (
                                                filteredData.map((item, index) => (
                                                  <tr key={index}  className="fs-7">
                                                   {/* Static Action Buttons */}
                                                   <td className="ps-4 rounded-start">
                                                   <div className='d-flex align-items-center'>
                                                <div className='d-flex justify-content-start flex-column'>
                                                  <span className='text-dark fw-bold text-hover-primary fs-7'>
                                                    {item.srNo}
                                                    </span>
                                                    </div>
                                                    </div>
                                                    </td>
                                                    <td >
                                                      <button
                                                        className="btn btn-icon btn-light-primary btn-sm"
                                                        onClick={() => handleEditForm(item)}
                                                      >
                                                        <KTSVG path="/media/icons/duotune/art/art005.svg" className="svg-icon-2" />
                                                      </button>
                                                    </td>
                                                    <td>
                                                      <button
                                                        className="btn btn-icon btn-light-primary btn-sm"
                                                        onClick={() => handleViewForm(item)}
                                                      >
                                                        <KTSVG path="/media/icons/duotune/files/fil003.svg" className="svg-icon-2" />
                                                      </button>
                                                    </td>
                                                    <td>
                                                      <button
                                                        className="btn btn-icon btn-light-primary btn-sm"
                                                        onClick={() => handleTakeAction(item)}
                                                      >
                                                        <KTSVG path="/media/icons/duotune/general/gen019.svg" className="svg-icon-2" />
                                                      </button>
                                                    </td>
                                                    {/* Dynamic Data Columns */}
                                                    {formData[selectedTab]?.fields.slice(1).map((field: string | number, idx: React.Key | null | undefined) => (
                        
                                                      <td key={idx}>
                                                        <div className='d-flex align-items-center'>
                                                <div className='d-flex justify-content-start flex-column'>
                                                  <span className='text-dark fw-bold text-hover-primary fs-7'>
                                                        {item[field]}
                                                        </span>
                                                </div>
                                              </div>
                                                        </td>
                                                    ))}
                                                    <td>
                                                      <button
                                                        className="btn btn-icon btn-light-primary btn-sm"
                                                        onClick={() => handleViewDocuments(item)}
                                                      >
                                                        <KTSVG path="/media/icons/duotune/files/fil012.svg" className="svg-icon-2" />
                                                      </button>
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

              </div>

              {/* Modals */}
     {/* Modals */}
     <EditFormModal
  show={isEditModalOpen}
  onClose={handleCloseModal}
  rowData={selectedRowData}
/>


      <ViewFormModal
        show={isModalOpen}
        onClose={handleCloseModal}
        rowData={selectedRowData}
      />
      <ActionModal
        show={isActionModalOpen}
        onClose={handleCloseModal}
        rowData={selectedRowData}
      />
      <ViewDocumentsModal
        show={isDocumentModalOpen}
        onClose={handleCloseModal}
        documents={selectedRowData?.documentUpload || []}
      />

              {/* <UpdateInvoice
  show={showUpdateModal}
  handleClose={() => setShowUpdateModal(false)}
  invoiceData={selectedInvoice || {}}
  handleUpdate={handleUpdateInvoice}
/> */}
            </div>
        </div>
      </div>
    </>
  )
}

export {ApplicationList}