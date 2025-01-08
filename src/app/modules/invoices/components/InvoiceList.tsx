import React, {FC, useState} from 'react'
import Select from 'react-select'
import { FaChevronRight, FaChevronUp} from 'react-icons/fa'
import LateFeeConfigurationModal from './LateFeeConfigurationModal'
import {toast} from 'react-toastify'
import AddReasonModal from './AddReasonModal'
import { KTSVG } from '../../../../_metronic/helpers'
import Tooltip from '@mui/material/Tooltip';

const InvoiceList: FC = () => {
  const [activeSection, setActiveSection] = useState<string | null>(null)
  const [serviceType, setServiceType] = useState<string>('Ad-hoc')
  const [selectedService, setSelectedService] = useState<string>('Maintenance')
  const [chooseBy, setChooseBy] = useState<string>('By Flat');
  const [flatTypes, setFlatTypes] = useState<{type: string; price: string}[]>([
    {type: '1BHK', price: ''},
    {type: '2BHK', price: ''},
  ])
  const [ownerTenant, setOwnerTenant] = useState<{type: string; price: string}[]>([
    {type: 'Owner', price: ''},
    {type: 'Tenant', price: ''},
  ])
  const [paymentType, setPaymentType] = useState<string>('Single Payment')
  const [selectedMembers, setSelectedMembers] = useState<any[]>([])
  const [applyLateFee, setApplyLateFee] = useState('No')
  const [showLateFeeModal, setShowLateFeeModal] = useState(false)
  // State for Purpose field
  const [purpose, setPurpose] = useState<string>('')

  // State for Publish Option
  const [publishOption, setPublishOption] = useState<string>('Immediate Publish')

  const [uploadMethod, setUploadMethod] = useState<string>('From Tally'); 

  const [reasons, setReasons] = useState<string[]>(['Reason A', 'Reason B', 'Reason C']);
  const [showAddReasonModal, setShowAddReasonModal] = useState<boolean>(false);
  const [paymentFrequency, setPaymentFrequency] = useState('');
  const [isHovered1, setIsHovered1] = useState(false);
  const [isHovered2, setIsHovered2] = useState(false);



  const toggleSection = (section: string) => {
    setActiveSection(activeSection === section ? null : section)
  }

  const members = [
    {label: 'Bhargav Karlapudi (8888999966)', value: 'Bhargav Karlapudi'},
    {label: 'Sagar Wankhade (7777888844)', value: 'Sagar Wankhade'},
    {label: 'Vineet Mishra (3333666644)', value: 'Vineet Mishra'},
    {label: 'Rahul Gupta (2222333344)', value: 'Rahul Gupta'},
    {label: 'Amit Singh (1111222233)', value: 'Amit Singh'},
    {label: 'Bharggav Karlapudi (8888999966)', value: 'Bhargav dKarlapudi'},
    {label: 'Sagarg Wankhade (7777888844)', value: 'Sagadr Wankhade'},
    {label: 'Vineeggt Mishra (3333666644)', value: 'Vinedet Mishra'},
    {label: 'Rahulg Gupta (2222333344)', value: 'Rahul dGupta'},
    {label: 'Amitg Singh (1111222233)', value: 'Amit Sdingh'},
    {label: 'Bhadrgav Karlapudi (8888999966)', value: 'Bhargav Kfarlapudi'},
    {label: 'Sagadr Wankhade (7777888844)', value: 'Sagar Wanfkhade'},
    {label: 'Vineedt Mishra (3333666644)', value: 'Vineet Mifshra'},
    {label: 'Rahul ddGupta (2222333344)', value: 'Rahul Gfupta'},
    {label: 'Amit Sdingh (1111222233)', value: 'Amit Sinfgh'},
    {label: 'Bhargsav Karlapudi (8888999966)', value: 'Bhargavw Karlapudi'},
    {label: 'Sagars Wankhade (7777888844)', value: 'Sagarw Wankhade'},
    {label: 'Vineest Mishra (3333666644)', value: 'Vineewt Mishra'},
    {label: 'Rahuls Gupta (2222333344)', value: 'Rahulw Gupta'},
    {label: 'Amit sSingh (1111222233)', value: 'Amitw Singh'},
  ]

  

  const handleMemberChange = (selected: any) => {
    setSelectedMembers(selected || [])
  }
  const updateFlatPrice = (index: number, price: string) => {
    setFlatTypes((prev) => prev.map((flat, i) => (i === index ? {...flat, price} : flat)))
  }

  const addFlatType = () => {
    setFlatTypes((prev) => [...prev, {type: `Flat ${prev.length + 1}`, price: ''}])
  }

  const updateOwnerTenantPrice = (index: number, price: string) => {
    setOwnerTenant((prev) => prev.map((row, i) => (i === index ? {...row, price} : row)))
  }

  // Handle Save from Late Fee Modal
  const handleLateFeeSave = (lateFeeConfig: any) => {
    console.log('Saved Late Fee Configuration:', lateFeeConfig)
    // Handle configuration save logic here
  }

  // Function to validate the download link
  const handleTemplateDownload = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    if (!purpose) {
      e.preventDefault()
      toast.error('Please choose a purpose first!')
    }
  }

 
  const handleAddReason = (newReason: string) => {
    setReasons((prev) => [...prev, newReason]); // Add new reason to dropdown
  };

  return (
    <div
      className='app-main flex-column flex-row-fluid'
      id='kt_app_main'
      style={{marginTop: '-45px', marginBottom: '-40px', marginLeft: '-30px', marginRight:'-30px'}}
    >
      <div className='d-flex flex-column flex-column-fluid py-2' style={{height: '90vh'}}>
        <div
          id='kt_app_content'
          className='app-content flex-column-fluid d-flex flex-column '
          style={{flex: 1}}
        >
          <div className='card card-flush d-flex flex-column px-5' style={{flex: 1,}}>
            {/* Header */}
            <div className='card-header align-items-center py-4 gap-2 gap-md-12' >
              <h3 className='card-title fw-bold text-dark'>Invoice Creation</h3>
            </div>

            {/* Content */}
            <div className='row'>
              {/* Left Column */}
              <div className='col-md-6'>
                <div className='card shadow mx-1.8' style={{ marginBottom: '7px',  border:'dotted lightblue 0.8px'}}>
                  <div
                    className='card-header d-flex align-items-center justify-content-between'
                    style={{background: 'linear-gradient(135deg, #0b4668, #35699e)'}}
                  >
                    <h4 className='fw-bold' style={{color: '#fff'}}>
                      Create
                    </h4>
                    <span className="small" style={{ color: '#fff', display: 'flex', alignItems: 'center' }}>
          From Rules/Structure&nbsp;
          {/* First Icon with Tooltip */}
          <Tooltip
          title={
            <span style={{ fontSize: '12px', color: '#F8FAFC' }}>
              <u><b>From Rules/Structure</b></u><br/>
Merchants can create invoices using predefined rules and structures, including payment terms and categories. Set up invoice templates and rules to streamline invoice creation for your customers.             </span>
          }
          arrow
          slotProps={{
            tooltip: {
              sx: {
                bgcolor: '#1E293B', // Background color
                color: '#F8FAFC', // Text color
                fontSize: '12px',
                boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.15)', // Shadow
                borderRadius: '6px',
                padding: '8px 12px',
              },
            },
            arrow: {
              sx: {
                color: '#1E293B', // Arrow color
              },
            },
          }}
        >
          <div style={{ cursor: 'pointer' }}>
            <KTSVG path="/media/icons/duotune/general/gen045.svg" className="svg-icon-2" />
          </div>
        </Tooltip>
        </span>
      </div>
                  <div className='card-body'>
                    {/* Section 1: Define Now */}
                    <p className='text-muted'>You haven’t defined any structure yet.</p>
                    <div
                      className={`mb-4 p-3 rounded ${
                        activeSection === 'define' ? 'bg-light shadow-sm' : ''
                      }`}
                      style={{
                        border: '1px solid #ddd',
                        transition: 'all 0.3s',
                      }}
                    >
                      <div
                        className='d-flex align-items-center justify-content-between'
                        onClick={() => toggleSection('define')}
                        style={{cursor: 'pointer'}}
                      >
                        <h5 className='text-dark'>Define Now</h5>
                        {activeSection === 'define' ? <FaChevronUp /> : <FaChevronRight />}
                      </div>
                      {activeSection === 'define' && (
                        <div className='mt-3 p-3 bg-white rounded border'>
                          <form>
                            {/* Choose Service */}
                            <div className='mb-3'>
                              <label className='form-label'>Choose Service</label>
                              <select
                                className='form-select'
                                value={selectedService}
                                onChange={(e) => setSelectedService(e.target.value)}
                              >
                                <option value='Maintenance'>Maintenance</option>
                                <option value='Parking'>Parking</option>
                              </select>
                            </div>

                            {/* Maintenance-specific Fields */}
                            {selectedService === 'Maintenance' && (
                              <>
                                {/* Choose Template/Rule */}
<div className="">
  <label className="form-label">Choose Template/Rule</label>
  <div style={{ display: 'flex', gap: '2px' }}>
    {/* By Flat Tab */}
    <div
      onClick={() => setChooseBy('By Flat')}
      style={{
        cursor: 'pointer',
        padding: '10px 15px',
        maxWidth:'100px',
        borderRadius: '5px 5px 0 0',
        backgroundColor: chooseBy === 'By Flat' ? '#fff' : '#f1f1f1',
        color: chooseBy === 'By Flat' ? '#336699' : '#666',
        fontWeight: chooseBy === 'By Flat' ? 'bold' : 'normal',
        border: chooseBy === 'By Flat' ? '1.5px solid #ddd' : '1.5px solid transparent',
        borderBottom: chooseBy === 'By Flat' ? 'none' : '1.5px solid #ddd',
        transition: 'all 0.3s ease',
      }}
    >
      By Flat
    </div>

    {/* By Carpet Area Tab */}
    <div
      onClick={() => setChooseBy('By Carpet Area')}
      style={{
        cursor: 'pointer',
        padding: '10px 15px',
        borderRadius: '5px 5px 0 0',
        backgroundColor: chooseBy === 'By Carpet Area' ? '#fff' : '#f1f1f1',
        color: chooseBy === 'By Carpet Area' ? '#336699' : '#666',
        fontWeight: chooseBy === 'By Carpet Area' ? 'bold' : 'normal',
        border: chooseBy === 'By Carpet Area' ? '1.5px solid #ddd' : '1.5px solid transparent',
        borderBottom: chooseBy === 'By Carpet Area' ? 'none' : '1.5px solid #ddd',
        transition: 'all 0.3s ease',
      }}
    >
      By Carpet Area
    </div>
  </div>
</div>

{/* Tab Content with Border */}
<div
  style={{
    border: '1.5px solid #ddd',
    borderRadius: '0 0 5px 5px',
    padding: '15px',
    marginTop: '-1.5px', // Align the border with the active tab
    backgroundColor: '#fff',
  }}
>
  {chooseBy === 'By Flat' && (
    <>
      {/* Rule 1 - Flat Type */}
      <div className="mb-3">
        <label className="form-label">• Rule 1 - Flat Type</label>
        <table className="table table-bordered" style={{ borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#F1FAFF' }}>
              <th className="ps-4 rounded-start">Type</th>
              <th>Price</th>
              <th className="pe-4 rounded-end">Actions</th>
            </tr>
          </thead>
          <tbody>
            {flatTypes.map((flat, index) => (
              <tr key={index}>
                <td className="ps-4">
                  {index === flatTypes.length - 1 ? (
                    <input
                      type="text"
                      className="form-control"
                      value={flat.type}
                      onChange={(e) => {
                        const updatedTypes = [...flatTypes]
                        updatedTypes[index].type = e.target.value
                        setFlatTypes(updatedTypes)
                      }}
                      placeholder="Enter type"
                    />
                  ) : (
                    flat.type
                  )}
                </td>
                <td>
                  <div className="input-group">
                    <span className="input-group-text">₹</span>
                    <input
                      type="number"
                      className="form-control"
                      value={flat.price}
                      onChange={(e) => updateFlatPrice(index, e.target.value)}
                      placeholder="Enter price"
                    />
                  </div>
                </td>
                <td className="pe-4">
                  {index === flatTypes.length - 1 ? (
                    <button
                      type="button"
                      className="btn btn-sm"
                      style={{
                        backgroundColor: '#336699',
                        color: '#fff',
                        border: 'none',
                        padding: '6px 10px',
                      }}
                      onClick={addFlatType}
                    >
                      +
                    </button>
                  ) : (
                    <button
                      type="button"
                      className="btn btn-sm btn-danger"
                      style={{
                        color: '#fff',
                        border: 'none',
                        padding: '6px 10px',
                      }}
                      onClick={() => {
                        const updatedTypes = flatTypes.filter((_, i) => i !== index)
                        setFlatTypes(updatedTypes)
                      }}
                    >
                      ×
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Rule 2 - Owner/Tenant */}
      <div className="mb-3">
        <label className="form-label">• Rule 2 - Owner/Tenant</label>
        <table className="table table-bordered" style={{ borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#F1FAFF' }}>
              <th className="ps-4 rounded-start">Type</th>
              <th>Price</th>
            </tr>
          </thead>
          <tbody>
            {ownerTenant.map((row, index) => (
              <tr key={index}>
                <td className="ps-4">{row.type}</td>
                <td>
                  <div className="input-group">
                    <span className="input-group-text">₹</span>
                    <input
                      type="number"
                      className="form-control"
                      value={row.price}
                      onChange={(e) => updateOwnerTenantPrice(index, e.target.value)}
                      placeholder="Enter price"
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )}

  {chooseBy === 'By Carpet Area' && (
    <>
      {/* Rule 1 - Carpet Area Price */}
      <div className="mb-3">
        <label className="form-label">• Rule 1 - Carpet Area Price</label>
        <small className="text-muted d-block mb-2">Price per square feet</small>
        <div className="input-group">
          <span className="input-group-text">₹</span>
          <input
            type="number"
            className="form-control"
            placeholder="Enter price per square feet"
          />
        </div>
      </div>

      {/* Rule 2 - Owner/Tenant */}
      <div className="mb-3">
        <label className="form-label">• Rule 2 - Owner/Tenant</label>
        <table className="table table-bordered" style={{ borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#F1FAFF' }}>
              <th className="ps-4 rounded-start">Type</th>
              <th>Price</th>
            </tr>
          </thead>
          <tbody>
            {ownerTenant.map((row, index) => (
              <tr key={index}>
                <td className="ps-4">{row.type}</td>
                <td>
                  <div className="input-group">
                    <span className="input-group-text">₹</span>
                    <input
                      type="number"
                      className="form-control"
                      value={row.price}
                      onChange={(e) => updateOwnerTenantPrice(index, e.target.value)}
                      placeholder="Enter price"
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )}
</div>



                              </>
                            )}

                            {/* Search/Select Members */}
<div className="mb-3 mt-3">
  <label className="form-label">Search/Select Members from List</label>
  <Select
    isMulti
    options={[{ label: 'Select All', value: 'select_all' }, ...members]}
    value={selectedMembers}
    onChange={(selected) => {
      const selectedArray = Array.isArray(selected) ? [...selected] : [];
      if (selectedArray.some((option) => option.value === 'select_all')) {
        setSelectedMembers(members);
      } else {
        setSelectedMembers(selectedArray);
      }
    }}
    placeholder="Select members"
    closeMenuOnSelect={false}
    styles={{
      menu: (base) => ({
        ...base,
        maxHeight: '200px', // Limit dropdown menu height
        overflowY: 'auto',
      }),
      control: (base) => ({
        ...base,
        maxHeight: 'auto',
      }),
      valueContainer: (base) => ({
        ...base,
        maxHeight: '100px', // Limit selected items container height
        overflowY: 'auto', // Enable scrolling
      }),
      multiValue: (base) => ({
        ...base,
        whiteSpace: 'nowrap', // Prevent wrapping of selected items
      }),
    }}
    components={{
      MenuList: (props) => (
        <div
          style={{
            maxHeight: '200px', // Limit dropdown height
            overflowY: 'auto', // Enable scrolling for dropdown
          }}
        >
          {props.children}
        </div>
      ),
    }}
  />
</div>



                          {/* Payment Frequency */}
<div className="mb-3">
  <label className="form-label">Payment Type</label>
  <div style={{ display: 'flex', gap: '10px', marginTop: '5px' }}>
    {/* One Time Option */}
    <div
      onClick={() => setPaymentType('Single Payment')}
      style={{
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '5px 12px',
        borderRadius: '20px',
        border: paymentType === 'Single Payment' ? '1.5px solid #336699' : '1px solid #ddd',
        backgroundColor: paymentType === 'Single Payment' ? '#f1f8ff' : '#f9f9f9',
        boxShadow:
          paymentType === 'Single Payment'
            ? '0 3px 8px rgba(0, 0, 0, 0.1)'
            : '0 1px 4px rgba(0, 0, 0, 0.05)',
        transition: 'all 0.3s ease',
        marginTop: '2px',
      }}
    >
      <div
        style={{
          width: '12px',
          height: '12px',
          borderRadius: '50%',
          border: paymentType === 'Single Payment' ? '4px solid #336699' : '2px solid #ddd',
          backgroundColor: paymentType === 'Single Payment' ? '#336699' : 'transparent',
          transition: 'all 0.3s ease',
        }}
      ></div>
      <span style={{ fontSize: '12px', color: '#333', fontWeight: 500 }}>One Time</span>
    </div>

    {/* Recurring Option */}
    <div
      onClick={() => setPaymentType('In Installments')}
      style={{
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '5px 12px',
        borderRadius: '20px',
        border: paymentType === 'In Installments' ? '1.5px solid #336699' : '1px solid #ddd',
        backgroundColor: paymentType === 'In Installments' ? '#f1f8ff' : '#f9f9f9',
        boxShadow:
          paymentType === 'In Installments'
            ? '0 3px 8px rgba(0, 0, 0, 0.1)'
            : '0 1px 4px rgba(0, 0, 0, 0.05)',
        transition: 'all 0.3s ease',
        marginTop: '2px',
      }}
    >
      <div
        style={{
          width: '12px',
          height: '12px',
          borderRadius: '50%',
          border: paymentType === 'In Installments' ? '4px solid #336699' : '2px solid #ddd',
          backgroundColor: paymentType === 'In Installments' ? '#336699' : 'transparent',
          transition: 'all 0.3s ease',
        }}
      ></div>
      <span style={{ fontSize: '12px', color: '#333', fontWeight: 500 }}>Recurring</span>
    </div>
  </div>
</div>



                            {/* Payment Frequency Fields */}
                            {paymentType === 'In Installments' && (
  <>
    {/* Frequency Type */}
    <div className='mb-3'>
      <label className='form-label'>Payment Frequency</label>
      <select
        className='form-select'
        value={paymentFrequency}
        onChange={(e) => setPaymentFrequency(e.target.value)} // Handle frequency change
      >
        <option value='' disabled selected>
          Select Frequency
        </option>
        <option value='Week'>Repeats Every Week</option>
        <option value='Month'>Repeats Every Month</option>
        <option value='Quarter'>Repeats Every Quarter</option>
        <option value='Year'>Repeats Every Year</option>
      </select>
    </div>

    {/* Payment Date */}
    {(paymentFrequency === 'Month' || paymentFrequency === 'Quarter' || paymentFrequency === 'Year') && (
      <div className='mb-3'>
        <label className='form-label'>Due Date</label>
        <input type='date' className='form-control' />
      </div>
    )}

    {/* Day of the Week (For Weekly Frequency) */}
    {paymentFrequency === 'Week' && (
      <div className='mb-3'>
        <label className='form-label'>Select Day of the Week</label>
        <select className='form-select'>
          <option value='' disabled selected>
            Select Day
          </option>
          <option value='Monday'>Monday</option>
          <option value='Tuesday'>Tuesday</option>
          <option value='Wednesday'>Wednesday</option>
          <option value='Thursday'>Thursday</option>
          <option value='Friday'>Friday</option>
          <option value='Saturday'>Saturday</option>
          <option value='Sunday'>Sunday</option>
        </select>
      </div>
    )}
  </>
)}


                            {paymentType === 'Single Payment' && (
                              <div className='mb-3'>
                                <label className='form-label'>Payment Due Date</label>
                                <input type='date' className='form-control' />
                              </div>
                            )}

                            {/* Apply Late Fee Field */}
                            <div className='mb-3'>
                              <label className='form-label'>Apply Late Fee?</label>
                              <div className='d-flex align-items-center'>
                                <select
                                  className='form-select'
                                  value={applyLateFee}
                                  onChange={(e) => setApplyLateFee(e.target.value)}
                                >
                                  <option value='No'>No</option>
                                  <option value='Fixed Late Fee (50.0)'>
                                    Fixed Late Fee (50.0)
                                  </option>
                                  <option value='Monthly Late Payment Fine (100.0)'>
                                    Monthly Late Payment Fine (100.0)
                                  </option>
                                </select>
                                <button
                                  type='button'
                                  className='btn btn-sm ms-2'
                                  style={{
                                    backgroundColor: '#336699',
                                    color: '#fff',
                                    whiteSpace: 'nowrap',
                                  }}
                                  onClick={() => setShowLateFeeModal(true)}
                                >
                                  + Configure Late Fee
                                </button>
                              </div>
                            </div>

                            {/* Submit Button */}
                            <div className='mt-3 d-flex justify-content-center'>
                              <button
                                type='submit'
                                className='btn btn-primary'
                                style={{
                                  backgroundColor: '#336699',
                                  border: 'none',
                                }}
                              >
                                Submit
                              </button>
                            </div>
                          </form>
                        </div>
                      )}
                    </div>

                    {/* Section 2: Quick Invoice */}
                    <p className='text-muted'>
                      Quickly create an invoice using predefined templates and settings.
                    </p>
                    <div
                      className={`mb-4 p-3 rounded ${
                        activeSection === 'quick' ? 'bg-light shadow-sm' : ''
                      }`}
                      style={{
                        border: '1px solid #ddd',
                        transition: 'all 0.3s',
                      }}
                    >
                      <div
                        className='d-flex align-items-center justify-content-between'
                        onClick={() => toggleSection('quick')}
                        style={{cursor: 'pointer'}}
                      >
                        <h5 className='text-dark'>Quick Invoice</h5>
                        {activeSection === 'quick' ? <FaChevronUp /> : <FaChevronRight />}
                      </div>
                      {activeSection === 'quick' && (
                        <div className='mt-3 p-3 bg-white rounded border'>
                          <form>
                            {/* Type of Service */}
<div className="mb-3">
  <label className="form-label">Type of Service</label>
  <div style={{ display: 'flex', gap: '10px', marginTop: '5px' }}>
    {/* Ad-hoc Option */}
    <div
      onClick={() => setServiceType('Ad-hoc')}
      style={{
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '5px 12px',
        borderRadius: '20px',
        border: serviceType === 'Ad-hoc' ? '1.5px solid #336699' : '1px solid #ddd',
        backgroundColor: serviceType === 'Ad-hoc' ? '#f1f8ff' : '#f9f9f9',
        boxShadow:
          serviceType === 'Ad-hoc'
            ? '0 3px 8px rgba(0, 0, 0, 0.1)'
            : '0 1px 4px rgba(0, 0, 0, 0.05)',
        transition: 'all 0.3s ease',
      }}
    >
      <div
        style={{
          width: '12px',
          height: '12px',
          borderRadius: '50%',
          border: serviceType === 'Ad-hoc' ? '4px solid #336699' : '2px solid #ddd',
          backgroundColor: serviceType === 'Ad-hoc' ? '#336699' : 'transparent',
          transition: 'all 0.3s ease',
        }}
      ></div>
      <span style={{ fontSize: '12px', color: '#333', fontWeight: 500 }}>Ad-hoc</span>
    </div>

    {/* My Services Option */}
    <div
      onClick={() => setServiceType('My Services')}
      style={{
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '5px 12px',
        borderRadius: '20px',
        border: serviceType === 'My Services' ? '1.5px solid #336699' : '1px solid #ddd',
        backgroundColor: serviceType === 'My Services' ? '#f1f8ff' : '#f9f9f9',
        boxShadow:
          serviceType === 'My Services'
            ? '0 3px 8px rgba(0, 0, 0, 0.1)'
            : '0 1px 4px rgba(0, 0, 0, 0.05)',
        transition: 'all 0.3s ease',
      }}
    >
      <div
        style={{
          width: '12px',
          height: '12px',
          borderRadius: '50%',
          border: serviceType === 'My Services' ? '4px solid #336699' : '2px solid #ddd',
          backgroundColor: serviceType === 'My Services' ? '#336699' : 'transparent',
          transition: 'all 0.3s ease',
        }}
      ></div>
      <span style={{ fontSize: '12px', color: '#333', fontWeight: 500 }}>My Services</span>
    </div>
  </div>
</div>


                            {/* Select Service (only for My Services) */}
                            {serviceType === 'My Services' && (
                              <div className='mb-3'>
                                <label className='form-label'>Select Service</label>
                                <select className='form-select'>
                                  <option>Service A</option>
                                  <option>Service B</option>
                                  <option>Service C</option>
                                </select>
                              </div>
                            )}

                            {/* Select Reason (only for Ad-hoc) */}
                            {serviceType === 'Ad-hoc' && (
        <div className="mb-3">
          <label className="form-label">Select Reason</label>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {/* Select Dropdown */}
            <select className="form-select">
              {reasons.map((reason, index) => (
                <option key={index} value={reason}>
                  {reason}
                </option>
              ))}
            </select>

            {/* Add Button */}
            <button
              type="button"
              className="btn btn-sm"
              style={{
                backgroundColor: '#336699',
                color: '#fff',
                border: 'none',
                whiteSpace: 'nowrap',
              }}
              onClick={() => setShowAddReasonModal(true)}
            >
              + Add
            </button>
          </div>
        </div>
      )}


                            {/* Search/Select Members */}
                            <div className='mb-3'>
                              <label className='form-label'>Search/Select Members from List</label>
                              <Select
                                isMulti
                                options={[{label: 'Select All', value: 'select_all'}, ...members]}
                                value={selectedMembers}
                                onChange={(selected) => {
                                  // Convert MultiValue to a mutable array
                                  const selectedArray = Array.isArray(selected) ? [...selected] : []
                                  if (
                                    selectedArray.some((option) => option.value === 'select_all')
                                  ) {
                                    // If "Select All" is selected, select all members
                                    setSelectedMembers(members)
                                  } else {
                                    // Otherwise, update selected members normally
                                    setSelectedMembers(selectedArray)
                                  }
                                }}
                                placeholder='Select members'
                                closeMenuOnSelect={false}
                                styles={{
                                  menu: (base) => ({
                                    ...base,
                                    maxHeight: '200px', // Limit dropdown menu height
                                    overflowY: 'auto',
                                  }),
                                  control: (base) => ({
                                    ...base,
                                    maxHeight: 'auto',
                                  }),
                                  valueContainer: (base) => ({
                                    ...base,
                                    maxHeight: '100px', // Limit selected items container height
                                    overflowY: 'auto', // Enable scrolling
                                  }),
                                  multiValue: (base) => ({
                                    ...base,
                                    whiteSpace: 'nowrap', // Prevent wrapping of selected items
                                  }),
                                }}
                                components={{
                                  MenuList: (props) => (
                                    <div
                                      style={{
                                        maxHeight: '200px', // Limit dropdown height
                                        overflowY: 'auto', // Enable scrolling for dropdown
                                      }}
                                    >
                                      {props.children}
                                    </div>
                                  ),
                                }}
                              />
                            </div>

                            {/* Amount */}
                            <div className='mb-3'>
                              <label className='form-label'>Amount</label>
                              <div className='input-group'>
                                <span className='input-group-text'>₹</span>
                                <input type='number' className='form-control' />
                              </div>
                            </div>

                            {/* Payment Frequency */}
<div className="mb-3">
  <label className="form-label">Payment Type</label>
  <div style={{ display: 'flex', gap: '10px', marginTop: '5px' }}>
    {/* One Time Option */}
    <div
      onClick={() => setPaymentType('Single Payment')}
      style={{
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '5px 12px',
        borderRadius: '20px',
        border: paymentType === 'Single Payment' ? '1.5px solid #336699' : '1px solid #ddd',
        backgroundColor: paymentType === 'Single Payment' ? '#f1f8ff' : '#f9f9f9',
        boxShadow:
          paymentType === 'Single Payment'
            ? '0 3px 8px rgba(0, 0, 0, 0.1)'
            : '0 1px 4px rgba(0, 0, 0, 0.05)',
        transition: 'all 0.3s ease',
        marginTop: '2px',
      }}
    >
      <div
        style={{
          width: '12px',
          height: '12px',
          borderRadius: '50%',
          border: paymentType === 'Single Payment' ? '4px solid #336699' : '2px solid #ddd',
          backgroundColor: paymentType === 'Single Payment' ? '#336699' : 'transparent',
          transition: 'all 0.3s ease',
        }}
      ></div>
      <span style={{ fontSize: '12px', color: '#333', fontWeight: 500 }}>One Time</span>
    </div>

    {/* Recurring Option */}
    <div
      onClick={() => setPaymentType('In Installments')}
      style={{
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '5px 12px',
        borderRadius: '20px',
        border: paymentType === 'In Installments' ? '1.5px solid #336699' : '1px solid #ddd',
        backgroundColor: paymentType === 'In Installments' ? '#f1f8ff' : '#f9f9f9',
        boxShadow:
          paymentType === 'In Installments'
            ? '0 3px 8px rgba(0, 0, 0, 0.1)'
            : '0 1px 4px rgba(0, 0, 0, 0.05)',
        transition: 'all 0.3s ease',
        marginTop: '2px',
      }}
    >
      <div
        style={{
          width: '12px',
          height: '12px',
          borderRadius: '50%',
          border: paymentType === 'In Installments' ? '4px solid #336699' : '2px solid #ddd',
          backgroundColor: paymentType === 'In Installments' ? '#336699' : 'transparent',
          transition: 'all 0.3s ease',
        }}
      ></div>
      <span style={{ fontSize: '12px', color: '#333', fontWeight: 500 }}>Recurring</span>
    </div>
  </div>
</div>

                            {/* Payment Frequency Fields */}
                            {paymentType === 'In Installments' && (
  <>
    {/* Frequency Type */}
    <div className='mb-3'>
      <label className='form-label'>Payment Frequency</label>
      <select
        className='form-select'
        value={paymentFrequency}
        onChange={(e) => setPaymentFrequency(e.target.value)} // Handle frequency change
      >
        <option value='' disabled selected>
          Select Frequency
        </option>
        <option value='Week'>Repeats Every Week</option>
        <option value='Month'>Repeats Every Month</option>
        <option value='Quarter'>Repeats Every Quarter</option>
        <option value='Year'>Repeats Every Year</option>
      </select>
    </div>

    {/* Payment Date */}
    {(paymentFrequency === 'Month' || paymentFrequency === 'Quarter' || paymentFrequency === 'Year') && (
      <div className='mb-3'>
        <label className='form-label'>Due Date</label>
        <input type='date' className='form-control' />
      </div>
    )}

    {/* Day of the Week (For Weekly Frequency) */}
    {paymentFrequency === 'Week' && (
      <div className='mb-3'>
        <label className='form-label'>Select Day of the Week</label>
        <select className='form-select'>
          <option value='' disabled selected>
            Select Day
          </option>
          <option value='Monday'>Monday</option>
          <option value='Tuesday'>Tuesday</option>
          <option value='Wednesday'>Wednesday</option>
          <option value='Thursday'>Thursday</option>
          <option value='Friday'>Friday</option>
          <option value='Saturday'>Saturday</option>
          <option value='Sunday'>Sunday</option>
        </select>
      </div>
    )}
  </>
)}

                            {paymentType === 'Single Payment' && (
                              <div className='mb-3'>
                                <label className='form-label'>Payment Due Date</label>
                                <input type='date' className='form-control' />
                              </div>
                            )}

                            {/* Apply Late Fee Field */}
                            <div className='mb-3'>
                              <label className='form-label'>Apply Late Fee?</label>
                              <div className='d-flex align-items-center'>
                                <select
                                  className='form-select'
                                  value={applyLateFee}
                                  onChange={(e) => setApplyLateFee(e.target.value)}
                                >
                                  <option value='No'>No</option>
                                  <option value='Fixed Late Fee (50.0)'>
                                    Fixed Late Fee (50.0)
                                  </option>
                                  <option value='Monthly Late Payment Fine (100.0)'>
                                    Monthly Late Payment Fine (100.0)
                                  </option>
                                </select>
                                <button
                                  type='button'
                                  className='btn btn-sm ms-2'
                                  style={{
                                    backgroundColor: '#336699',
                                    color: '#fff',
                                    whiteSpace: 'nowrap',
                                  }}
                                  onClick={() => setShowLateFeeModal(true)}
                                >
                                  + Configure Late Fee
                                </button>
                              </div>
                            </div>

                            {/* Submit Button */}
                            <div className='mt-3 d-flex justify-content-center'>
                              <button
                                type='submit'
                                className='btn btn-primary'
                                style={{backgroundColor: '#336699', border: 'none'}}
                              >
                                Submit
                              </button>
                            </div>
                          </form>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className='col-md-6'>
                <div className='card shadow mx-1.8' style={{ marginBottom: '7px', border:'dotted lightblue 0.8px'}}>
                  <div
                    className='card-header d-flex align-items-center justify-content-between'
                    style={{background: 'linear-gradient(135deg, #0b4668, #35699e)'}}
                  >
                    <h4 className='fw-bold' style={{color: '#fff'}}>
                      Import
                    </h4>
                    <span className="small" style={{ color: '#fff', display: 'flex', alignItems: 'center' }}>
          From Other Source&nbsp;
          {/* Second Icon with Tooltip */}
          <Tooltip
          title={
            <span style={{ fontSize: '12px', color: '#F8FAFC' }}>
              <u><b>From Other Source</b></u><br/>
              You can import CSV files or use Tally to define how invoices should be structured. This allows for importing external data and creating invoices for customers with ease.
            </span>
          }
          arrow
          slotProps={{
            tooltip: {
              sx: {
                bgcolor: '#1E293B', // Background color
                color: '#F8FAFC', // Text color
                fontSize: '12px',
                boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.15)', // Shadow
                borderRadius: '6px',
                padding: '8px 12px',
                marginRight:'7px'
              },
            },
            arrow: {
              sx: {
                color: '#1E293B', // Arrow color
              },
            },
          }}
        >
          <div style={{ cursor: 'pointer' }}>
            <KTSVG path="/media/icons/duotune/general/gen045.svg" className="svg-icon-2" />
          </div>
        </Tooltip>
        </span>
                  </div>
                  <div className='card-body'>
                    {/* Section 1: Bulk from CSV/Excel */}
                    <p className='text-muted'>
                      Upload your CSV or Excel file here to import data in bulk.
                    </p>
                    <div
                      className={`mb-4 p-3 rounded ${
                        activeSection === 'bulk' ? 'bg-light shadow-sm' : ''
                      }`}
                      style={{
                        border: '1px solid #ddd',
                        transition: 'all 0.3s',
                      }}
                    >
                      <div
                        className='d-flex align-items-center justify-content-between'
                        onClick={() => toggleSection('bulk')}
                        style={{cursor: 'pointer'}}
                      >
                        <h5 className='text-dark'>Bulk from CSV/Excel</h5>
                        {activeSection === 'bulk' ? <FaChevronUp /> : <FaChevronRight />}
                      </div>
                      {activeSection === 'bulk' && (
                        <div className='mt-3 p-3 bg-white rounded border'>
                          <form>
                            {/* Purpose */}
                            <div className='mb-3'>
                              <label className='form-label'>Purpose</label>
                              <select
                                className='form-select'
                                value={purpose}
                                onChange={(e) => setPurpose(e.target.value)}
                              >
                                <option value='' disabled>
                                  Select Purpose
                                </option>
                                <option value='Maintenance Payment'>Maintenance Payment</option>
                                <option value='Parking Payment'>Parking Payment</option>
                              </select>
                            </div>

                            {/* Download Template */}
                            <div className='mb-3'>
                              <a
                                href={
                                  purpose === 'Maintenance Payment' || purpose === 'Parking Payment'
                                    ? `https://test.payplatter.in/exportPayers?serviceId=735&type=Enroll&group_id=default`
                                    : undefined
                                }
                                download
                                className='text-primary'
                                onClick={(e) => {
                                  if (!purpose) {
                                    e.preventDefault()
                                    // Trigger a toast error if purpose is not selected
                                    alert('Please choose a purpose first!')
                                  }
                                }}
                              >
                                Click to download template sheet for payment data upload
                              </a>
                            </div>

                            {/* Publish Option */}
<div className="mb-3">
  <label className="form-label">Publish Option</label>
  <div style={{ display: 'flex', gap: '10px', marginTop: '5px' }}>
    {/* Create Draft Option */}
    <div
      onClick={() => setPublishOption('Create Draft')}
      style={{
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '5px 12px',
        borderRadius: '20px',
        border: publishOption === 'Create Draft' ? '1.5px solid #336699' : '1px solid #ddd',
        backgroundColor: publishOption === 'Create Draft' ? '#f1f8ff' : '#f9f9f9',
        boxShadow:
          publishOption === 'Create Draft'
            ? '0 3px 8px rgba(0, 0, 0, 0.1)'
            : '0 1px 4px rgba(0, 0, 0, 0.05)',
        transition: 'all 0.3s ease',
      }}
    >
      <div
        style={{
          width: '12px',
          height: '12px',
          borderRadius: '50%',
          border: publishOption === 'Create Draft' ? '4px solid #336699' : '2px solid #ddd',
          backgroundColor: publishOption === 'Create Draft' ? '#336699' : 'transparent',
          transition: 'all 0.3s ease',
        }}
      ></div>
      <span style={{ fontSize: '12px', color: '#333', fontWeight: 500 }}>Create Draft</span>
    </div>

    {/* Immediate Publish Option */}
    <div
      onClick={() => setPublishOption('Immediate Publish')}
      style={{
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '5px 12px',
        borderRadius: '20px',
        border: publishOption === 'Immediate Publish' ? '1.5px solid #336699' : '1px solid #ddd',
        backgroundColor: publishOption === 'Immediate Publish' ? '#f1f8ff' : '#f9f9f9',
        boxShadow:
          publishOption === 'Immediate Publish'
            ? '0 3px 8px rgba(0, 0, 0, 0.1)'
            : '0 1px 4px rgba(0, 0, 0, 0.05)',
        transition: 'all 0.3s ease',
      }}
    >
      <div
        style={{
          width: '12px',
          height: '12px',
          borderRadius: '50%',
          border: publishOption === 'Immediate Publish' ? '4px solid #336699' : '2px solid #ddd',
          backgroundColor: publishOption === 'Immediate Publish' ? '#336699' : 'transparent',
          transition: 'all 0.3s ease',
        }}
      ></div>
      <span style={{ fontSize: '12px', color: '#333', fontWeight: 500 }}>
        Immediate Publish
      </span>
    </div>
  </div>
</div>


                            {/* Payment Type */}
<div className="mb-3">
  <label className="form-label">Payment Type</label>
  <div style={{ display: 'flex', gap: '10px', marginTop: '5px' }}>
    {/* One Time Option */}
    <div
      onClick={() => setPaymentType('Single Payment')}
      style={{
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '5px 12px',
        borderRadius: '20px',
        border: paymentType === 'Single Payment' ? '1.5px solid #336699' : '1px solid #ddd',
        backgroundColor: paymentType === 'Single Payment' ? '#f1f8ff' : '#f9f9f9',
        boxShadow:
          paymentType === 'Single Payment'
            ? '0 3px 8px rgba(0, 0, 0, 0.1)'
            : '0 1px 4px rgba(0, 0, 0, 0.05)',
        transition: 'all 0.3s ease',
        marginTop: '2px',
      }}
    >
      <div
        style={{
          width: '12px',
          height: '12px',
          borderRadius: '50%',
          border: paymentType === 'Single Payment' ? '4px solid #336699' : '2px solid #ddd',
          backgroundColor: paymentType === 'Single Payment' ? '#336699' : 'transparent',
          transition: 'all 0.3s ease',
        }}
      ></div>
      <span style={{ fontSize: '12px', color: '#333', fontWeight: 500 }}>One Time</span>
    </div>

    {/* Recurring Option */}
    <div
      onClick={() => setPaymentType('In Installments')}
      style={{
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '5px 12px',
        borderRadius: '20px',
        border: paymentType === 'In Installments' ? '1.5px solid #336699' : '1px solid #ddd',
        backgroundColor: paymentType === 'In Installments' ? '#f1f8ff' : '#f9f9f9',
        boxShadow:
          paymentType === 'In Installments'
            ? '0 3px 8px rgba(0, 0, 0, 0.1)'
            : '0 1px 4px rgba(0, 0, 0, 0.05)',
        transition: 'all 0.3s ease',
        marginTop: '2px',
      }}
    >
      <div
        style={{
          width: '12px',
          height: '12px',
          borderRadius: '50%',
          border: paymentType === 'In Installments' ? '4px solid #336699' : '2px solid #ddd',
          backgroundColor: paymentType === 'In Installments' ? '#336699' : 'transparent',
          transition: 'all 0.3s ease',
        }}
      ></div>
      <span style={{ fontSize: '12px', color: '#333', fontWeight: 500 }}>Recurring</span>
    </div>
  </div>
</div>

                            {/* Payment Frequency Fields */}
                            {paymentType === 'In Installments' && (
  <>
    {/* Frequency Type */}
    <div className='mb-3'>
      <label className='form-label'>Payment Frequency</label>
      <select
        className='form-select'
        value={paymentFrequency}
        onChange={(e) => setPaymentFrequency(e.target.value)} // Handle frequency change
      >
        <option value='' disabled selected>
          Select Frequency
        </option>
        <option value='Week'>Repeats Every Week</option>
        <option value='Month'>Repeats Every Month</option>
        <option value='Quarter'>Repeats Every Quarter</option>
        <option value='Year'>Repeats Every Year</option>
      </select>
    </div>

    {/* Payment Date */}
    {(paymentFrequency === 'Month' || paymentFrequency === 'Quarter' || paymentFrequency === 'Year') && (
      <div className='mb-3'>
        <label className='form-label'>Due Date</label>
        <input type='date' className='form-control' />
      </div>
    )}

    {/* Day of the Week (For Weekly Frequency) */}
    {paymentFrequency === 'Week' && (
      <div className='mb-3'>
        <label className='form-label'>Select Day of the Week</label>
        <select className='form-select'>
          <option value='' disabled selected>
            Select Day
          </option>
          <option value='Monday'>Monday</option>
          <option value='Tuesday'>Tuesday</option>
          <option value='Wednesday'>Wednesday</option>
          <option value='Thursday'>Thursday</option>
          <option value='Friday'>Friday</option>
          <option value='Saturday'>Saturday</option>
          <option value='Sunday'>Sunday</option>
        </select>
      </div>
    )}
  </>
)}

                            {paymentType === 'Single Payment' && (
                              <div className='mb-3'>
                                <label className='form-label'>Date</label>
                                <input type='date' className='form-control' />
                              </div>
                            )}

                            {/* Apply Late Fee */}
                            <div className='mb-3'>
                              <label className='form-label'>Apply Late Fee?</label>
                              <div className='d-flex align-items-center'>
                                <select
                                  className='form-select'
                                  value={applyLateFee}
                                  onChange={(e) => setApplyLateFee(e.target.value)}
                                >
                                  <option value='No'>No</option>
                                  <option value='Fixed Late Fee (50.0)'>
                                    Fixed Late Fee (50.0)
                                  </option>
                                  <option value='Monthly Late Payment Fine (100.0)'>
                                    Monthly Late Payment Fine (100.0)
                                  </option>
                                </select>
                                <button
                                  type='button'
                                  className='btn btn-sm ms-2'
                                  style={{
                                    backgroundColor: '#336699',
                                    color: '#fff',
                                    whiteSpace: 'nowrap',
                                  }}
                                  onClick={() => setShowLateFeeModal(true)}
                                >
                                  + New Late Fee
                                </button>
                              </div>
                            </div>

                            {/* Upload CSV/Excel */}
                            <div className='mb-3'>
                              <label className='form-label'>Upload your CSV or Excel file</label>
                              <input type='file' accept='.csv,.xlsx' className='form-control' />
                            </div>

                            {/* Submit Button */}
                            <div className='mt-3 d-flex justify-content-center'>
                              <button
                                type='submit'
                                className='btn btn-primary'
                                style={{backgroundColor: '#336699', border: 'none'}}
                              >
                                Submit
                              </button>
                            </div>
                          </form>
                        </div>
                      )}
                    </div>

                    {/* Section 2: From Tally */}
                    <p className='text-muted'>Integrate with Tally to import invoices directly.</p>
                    <div
                      className={`mb-4 p-3 rounded ${
                        activeSection === 'tally' ? 'bg-light shadow-sm' : ''
                      }`}
                      style={{
                        border: '1px solid #ddd',
                        transition: 'all 0.3s',
                      }}
                    >
                      <div
                        className='d-flex align-items-center justify-content-between'
                        onClick={() => toggleSection('tally')}
                        style={{cursor: 'pointer'}}
                      >
                        <h5 className='text-dark'>From Tally</h5>
                        {activeSection === 'tally' ? <FaChevronUp /> : <FaChevronRight />}
                      </div>
                      {activeSection === 'tally' && (
                        <div className='mt-3 p-3 bg-white rounded border'>
                          <form>
                            {/* Purpose */}
                            <div className='mb-3'>
                              <label className='form-label'>Purpose</label>
                              <select
                                className='form-select'
                                value={purpose}
                                onChange={(e) => setPurpose(e.target.value)}
                              >
                                <option value='' disabled>
                                  Select Purpose
                                </option>
                                <option value='Maintenance Payment'>Maintenance Payment</option>
                                <option value='Parking Payment'>Parking Payment</option>
                              </select>
                            </div>

                            {/* Download Template */}
                            <div className='mb-3'>
                              <a
                                href={
                                  purpose === 'Maintenance Payment' || purpose === 'Parking Payment'
                                    ? `https://test.payplatter.in/exportPayers?serviceId=735&type=Enroll&group_id=default`
                                    : undefined
                                }
                                download
                                className='text-primary'
                                onClick={(e) => {
                                  if (!purpose) {
                                    e.preventDefault()
                                    // Trigger a toast error if purpose is not selected
                                    alert('Please choose a purpose first!')
                                  }
                                }}
                              >
                                Click to download template sheet for payment data upload
                              </a>
                            </div>

                            {/* Publish Option */}
<div className="mb-3">
  <label className="form-label">Publish Option</label>
  <div style={{ display: 'flex', gap: '10px', marginTop: '5px' }}>
    {/* Create Draft Option */}
    <div
      onClick={() => setPublishOption('Create Draft')}
      style={{
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '5px 12px',
        borderRadius: '20px',
        border: publishOption === 'Create Draft' ? '1.5px solid #336699' : '1px solid #ddd',
        backgroundColor: publishOption === 'Create Draft' ? '#f1f8ff' : '#f9f9f9',
        boxShadow:
          publishOption === 'Create Draft'
            ? '0 3px 8px rgba(0, 0, 0, 0.1)'
            : '0 1px 4px rgba(0, 0, 0, 0.05)',
        transition: 'all 0.3s ease',
      }}
    >
      <div
        style={{
          width: '12px',
          height: '12px',
          borderRadius: '50%',
          border: publishOption === 'Create Draft' ? '4px solid #336699' : '2px solid #ddd',
          backgroundColor: publishOption === 'Create Draft' ? '#336699' : 'transparent',
          transition: 'all 0.3s ease',
        }}
      ></div>
      <span style={{ fontSize: '12px', color: '#333', fontWeight: 500 }}>Create Draft</span>
    </div>

    {/* Immediate Publish Option */}
    <div
      onClick={() => setPublishOption('Immediate Publish')}
      style={{
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '5px 12px',
        borderRadius: '20px',
        border: publishOption === 'Immediate Publish' ? '1.5px solid #336699' : '1px solid #ddd',
        backgroundColor: publishOption === 'Immediate Publish' ? '#f1f8ff' : '#f9f9f9',
        boxShadow:
          publishOption === 'Immediate Publish'
            ? '0 3px 8px rgba(0, 0, 0, 0.1)'
            : '0 1px 4px rgba(0, 0, 0, 0.05)',
        transition: 'all 0.3s ease',
      }}
    >
      <div
        style={{
          width: '12px',
          height: '12px',
          borderRadius: '50%',
          border: publishOption === 'Immediate Publish' ? '4px solid #336699' : '2px solid #ddd',
          backgroundColor: publishOption === 'Immediate Publish' ? '#336699' : 'transparent',
          transition: 'all 0.3s ease',
        }}
      ></div>
      <span style={{ fontSize: '12px', color: '#333', fontWeight: 500 }}>
        Immediate Publish
      </span>
    </div>
  </div>
</div>


                            {/* Payment Type */}
<div className="mb-3">
  <label className="form-label">Payment Type</label>
  <div style={{ display: 'flex', gap: '10px', marginTop: '5px' }}>
    {/* One Time Option */}
    <div
      onClick={() => setPaymentType('Single Payment')}
      style={{
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '5px 12px',
        borderRadius: '20px',
        border: paymentType === 'Single Payment' ? '1.5px solid #336699' : '1px solid #ddd',
        backgroundColor: paymentType === 'Single Payment' ? '#f1f8ff' : '#f9f9f9',
        boxShadow:
          paymentType === 'Single Payment'
            ? '0 3px 8px rgba(0, 0, 0, 0.1)'
            : '0 1px 4px rgba(0, 0, 0, 0.05)',
        transition: 'all 0.3s ease',
        marginTop: '2px',
      }}
    >
      <div
        style={{
          width: '12px',
          height: '12px',
          borderRadius: '50%',
          border: paymentType === 'Single Payment' ? '4px solid #336699' : '2px solid #ddd',
          backgroundColor: paymentType === 'Single Payment' ? '#336699' : 'transparent',
          transition: 'all 0.3s ease',
        }}
      ></div>
      <span style={{ fontSize: '12px', color: '#333', fontWeight: 500 }}>One Time</span>
    </div>

    {/* Recurring Option */}
    <div
      onClick={() => setPaymentType('In Installments')}
      style={{
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '5px 12px',
        borderRadius: '20px',
        border: paymentType === 'In Installments' ? '1.5px solid #336699' : '1px solid #ddd',
        backgroundColor: paymentType === 'In Installments' ? '#f1f8ff' : '#f9f9f9',
        boxShadow:
          paymentType === 'In Installments'
            ? '0 3px 8px rgba(0, 0, 0, 0.1)'
            : '0 1px 4px rgba(0, 0, 0, 0.05)',
        transition: 'all 0.3s ease',
        marginTop: '2px',
      }}
    >
      <div
        style={{
          width: '12px',
          height: '12px',
          borderRadius: '50%',
          border: paymentType === 'In Installments' ? '4px solid #336699' : '2px solid #ddd',
          backgroundColor: paymentType === 'In Installments' ? '#336699' : 'transparent',
          transition: 'all 0.3s ease',
        }}
      ></div>
      <span style={{ fontSize: '12px', color: '#333', fontWeight: 500 }}>Recurring</span>
    </div>
  </div>
</div>

                            {/* Payment Frequency Fields */}
                            {paymentType === 'In Installments' && (
  <>
    {/* Frequency Type */}
    <div className='mb-3'>
      <label className='form-label'>Payment Frequency</label>
      <select
        className='form-select'
        value={paymentFrequency}
        onChange={(e) => setPaymentFrequency(e.target.value)} // Handle frequency change
      >
        <option value='' disabled selected>
          Select Frequency
        </option>
        <option value='Week'>Repeats Every Week</option>
        <option value='Month'>Repeats Every Month</option>
        <option value='Quarter'>Repeats Every Quarter</option>
        <option value='Year'>Repeats Every Year</option>
      </select>
    </div>

    {/* Payment Date */}
    {(paymentFrequency === 'Month' || paymentFrequency === 'Quarter' || paymentFrequency === 'Year') && (
      <div className='mb-3'>
        <label className='form-label'>Due Date</label>
        <input type='date' className='form-control' />
      </div>
    )}

    {/* Day of the Week (For Weekly Frequency) */}
    {paymentFrequency === 'Week' && (
      <div className='mb-3'>
        <label className='form-label'>Select Day of the Week</label>
        <select className='form-select'>
          <option value='' disabled selected>
            Select Day
          </option>
          <option value='Monday'>Monday</option>
          <option value='Tuesday'>Tuesday</option>
          <option value='Wednesday'>Wednesday</option>
          <option value='Thursday'>Thursday</option>
          <option value='Friday'>Friday</option>
          <option value='Saturday'>Saturday</option>
          <option value='Sunday'>Sunday</option>
        </select>
      </div>
    )}
  </>
)}

                            {paymentType === 'Single Payment' && (
                              <div className='mb-3'>
                                <label className='form-label'>Date</label>
                                <input type='date' className='form-control' />
                              </div>
                            )}

                            {/* Apply Late Fee */}
                            <div className='mb-3'>
                              <label className='form-label'>Apply Late Fee?</label>
                              <div className='d-flex align-items-center'>
                                <select
                                  className='form-select'
                                  value={applyLateFee}
                                  onChange={(e) => setApplyLateFee(e.target.value)}
                                >
                                  <option value='No'>No</option>
                                  <option value='Fixed Late Fee (50.0)'>
                                    Fixed Late Fee (50.0)
                                  </option>
                                  <option value='Monthly Late Payment Fine (100.0)'>
                                    Monthly Late Payment Fine (100.0)
                                  </option>
                                </select>
                                <button
                                  type='button'
                                  className='btn btn-sm ms-2'
                                  style={{
                                    backgroundColor: '#336699',
                                    color: '#fff',
                                    whiteSpace: 'nowrap',
                                  }}
                                  onClick={() => setShowLateFeeModal(true)}
                                >
                                  + New Late Fee
                                </button>
                              </div>
                            </div>

                            {/* Data Upload Method */}
<div className="mb-3">
  <label className="form-label">Data Upload Method</label>
  <div style={{ display: 'flex', gap: '20px' }}>
    <div className="form-check" style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
      <input
        className="form-check-input"
        type="radio"
        name="uploadMethod"
        id="fromTally"
        value="From Tally"
        checked={uploadMethod === 'From Tally'}
        onChange={(e) => setUploadMethod(e.target.value)}
        style={{
          width: '16px', // Smaller width
          height: '16px', // Smaller height
        }}
      />
      <label className="form-check-label" htmlFor="fromTally" style={{ fontSize: '14px' }}>
        From Tally (XML file)
      </label>
    </div>
    <div className="form-check" style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
      <input
        className="form-check-input"
        type="radio"
        name="uploadMethod"
        id="fromAPI"
        value="From API"
        checked={uploadMethod === 'From API'}
        onChange={(e) => setUploadMethod(e.target.value)}
        style={{
          width: '16px', // Smaller width
          height: '16px', // Smaller height
        }}
      />
      <label className="form-check-label" htmlFor="fromAPI" style={{ fontSize: '14px' }}>
        From API
      </label>
    </div>
  </div>
</div>

{/* Conditional Fields Based on Data Upload Method */}
{uploadMethod === 'From Tally' && (
  <div className="mb-3">
    <label className="form-label">Upload your XML file</label>
    <input type="file" accept=".xml" className="form-control" />
  </div>
)}

{uploadMethod === 'From API' && (
<span>API for Tally Connection</span>
  // <div className="mb-3">
  //   <label className="form-label">API Configuration</label>
  //   {/* API URL Field */}
  //   <div className="mb-3">
  //     <label className="form-label">API URL</label>
  //     <input
  //       type="text"
  //       className="form-control"
  //       placeholder="Enter API endpoint"
  //     />
  //   </div>
  //   {/* API Key Field */}
  //   <div className="mb-3">
  //     <label className="form-label">API Key</label>
  //     <input
  //       type="text"
  //       className="form-control"
  //       placeholder="Enter API key"
  //     />
  //   </div>
  //   {/* Request Payload Field */}
  //   <div className="mb-3">
  //     <label className="form-label">Request Payload</label>
  //     <textarea
  //       className="form-control"
  //       placeholder="Enter payload for API request"
  //       rows={4}
  //     ></textarea>
  //   </div>
  // </div>
)}


                            {/* Submit Button */}
                            <div className='mt-3 d-flex justify-content-center'>
                              <button
                                type='submit'
                                className='btn btn-primary'
                                style={{backgroundColor: '#336699', border: 'none'}}
                              >
                                Submit
                              </button>
                            </div>
                          </form>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Late Fee Modal */}
            <LateFeeConfigurationModal
              show={showLateFeeModal}
              onHide={() => setShowLateFeeModal(false)}
              onSave={handleLateFeeSave}
            />


            {/* Add Reason Modal Component */}
      <AddReasonModal
        show={showAddReasonModal}
        onClose={() => setShowAddReasonModal(false)}
        onAddReason={handleAddReason}
      />
          </div>
        </div>
      </div>
    </div>
  )
}

export {InvoiceList}
