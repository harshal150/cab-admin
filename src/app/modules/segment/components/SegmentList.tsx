import React, { FC, useEffect, useState } from 'react';
import LoadingDataTables from '../../../../_metronic/partials/widgets/loader/LoadingDataTables';
import { CreateSegmentModal } from './CreateSegmentModal';  
import { getIndustryList } from '../../merchant/core/_requests'; 
import { IndustriesResponse } from '../../merchant/core/_models';
import { KTSVG } from '../../../../_metronic/helpers';

interface Segment {
  id: number;
  name: string;
  description: string;
  isActive: string;
  industry: string; // Add industry property
}

interface IndustryOption {
  value: number;
  label: string;
}

const SegmentList: FC = () => {
  const [segmentList, setSegmentList] = useState<Segment[]>([]);
  const [filteredSegmentList, setFilteredSegmentList] = useState<Segment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateSegmentModal, setShowCreateSegmentModal] = useState<boolean>(false);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Hardcoded industry options for now
  const hardcodedIndustryOptions: IndustryOption[] = [
    { value: 1, label: 'Industry A' },
    { value: 2, label: 'Industry B' },
    { value: 3, label: 'Industry C' },
    { value: 4, label: 'Industry D' },
  ];

  useEffect(() => {
    // Sample data for segments, including the industry
    const sampleSegmentData: Segment[] = [
      { id: 1, name: 'Segment A', description: 'Description A', isActive: 'Y', industry: 'Industry A' },
      { id: 2, name: 'Segment B', description: 'Description B', isActive: 'N', industry: 'Industry B' },
      { id: 3, name: 'Segment C', description: 'Description C', isActive: 'Y', industry: 'Industry C' },
    ];
    
    // Set sample data for segments and mark as not loading
    setSegmentList(sampleSegmentData);
    setFilteredSegmentList(sampleSegmentData);
    setIsLoading(false);
  }, []);

  // Handle search functionality
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    filterSegments(query, statusFilter);
  };

  // Handle status filter change
  const handleStatusFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const status = e.target.value;
    setStatusFilter(status);
    filterSegments(searchQuery, status);
  };

  // Filter segments based on search and status
  const filterSegments = (search: string, status: string) => {
    let filtered = segmentList.filter((segment) =>
      segment.name.toLowerCase().includes(search)
    );

    if (status !== 'all') {
      filtered = filtered.filter((segment) =>
        segment.isActive === (status === 'active' ? 'Y' : 'N')
      );
    }

    setFilteredSegmentList(filtered);
  };

  // Handle adding a new segment
  const addSegment = (newSegment: Segment) => {
    setSegmentList((prevSegments) => [...prevSegments, newSegment]);
    setFilteredSegmentList((prevSegments) => [...prevSegments, newSegment]);
  };

  return (
    <>
      <div className="app-main flex-column flex-row-fluid" id="kt_app_main" style={{ marginTop: '-26px', marginBottom: '-26px' }}>
        <div className="d-flex flex-column flex-column-fluid py-2">
          <div id="kt_app_content" className="app-content flex-column-fluid">
            <div id="kt_app_content_container" className="app-container container-xxl"></div>
            <div className="card card-flush">
              {/* Header Section */}
              <div className="card-header align-items-center py-3 gap-2 gap-md-12">
                <h3 className="card-title">Segment List</h3>
                <div className="d-flex gap-3">
                  <button
                    type="button"
                    className="btn btn-primary"
                    style={{backgroundColor: '#1e1e2d'}}
                    onClick={() => setShowCreateSegmentModal(true)}
                  >
                    <KTSVG path='/media/icons/duotune/general/gen035.svg'  className='svg-icon-2'></KTSVG>
                    Add Segment
                  </button>
                </div>
              </div>

              {/* Filters Section */}
              <div className="card-header align-items-center gap-2 gap-md-5">
                <div className="w-240px">
                  <select
                    className="form-select form-select-solid"
                    data-control="select2"
                    data-hide-search="true"
                    data-placeholder="Filter by Status"
                    value={statusFilter}
                    onChange={handleStatusFilterChange}
                  >
                    <option value="all">All Segments</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
                <div className="d-flex align-items-center position-relative my-1">
                  <span className="svg-icon svg-icon-1 position-absolute ms-4">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <rect opacity="0.5" x="17.0365" y="15.1223" width="8.15546" height="2" rx="1"
                        transform="rotate(45 17.0365 15.1223)" fill="currentColor" />
                      <path d="M11 19C6.55556 19 3 15.4444 3 11C3 6.55556 6.55556 3 11 3C15.4444 3 19 6.55556 19 11C19 15.4444 15.4444 19 11 19ZM11 5C7.53333 5 5 7.53333 5 11C5 14.4667 7.53333 17 11 17C14.4667 17 17 14.4667 17 11C17 7.53333 14.4667 5 11 5Z" fill="currentColor" />
                    </svg>
                  </span>
                  <input
                    type="text"
                    className="form-control form-control-solid w-250px ps-14"
                    placeholder="Search Segment"
                    value={searchQuery}
                    onChange={handleSearchChange}
                  />
                </div>

                {/* Export, Share Options */}
                <div className="card-toolbar flex-row-fluid justify-content-end gap-5">
                  <button type="button" className="btn btn-light-primary" data-kt-menu-trigger="click" data-kt-menu-placement="bottom-end">
                    <span className="svg-icon svg-icon-2">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect opacity="0.3" x="12.75" y="4.25" width="12" height="2" rx="1" transform="rotate(90 12.75 4.25)" fill="currentColor" />
                        <path
                          d="M12.0573 6.11875L13.5203 7.87435C13.9121 8.34457 14.6232 8.37683 15.056 7.94401C15.4457 7.5543 15.4641 6.92836 15.0979 6.51643L12.4974 3.59084C12.0996 3.14332 11.4004 3.14332 11.0026 3.59084L8.40206 6.51643C8.0359 6.92836 8.0543 7.5543 8.44401 7.94401C8.87683 8.37683 9.58785 8.34458 9.9797 7.87435L11.4427 6.11875C11.6026 5.92684 11.8974 5.92684 12.0573 6.11875Z"
                          fill="currentColor" />
                        <path
                          d="M18.75 8.25H17.75C17.1977 8.25 16.75 8.69772 16.75 9.25C16.75 9.80228 17.1977 10.25 17.75 10.25C18.3023 10.25 18.75 10.6977 18.75 11.25V18.25C18.75 18.8023 18.3023 19.25 17.75 19.25H5.75C5.19772 19.25 4.75 18.8023 4.75 18.25V11.25C4.75 10.6977 5.19771 10.25 5.75 10.25C6.30229 10.25 6.75 9.80228 6.75 9.25C6.75 8.69772 6.30229 8.25 5.75 8.25H4.75C3.64543 8.25 2.75 9.14543 2.75 10.25V19.25C2.75 20.3546 3.64543 21.25 4.75 21.25H18.75C19.8546 21.25 20.75 20.3546 20.75 19.25V10.25C20.75 9.14543 19.8546 8.25 18.75 8.25Z"
                          fill="currentColor" />
                      </svg>
                    </span>
                  </button>
                </div>
              </div>

              {/* Table Section */}
              <div className="card-body pt-0">
                {isLoading ? (
                  <LoadingDataTables />
                ) : (
                  <div className="table-responsive">
                    <table className="table align-middle table-row-dashed gy-3 gs-7" id="kt_ecommerce_report_returns_table">
                      <thead style={{ backgroundColor: '#1e1e2d', color: 'white' }}>
                        <tr className="fw-bold text-uppercase">
                          <th className="min-w-100px ps-4 rounded-start">ID</th>
                          <th className="min-w-100px">Name</th>
                          <th className="min-w-100px">Description</th>
                          <th className="min-w-100px">Industry</th> {/* New Industry Column */}
                          <th className="text-center rounded-end">Status</th>
                        </tr>
                      </thead>
                      <tbody className="fw-semibold text-gray-600">
                        {filteredSegmentList.length === 0 ? (
                          <tr>
                            <td colSpan={5} className="text-center">No segments available</td>
                          </tr>
                        ) : (
                          filteredSegmentList.map((segment) => (
                            <tr key={segment.id}>
                              <td>{segment.id}</td>
                              <td>{segment.name}</td>
                              <td>{segment.description}</td>
                              <td>{segment.industry}</td> {/* Display Industry */}
                              <td>{segment.isActive === 'Y' ? 'Active' : 'Inactive'}</td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal for Adding Segment */}
      {showCreateSegmentModal && (
        <CreateSegmentModal
          show={showCreateSegmentModal}
          handleClose={() => setShowCreateSegmentModal(false)}
          addSegment={addSegment} // Pass the addSegment function to the modal
        />
      )}
    </>
  );
};

export { SegmentList };
