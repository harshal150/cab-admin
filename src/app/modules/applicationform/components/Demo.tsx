import React, { FC, useEffect, useState } from 'react';
import LoadingDataTables from '../../../../_metronic/partials/widgets/loader/LoadingDataTables';
import { KTSVG } from '../../../../_metronic/helpers';
import { useAuth } from '../../auth';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { Button, Modal } from 'react-bootstrap';
import ActionModal from './ActionModal';
import EditFormModal from './EditFormModal';
import ViewDocumentsModal from './ViewDocumentsModal';
import ViewFormModal from './ViewFormModal';

const Demo: FC = () => {
  const [formData, setFormData] = useState<any[]>([]); // Dynamic form data
  const [filteredData, setFilteredData] = useState<any[]>([]); // Filtered form data
  const [selectedTab, setSelectedTab] = useState<number>(0); // Track selected tab
  const [selectedStage, setSelectedStage] = useState<number>(0); // Track selected stage (sub-option)
  const [selectedRowData, setSelectedRowData] = useState<any | null>(null); // To store selected row data for modals
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
        // {
        //   id: 2,
        //   name: 'Admission Form',
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
        //   id: 2,
        //   name: 'Admission Form',
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
        //   id: 2,
        //   name: 'Admission Form',
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
        //   id: 2,
        //   name: 'Admission Form',
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
        //   id: 2,
        //   name: 'Admission Form',
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
        //   name: 'mission Form',
        //   stages: ['New Admission', 'Pending', 'Approved', 'Rejected'], // Add stages for this form
        //   fields: ['srNo', 'firstName', 'lastName', 'emailId', 'status'],
        //   data: Array.from({ length: 15 }, (_, i) => ({
        //     srNo: i + 1,
        //     firstName: `FirstName${i}`,
        //     lastName: `LastName${i}`,
        //     emailId: `user${i}@example.com`,
        //     status: i % 2 === 0 ? 'Paid' : 'Pending',
        //     stage: ['New Admission', 'Pending', 'Approved', 'Rejected'][i % 4], // Random stage assignment
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

  const handleTabChange = (tabIndex: number) => {
    setSelectedTab(tabIndex);
    setSelectedStage(0); // Reset stage selection when changing the form
    setSearchQuery('');  // Reset search query
    setStatusFilter('all');  // Reset payment type filter
    setStartDate('');  // Clear start date filter
    setEndDate('');  // Clear end date filter

    // Switch between the different form data based on selected tab
    // setFilteredData(formData[tabIndex].data);

    // Apply the stage filter for the new tab
    // applyStageFilter(formData[tabIndex].stages[0]); // Default to first stage
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

    if (type !== 'all') {
      filtered = filtered.filter((item) => item.status === type);
    }

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

  // Paginated data
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const handlePageChange = (pageNumber: number) => setCurrentPage(pageNumber);
  const handleItemsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1); // Reset to first page on items per page change
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
      <div className="app-main flex-column flex-row-fluid" id="kt_app_main">
        <div className="d-flex flex-column flex-column-fluid py-2">
          <div id="kt_app_content" className="app-content flex-column-fluid">
            <div className="card card-flush">
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
  <div className="sub-tabs mx-7 mb-3 "
  style={{
    top: `${subTabPosition.top}px`,
    left: `${subTabPosition.left}px`,
    transform: 'translateX(0)', // Center align
  }}
  >
    <div className="d-flex align-items-center">
  <h6 className="mb-0 ms-2">Application Stage:</h6>
</div>

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
      padding: 10px 20px; /* Add padding */
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
      padding: 12px 20px;
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
      margin-top: 8px;
      margin-bottom: 8px;
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








              {/* Table Section */}
              <div className="card-body pt-0">
                <div className="table-responsive">
                  <table className="table table-row-dashed table-row-gray-300 align-middle gs-0 gy-4">
                    <thead style={{ backgroundColor: '#F1FAFF' }}>
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
                    <tbody>
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


    </>
  );
};

export { Demo };
