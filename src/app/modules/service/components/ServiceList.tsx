import React, { FC, useEffect, useState } from 'react'
import {
    TablesWidget11
} from '../../../../_metronic/partials/widgets'
import LoadingDataTables from '../../../../_metronic/partials/widgets/loader/LoadingDataTables'
import { getIndustryList, getSegmentListByIndustry } from '../../merchant/core/_requests';
import { IndustriesResponse, ReactSelectOption, SegmentListByIndustryResponse, SelectOption } from '../../merchant/core/_models';
import { CreateAppModal } from './CreateServiceModal';
import Select, { SingleValue } from 'react-select'

const ServiceList: FC = () => {

    const [showCreateAppModal, setShowCreateAppModal] = useState<boolean>(false)
    const [SegmentList, setSegmentList] = useState<SegmentListByIndustryResponse | []>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchSegmentList = async () => {
            try {
                console.log('Fetching partners list...');

                const SegmentData = await getSegmentListByIndustry(2);
                if (SegmentData.success == true) {
                    setIsLoading(false);
                    // const SegmentList = Array<SelectOption>

                    setSegmentList(SegmentData);
                }
            } catch (error) {
                console.error('Error fetching partners list:', error);
            }
        };

        fetchSegmentList();

        return () => {
            // Perform any cleanup (if needed) when the component is unmounted
        };
    }, []);

    const [industryOptions, setIndustryOptions] = useState<ReactSelectOption>();
    const [segmentOptions, setSegmentOptions] = useState<ReactSelectOption>();
    const [currentStepData, setCurrentStepData] = useState({
        industry: null,
        segment: null,
    });

    useEffect(() => {
        const fetchIndustryList = async () => {
            try {
                console.log('Fetching partners list...');

                const industryData = await getIndustryList();
                if (industryData.success == true) {
                    // const industryList = Array<SelectOption>

                    const industryList = industryData.data.map((industry) => ({
                        value: industry.id,
                        label: industry.name,
                    }));
                    setIndustryOptions(industryList);
                }
            } catch (error) {
                console.error('Error fetching partners list:', error);
            }
        };

        fetchIndustryList();

        return () => {
            // Perform any cleanup (if needed) when the component is unmounted
        };
    }, []); // Empty dependency array means this effect runs only once on mount
    const handleChange = (option: SingleValue<SelectOption | null>, actionMeta: { name: any; }) => {
        const { name } = actionMeta;
        // if (name == 'industry' && option?.value != undefined) {
        //     getSegmentByIndustry(option?.value);
        // }
        setCurrentStepData((prevState) => ({
            ...prevState,
            [name]: option,
        }));
        console.log(`Selected ${name} value:`, option ? option.value : null);
    };
    return (
        <>
            <div className="app-main flex-column flex-row-fluid" id="kt_app_main" style={{ marginTop: "-26px", marginBottom: "-26px" }}>
                <div className="d-flex flex-column flex-column-fluid py-2">
                    <div id="kt_app_content" className="app-content flex-column-fluid">
                        <div id="kt_app_content_container" className="app-container container-xxl"></div>
                        <div className="card card-flush">
                            <div className="card-header align-items-center py-3 gap-2 gap-md-12" style={{ marginBottom: "-51px" }}>
                                <ul className="nav nav-tabs nav-line-tabs nav-line-tabs-2x border-transparent fs-6 fw-semibold mb-15"
                                    role="tablist">
                                    <li className="nav-item" role="presentation">
                                        <a className="nav-link text-active-primary pb-2 active" data-bs-toggle="tab"
                                            href="#kt_ecommerce_settings_general" aria-selected="true" role="tab">
                                            <span className="svg-icon svg-icon-2 me-2">
                                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path
                                                        d="M11 2.375L2 9.575V20.575C2 21.175 2.4 21.575 3 21.575H9C9.6 21.575 10 21.175 10 20.575V14.575C10 13.975 10.4 13.575 11 13.575H13C13.6 13.575 14 13.975 14 14.575V20.575C14 21.175 14.4 21.575 15 21.575H21C21.6 21.575 22 21.175 22 20.575V9.575L13 2.375C12.4 1.875 11.6 1.875 11 2.375Z"
                                                        fill="currentColor"></path>
                                                </svg>
                                            </span>
                                            Service List</a>
                                    </li>

                                </ul>
                                <div className="" style={{ marginTop: "-25px" }}>

                                    <div className="d-flex flex-column mb-8 fv-row">
                                        <div className="d-flex flex-stack gap-5 mb-3">
                                            <button type="button" className='btn btn-primary'
                                                onClick={() => {
                                                    setShowCreateAppModal(true);
                                                }}>Add</button>
                                            {/* <div className="slider">
                                                <input type="checkbox" name="slider" className="slider-checkbox" id="sliderSwitch" />
                                                <label className="slider-label" htmlFor="sliderSwitch">
                                                    <span className="slider-inner"></span>
                                                    <span className="slider-circle"></span>
                                                </label>
                                            </div> */}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="card-header align-items-center gap-2 gap-md-5">
                                <div className="card-title gap-5">
                                    <div className="w-240px">
                                        <select className="form-select form-select-solid" data-control="select2" data-hide-search="true"
                                            data-placeholder="Status" data-kt-ecommerce-order-filter="status">
                                            <option value="all">All Services</option>
                                            <option value="Completed">ACTIVE</option>
                                            <option value="In Transit">INACTIVE</option>
                                        </select>
                                    </div>
                                    {/* <div className="w-140px">
                                        <select className="form-select form-select-solid" data-control="select2" data-hide-search="true"
                                            data-placeholder="Status" data-kt-ecommerce-order-filter="status">
                                            <option value="all">All Industry</option>
                                            {industryOptions?.map((industry) => (
                                                <option key={industry.value} value={industry.value}>{industry.label}</option>
                                            ))}
                                        </select>
                                    </div> */}
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
                                        <input type="text" data-kt-ecommerce-order-filter="search"
                                            className="form-control form-control-solid w-250px ps-14" placeholder="Search Service" />
                                    </div>
                                    <div id="kt_ecommerce_report_returns_export" className="d-none"></div>
                                    <div className="card-toolbar flex-row-fluid justify-content-end gap-5">
                                        {/* <input className="form-control form-control-solid w-100 mw-250px" placeholder="Pick date range"
                                            id="kt_ecommerce_report_returns_daterangepicker" /> */}
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
                                                <a href="#" className="menu-link px-3" data-kt-ecommerce-export="copy">Copy to clipboard
                                                </a>
                                            </div>
                                            <div className="menu-item px-3">
                                                <a href="#" className="menu-link px-3" data-kt-ecommerce-export="excel">Export as Excel

                                                </a>
                                            </div>
                                            <div className="menu-item px-3">
                                                <a href="#" className="menu-link px-3" data-kt-ecommerce-export="csv">Export as CSV

                                                </a>
                                            </div>
                                            <div className="menu-item px-3">
                                                <a href="#" className="menu-link px-3" data-kt-ecommerce-export="pdf">Export as PDF
                                                </a>
                                            </div>
                                        </div>
                                        <div id="kt_ecommerce_report_shipping_export" className="d-none"></div>
                                        <button type="button" className="btn btn-light-primary" data-kt-menu-trigger="click"
                                            data-kt-menu-placement="bottom-end">
                                            <span className="svg-icon svg-icon-2">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                                    className="bi bi-share-fill" viewBox="0 0 16 16">
                                                    <path
                                                        d="M11 2.5a2.5 2.5 0 1 1 .603 1.628l-6.718 3.12a2.5 2.5 0 0 1 0 1.504l6.718 3.12a2.5 2.5 0 1 1-.488.876l-6.718-3.12a2.5 2.5 0 1 1 0-3.256l6.718-3.12A2.5 2.5 0 0 1 11 2.5" />
                                                </svg>
                                            </span>
                                        </button>
                                        <div id="transaction_report_share_menu"
                                            className="menu menu-sub menu-sub-dropdown menu-column menu-rounded menu-gray-600 menu-state-bg-light-primary fw-semibold fs-7 w-200px py-4"
                                            data-kt-menu="true">
                                            <div className="menu-item px-3">
                                                <a href="#" className="menu-link px-3" data-kt-ecommerce-export="copy">Copy to clipboard

                                                </a>
                                            </div>
                                            <div className="menu-item px-3">
                                                <a href="#" className="menu-link px-3" data-kt-ecommerce-export="excel">Export as Excel

                                                </a>
                                            </div>
                                            <div className="menu-item px-3">
                                                <a href="#" className="menu-link px-3" data-kt-ecommerce-export="csv">Export as CSV

                                                </a>
                                            </div>
                                            <div className="menu-item px-3">
                                                <a href="#" className="menu-link px-3" data-kt-ecommerce-export="pdf">Export as PDF

                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="card-body pt-0 ">
                                    {isLoading ? <LoadingDataTables /> :
                                        <div className="table-responsive">
                                            <table className="loading-table table align-middle table-row-dashed gy-3 gs-7 " id="kt_ecommerce_report_returns_table">
                                                <thead>
                                                    <tr className="fw-bold text-gray-400 bg-light-warning text-uppercase">
                                                        <th className="min-w-100px ps-4  rounded-start">id</th>
                                                        <th className="min-w-100px">Name</th>
                                                        <th className="min-w-100px">Description</th>
                                                        {/* <th className="min-w-100px">Status</th>
                                                        <th className="text-end min-w-75px">No. Orders</th> */}
                                                        <th className="text-center rounded-end">isActive</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="fw-semibold text-gray-600">
                                                    {Array.isArray(SegmentList) ? (
                                                        <p>No industries available</p>
                                                    ) : (
                                                        SegmentList.data.map((Segment) => (
                                                            <tr key={Segment.id}>

                                                                <td className="">{Segment.id}</td>
                                                                <td className="">{Segment.name}</td>
                                                                <td className="">{Segment.descrition}</td>
                                                                <td className="">{(Segment.isActive == 'Y') ? "Active" :
                                                                    "Not Active"}</td>
                                                            </tr>
                                                        ))
                                                    )}
                                                </tbody>
                                            </table >
                                        </div>
                                    }
                                    {/* <LoadingDataTables /> */}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <CreateAppModal show={showCreateAppModal} handleClose={() => setShowCreateAppModal(false)} />
            {/* <TablesWidget11 className='mb-5 mb-xl-8' /> */}
        </>
    )
}

export { ServiceList }