import React, { FC, useEffect, useState } from 'react'
import { useFormikContext } from 'formik'
import { KTSVG } from '../../../../_metronic/helpers'
import { Link } from 'react-router-dom'

const MerchantOnboardingStep6: FC = () => {
  const { values } = useFormikContext<any>(); // Access form values
  const [group1MaxHeight, setGroup1MaxHeight] = useState<number>(0);
  const [group2MaxHeight, setGroup2MaxHeight] = useState<number>(0);

  useEffect(() => {
    // Calculate the maximum height for Group 1 (Section 1 and Section 2)
    const group1Containers = document.querySelectorAll('.group-1');
    let maxGroup1Height = 0;
    group1Containers.forEach(container => {
      const height = container.clientHeight;
      if (height > maxGroup1Height) {
        maxGroup1Height = height;
      }
    });
    setGroup1MaxHeight(maxGroup1Height);

    // Calculate the maximum height for Group 2 (Section 3 and Logo)
    const group2Containers = document.querySelectorAll('.group-2');
    let maxGroup2Height = 0;
    group2Containers.forEach(container => {
      const height = container.clientHeight;
      if (height > maxGroup2Height) {
        maxGroup2Height = height;
      }
    });
    setGroup2MaxHeight(maxGroup2Height);
  }, []);

  return (
    <div className='container'>
      {/* Page Title and Description */}
      <div className='pb-8 pb-lg-10 text-center'>
        <h2 className='fw-bold text-dark'>Review Your Submission</h2>
        <p className='text-gray-500'>
          Please review all the information you have entered before submitting. You can go back to each section to make changes if needed.
        </p>
      </div>

      {/* Group 1: Section 1 and Section 2 */}
      <div className='row g-6 mb-6'>
        {/* Section 1 Preview: Partner Selection */}
        <div className='col-md-6'>
          <div className='card card-custom shadow-sm p-4 section-container group-1' style={{ minHeight: `${group1MaxHeight}px` }}>
            <div className='section-title'>
              <h4>Section 1: Partner Selection</h4>
            </div>
            <div className='card-body'>
              <p className='fw-bold text-gray-700'>Selected Partner ID:</p>
              <p className='text-gray-800'>{values.accountType || 'N/A'}</p>
            </div>
          </div>
        </div>

        {/* Section 2 Preview: Industry & Segment */}
        <div className='col-md-6'>
          <div className='card card-custom shadow-sm p-4 section-container group-1' style={{ minHeight: `${group1MaxHeight}px` }}>
            <div className='section-title'>
              <h4>Section 2: Industry & Segment</h4>
            </div>
            <div className='card-body'>
              <p className='fw-bold text-gray-700'>Industry:</p>
              <p className='text-gray-800'>{values.industry?.label || 'N/A'}</p>
              <p className='fw-bold text-gray-700'>Segment:</p>
              <p className='text-gray-800'>{values.segment?.label || 'N/A'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Group 2: Section 3 and Logo */}
      <div className='row g-6 mb-6'>
        <div className='col-md-6'>
          <div className='card card-custom shadow-sm p-4 section-container group-2' style={{ minHeight: `${group2MaxHeight}px` }}>
            <div className='section-title'>
              <h4>Section 3: Merchant Details</h4>
            </div>
            <div className='card-body'>
              <p className='fw-bold text-gray-700'>Merchant Name:</p>
              <p className='text-gray-800'>{values.merchantName || 'N/A'}</p>
              <p className='fw-bold text-gray-700'>Business Email:</p>
              <p className='text-gray-800'>{values.businessEmail || 'N/A'}</p>
              <p className='fw-bold text-gray-700'>Merchant Contact:</p>
              <p className='text-gray-800'>{values.merchantContact || 'N/A'}</p>
              <p className='fw-bold text-gray-700'>Merchant Type:</p>
              <p className='text-gray-800'>{values.businessType || 'N/A'}</p>
            </div>
          </div>
        </div>

        <div className='col-md-6'>
          <div className='card card-custom shadow-sm p-4 section-container group-2 d-flex flex-column align-items-center' style={{ minHeight: `${group2MaxHeight}px` }}>
            <div className='section-title'>
              <h4>Section 3: Merchant Logo</h4>
            </div>
            <div className='card-body d-flex flex-column align-items-center justify-content-center'>
              <img
                src={values.merchantLogo ? URL.createObjectURL(values.merchantLogo) : '/media/avatars/blank.png'}
                alt='Merchant Logo'
                style={{ width: '150px', height: '150px', objectFit: 'contain', borderRadius: '8px' }}
                className='shadow-sm'
              />
            </div>
          </div>
        </div>
      </div>

      {/* Section 4: Selected Plan */}
      <div className='card card-custom shadow-sm p-4 mb-6'>
        <div className='section-title'>
          <h4>Section 4: Selected Plan</h4>
        </div>
        <div className='card-body'>
          <p className='fw-bold text-gray-700'>Plan:</p>
          <p className='text-gray-800'>{values.selectedPlan || 'N/A'}</p>
        </div>
      </div>

      {/* Section 5: Payment Gateway */}
      <div className='card card-custom shadow-sm p-4 mb-6'>
        <div className='section-title'>
          <h4>Section 5: Payment Gateway</h4>
        </div>
        <div className='card-body'>
          <p className='fw-bold text-gray-700'>Payment Gateway Type:</p>
          <p className='text-gray-800'>{values.businessType || 'N/A'}</p>
          <p className='fw-bold text-gray-700'>Key/TID/ICID:</p>
          <p className='text-gray-800'>{values.merchantContact || 'N/A'}</p>
          <p className='fw-bold text-gray-700'>Secret Key:</p>
          <p className='text-gray-800'>{values.merchantContact || 'N/A'}</p>
          <p className='fw-bold text-gray-700'>Secret Code:</p>
          <p className='text-gray-800'>{values.merchantContact || 'N/A'}</p>
        </div>
      </div>

      {/* Submission Button */}
      <div className='text-center mt-6'>
        <button
          type='submit'
          className='btn btn-lg btn-primary'
          style={{ minWidth: '200px', borderRadius: '8px' }}
        >
          Submit
        </button>
      </div>

      {/* Custom Styles */}
      <style>{`
        .section-title {
          background-color: #f7f7f7;
          padding: 10px;
          border-radius: 4px;
          text-align: center;
          margin-bottom: 15px;
        }

        .section-title h4 {
          font-size: 1.1rem;
          font-weight: 600;
          color: #333;
          margin: 0;
        }

        .card-custom {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          border-radius: 8px;
        }

        .card-custom:hover {
          transform: translateY(-5px);
          box-shadow: 0px 10px 20px rgba(0, 0, 0, 0.15);
        }

        .card-body {
          background: #fff;
          border-radius: 6px;
          padding: 1.5rem;
        }

        .section-container {
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          border-radius: 10px;
          overflow: hidden;
          transition: box-shadow 0.3s ease;
        }

        .section-container:hover {
          box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
        }
      `}</style>
    </div>
  )
}

export { MerchantOnboardingStep6 }
