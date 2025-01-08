import React, { FC, useState } from 'react';
import LoadingDataTables from '../../../../_metronic/partials/widgets/loader/LoadingDataTables';
import { CreateAppModal } from './CreateIndustryModal';
import { KTSVG } from '../../../../_metronic/helpers';

interface Industry {
  id: number;
  name: string;
  description: string;
  isActive: string;
}

const IndustryList: FC = () => {
  const [industryList, setIndustryList] = useState<Industry[]>([]);
  const [filteredIndustryList, setFilteredIndustryList] = useState<Industry[]>([]);
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    description: '',
    isActive: 'Y',
  });

  const [showCreateAppModal, setShowCreateAppModal] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Handle form input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle form submission to add new industry
  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (formData.id && formData.name && formData.description) {
      const newIndustry: Industry = {
        id: parseInt(formData.id),
        name: formData.name,
        description: formData.description,
        isActive: formData.isActive,
      };
      setIndustryList([...industryList, newIndustry]);
      setFilteredIndustryList([...industryList, newIndustry]);

      // Reset form fields
      setFormData({
        id: '',
        name: '',
        description: '',
        isActive: 'Y',
      });
      setShowCreateAppModal(false);
    }
  };

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    filterIndustries(query, statusFilter);
  };

  // Handle status filter change
  const handleStatusFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const status = e.target.value;
    setStatusFilter(status);
    filterIndustries(searchQuery, status);
  };

  // Filter industries based on search and status
  const filterIndustries = (search: string, status: string) => {
    let filtered = industryList.filter(industry =>
      industry.name.toLowerCase().includes(search)
    );

    if (status !== 'all') {
      filtered = filtered.filter(industry => industry.isActive === (status === 'Completed' ? 'Y' : 'N'));
    }

    setFilteredIndustryList(filtered);
  };

  return (
    <>
      <div className="app-main flex-column flex-row-fluid" id="kt_app_main" style={{ marginTop: '-26px', marginBottom: '-26px' }}>
        <div className="d-flex flex-column flex-column-fluid py-2">
          <div id="kt_app_content" className="app-content flex-column-fluid">
            <div id="kt_app_content_container" className="app-container container-xxl"></div>
            <div className="card card-flush">
              {/* Create Industry Button */}
              <div className="card-header align-items-center py-3 gap-2 gap-md-12">
                <h3 className="card-title">Industry List</h3>
                <div className="d-flex gap-3">
                <button
                  type="button"
                  className="btn btn-outline-dark border border-dark"
                  onClick={() => setShowCreateAppModal(true)}
                >
                  <KTSVG path='/media/icons/duotune/general/gen035.svg'  className='svg-icon-2'></KTSVG>
                  <span> Add Industry</span>
                </button>
                </div>
              </div>

              {/* Search, Export, Share, Custom Date Filter and Other Original Functionalities */}
              <div className="card-header align-items-center gap-2 gap-md-5">
                <div className="card-title gap-5">
                  <div className="w-240px">
                    <select
                      className="form-select form-select-solid"
                      data-control="select2"
                      data-hide-search="true"
                      data-placeholder="Status"
                      value={statusFilter}
                      onChange={handleStatusFilterChange}
                    >
                      <option value="all">All Industries</option>
                      <option value="Completed">ACTIVE</option>
                      <option value="In Transit">INACTIVE</option>
                    </select>
                  </div>
                </div>
                <div className="card-toolbar flex-row-fluid justify-content-end gap-5">
                  <div className="d-flex align-items-center position-relative my-1">
                    <span className="svg-icon svg-icon-1 position-absolute ms-4">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect opacity="0.5" x="17.0365" y="15.1223" width="8.15546" height="2" rx="1"
                          transform="rotate(45 17.0365 15.1223)" fill="currentColor" />
                        <path
                          d="M11 19C6.55556 19 3 15.4444 3 11C3 6.55556 6.55556 3 11 3C15.4444 3 19 6.55556 19 11C19 15.4444 15.4444 19 11 19ZM11 5C7.53333 5 5 7.53333 5 11C5 14.4667 7.53333 17 11 17C14.4667 17 17 14.4667 17 11C17 7.53333 14.4667 5 11 5Z"
                          fill="currentColor" />
                      </svg>
                    </span>
                    <input
                      type="text"
                      className="form-control form-control-solid w-250px ps-14"
                      placeholder="Search Industry"
                      value={searchQuery}
                      onChange={handleSearchChange}
                    />
                  </div>

                  <div id="kt_ecommerce_report_returns_export" className="d-none"></div>
                  <div className="card-toolbar flex-row-fluid justify-content-end gap-5">
                    <input className="form-control form-control-solid w-100 mw-250px" placeholder="Pick date range"
                      id="kt_ecommerce_report_returns_daterangepicker" />
                    <button type="button" className="btn btn-light-primary" data-kt-menu-trigger="click"
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
                        <a href="#" className="menu-link px-3" data-kt-ecommerce-export="copy">Copy to clipboard</a>
                      </div>
                      <div className="menu-item px-3">
                        <a href="#" className="menu-link px-3" data-kt-ecommerce-export="excel">Export as Excel</a>
                      </div>
                      <div className="menu-item px-3">
                        <a href="#" className="menu-link px-3" data-kt-ecommerce-export="csv">Export as CSV</a>
                      </div>
                      <div className="menu-item px-3">
                        <a href="#" className="menu-link px-3" data-kt-ecommerce-export="pdf">Export as PDF</a>
                      </div>
                    </div>
                    <div id="kt_ecommerce_report_shipping_export" className="d-none"></div>
                    <button type="button" className="btn btn-light-primary" data-kt-menu-trigger="click"
                      data-kt-menu-placement="bottom-end">
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
                {isLoading ? (
                  <LoadingDataTables />
                ) : (
                  <div className="table-responsive">
                    <table className="table align-middle table-row-dashed gy-3 gs-7" id="kt_ecommerce_report_returns_table">
                      <thead style={{ backgroundColor: '#1e1e2d', color: 'white',}}>
                        <tr className="fw-bold  text-uppercase">
                          <th className="min-w-100px ps-4 rounded-start">ID</th>
                          <th className="min-w-100px">Name</th>
                          <th className="min-w-100px">Description</th>
                          <th className="text-center rounded-end">isActive</th>
                        </tr>
                      </thead>
                      <tbody className="fw-semibold text-gray-600">
                        {filteredIndustryList.length === 0 ? (
                          <tr>
                            <td colSpan={4} className="text-center">
                              No industries available
                            </td>
                          </tr>
                        ) : (
                          filteredIndustryList.map((industry) => (
                            <tr key={industry.id}>
                              <td>{industry.id}</td>
                              <td>{industry.name}</td>
                              <td>{industry.description}</td>
                              <td>{industry.isActive === 'Y' ? 'Active' : 'Not Active'}</td>
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

      {/* Modal for Creating Industry */}
      {showCreateAppModal && (
        <div className="modal fade show d-block" tabIndex={-1} role="dialog">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Create Industry</h5>
                <button type="button" className="btn-close" onClick={() => setShowCreateAppModal(false)}></button>
              </div>
              <div className="modal-body">
                <form onSubmit={handleFormSubmit}>
                  <div className="mb-3">
                    <label htmlFor="industryId" className="form-label">ID</label>
                    <input
                      type="text"
                      className="form-control"
                      id="industryId"
                      name="id"
                      value={formData.id}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="industryName" className="form-label">Name</label>
                    <input
                      type="text"
                      className="form-control"
                      id="industryName"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="industryDescription" className="form-label">Description</label>
                    <input
                      type="text"
                      className="form-control"
                      id="industryDescription"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="industryStatus" className="form-label">Status</label>
                    <select
                      className="form-select"
                      id="industryStatus"
                      name="isActive"
                      value={formData.isActive}
                      onChange={handleInputChange}
                    >
                      <option value="Y">Active</option>
                      <option value="N">Not Active</option>
                    </select>
                  </div>
                  <button type="submit" className="btn btn-primary">Add Industry</button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export { IndustryList };
